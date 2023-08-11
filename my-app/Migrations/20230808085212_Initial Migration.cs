using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace staj.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Parseller",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ilParsel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ilceParsel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    mahalleParsel = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parseller", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Parseller");
        }
    }
}
