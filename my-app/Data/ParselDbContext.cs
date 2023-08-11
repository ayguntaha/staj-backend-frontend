using Microsoft.EntityFrameworkCore;
using staj.Models.Entities;

namespace staj.Data
{
    public class ParselDbContext : DbContext
    {
        public ParselDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Parsel> Parseller { get; set; }

    }
}
