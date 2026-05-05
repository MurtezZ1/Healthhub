using Serilog;

namespace ReactApp1.Server.Middlewares
{
    public class SecurityAuditMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityAuditMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var request = context.Request;
            var path = request.Path;
            var method = request.Method;
            var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var user = context.User.Identity?.Name ?? "Anonymous";

            // Record the incoming request as a security event
            Log.Information("SECURITY_AUDIT: User {User} from IP {IP} initiated {Method} request to {Path}", 
                user, ipAddress, method, path);

            await _next(context);

            // Record the response status for anomaly detection
            var statusCode = context.Response.StatusCode;
            if (statusCode >= 400)
            {
                Log.Warning("SECURITY_ALERT: Failed request by {User} to {Path} with status {StatusCode}", 
                    user, path, statusCode);
            }
        }
    }

    public static class SecurityAuditMiddlewareExtensions
    {
        public static IApplicationBuilder UseSecurityAudit(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SecurityAuditMiddleware>();
        }
    }
}
