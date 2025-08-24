using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using chatapp.Models;

namespace chatapp.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Renamed to 'Chatapps' to follow plural DbSet naming convention
        public virtual DbSet<Chatapp> Chatapps { get; set; } = null!;
        public object Product { get; internal set; }
    }
}