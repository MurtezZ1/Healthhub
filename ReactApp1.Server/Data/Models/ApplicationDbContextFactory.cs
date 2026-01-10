using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ReactApp1.Server.Data.Models
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Vendos connection string-in për MySQL
            optionsBuilder.UseMySql(
                "server=localhost;port=3306;database=Healthhub;user=root;password=linalina12",
                new MySqlServerVersion(new Version(8, 0, 33))
            );

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
