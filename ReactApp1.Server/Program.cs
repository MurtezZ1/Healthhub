using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data.Models;
using StackExchange.Redis;
using Confluent.Kafka;
using Prometheus;
using Serilog;
using Serilog.Sinks.Elasticsearch;
using Polly;
using Polly.Extensions.Http;
using MongoDB.Driver;
using VaultSharp;
using VaultSharp.V1.AuthMethods.Token;
using VaultSharp.V1.AuthMethods;
using ReactApp1.Server.Middlewares;
using Elastic.Clients.Elasticsearch;
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;

var builder = WebApplication.CreateBuilder(args);

// 1. Serilog Setup with Elasticsearch (SIEM/SOAR Integration)
builder.Host.UseSerilog((context, config) =>
{
    config.ReadFrom.Configuration(context.Configuration)
          .Enrich.FromLogContext()
          .WriteTo.Console()
          .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri("http://localhost:9200"))
          {
              AutoRegisterTemplate = true,
              IndexFormat = "healthhub-security-logs-{0:yyyy.MM.dd}"
          });
});

// Vault Configuration (Secrets Management)
IAuthMethodInfo authMethod = new TokenAuthMethodInfo("root");
var vaultClientSettings = new VaultClientSettings("http://localhost:8200", authMethod);
IVaultClient vaultClient = new VaultClient(vaultClientSettings);
builder.Services.AddSingleton<IVaultClient>(vaultClient);

// Distributed Tracing (OpenTelemetry & Jaeger)
builder.Services.AddOpenTelemetry()
    .WithTracing(tracerProviderBuilder =>
    {
        tracerProviderBuilder
            .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("Healthhub.Server"))
            .AddAspNetCoreInstrumentation()
            .AddOtlpExporter(options =>
            {
                options.Endpoint = new Uri("http://localhost:4317"); // Jaeger OTLP Receiver
            });
    });

// Add services to the container
builder.Services.AddOpenApi();

// 2. Database (MySQL)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        Microsoft.EntityFrameworkCore.ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// 3. Caching (Redis Validation with Fallback)
try
{
    var redisConn = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
    var muxer = ConnectionMultiplexer.Connect(redisConn);
    builder.Services.AddSingleton<IConnectionMultiplexer>(muxer);
    Log.Information("Connected to Redis successfully.");
}
catch (Exception ex)
{
    Log.Warning("Could not connect to Redis: {Message}. Falling back to In-Memory Cache.", ex.Message);
    builder.Services.AddDistributedMemoryCache();
}

// 4. Kafka Producer (Safe)
var kafkaBootstrap = builder.Configuration["Kafka:BootstrapServers"] ?? "localhost:9092";
var producerConfig = new ProducerConfig { BootstrapServers = kafkaBootstrap };
builder.Services.AddSingleton<IProducer<Null, string>>(sp =>
    new ProducerBuilder<Null, string>(producerConfig).Build());

// 5. Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// 6. Authentication (JWT)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"] ?? "SecretKeyForDevelopmentOnly12345!!!"))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// 7. Health Checks
builder.Services.AddHealthChecks();

// Resilient HTTP Client using Polly
builder.Services.AddHttpClient("ExternalService")
    .AddPolicyHandler(HttpPolicyExtensions
        .HandleTransientHttpError()
        .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
            onRetry: (outcome, timespan, retryAttempt, context) =>
            {
                Log.Warning("Delaying for {delay}ms, then making retry {retry}.", timespan.TotalMilliseconds, retryAttempt);
            }))
    .AddPolicyHandler(HttpPolicyExtensions
        .HandleTransientHttpError()
        .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));

// Add Scoped Services
builder.Services.AddScoped<IUserService, ReactApp1.Server.Services.UserService>();
builder.Services.AddSingleton<ReactApp1.Server.Services.MedicalLogService>();

// Full-text Search (Elasticsearch Client)
var settings = new ElasticsearchClientSettings(new Uri("http://localhost:9200"))
    .DefaultIndex("healthhub-default");
var elasticClient = new ElasticsearchClient(settings);
builder.Services.AddSingleton(elasticClient);
builder.Services.AddScoped<ReactApp1.Server.Services.SearchService>();

// Configure JWT Options
builder.Services.Configure<ReactApp1.Server.Data.Models.JWT>(builder.Configuration.GetSection("JWT"));

// 8. Prometheus Metrics (Safe)
builder.Services.UseHttpClientMetrics();

// 9. MongoDB (Hybrid Storage)
var mongoClient = new MongoClient(builder.Configuration.GetConnectionString("MongoDb") ?? "mongodb://localhost:27017");
builder.Services.AddSingleton<IMongoClient>(mongoClient);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();

// Prometheus Metrics Endpoint
app.UseMetricServer();
app.UseHttpMetrics();

app.UseRouting();

// Use Immutable Audit Logs Middleware (Data Access Governance)
app.UseSecurityAudit();

app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowAll");
app.MapControllers();
app.MapHealthChecks("/health");

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        )).ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();

        var userManager = services.GetRequiredService<UserManager<User>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        await ReactApp1.Server.Data.Models.ApplicationDbContextSeed.SeedEssentialsAsync(userManager, roleManager);
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred seeding the DB.");
    }
}

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

