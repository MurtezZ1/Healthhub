using Confluent.Kafka;

namespace NotificationService;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IConfiguration _configuration;
    private const string Topic = "notifications";

    public Worker(ILogger<Worker> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = _configuration["Kafka:BootstrapServers"] ?? "localhost:9092",
            GroupId = "notification-consumer-group",
            AutoOffsetReset = AutoOffsetReset.Earliest
        };

        _logger.LogInformation("Notification Service Started. Listening to {Topic}", Topic);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
                consumer.Subscribe(Topic);

                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        var result = consumer.Consume(stoppingToken);
                        _logger.LogInformation($"Notification Received: {result.Message.Value}");
                        await ProcessNotification(result.Message.Value);
                    }
                    catch (ConsumeException e)
                    {
                        _logger.LogError($"Kafka Error: {e.Error.Reason}. Retrying in 5s...");
                        await Task.Delay(5000, stoppingToken);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Fatal Kafka Connection Error: {ex.Message}. Retrying to connect in 10s...");
                await Task.Delay(10000, stoppingToken);
            }
        }
    }

    private Task ProcessNotification(string message)
    {
        // Logic to send email/SMS would go here
        _logger.LogInformation("Processing notification: {Message}", message);
        return Task.CompletedTask;
    }
}
