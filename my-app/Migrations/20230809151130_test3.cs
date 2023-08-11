using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace staj.Migrations
{
    /// <inheritdoc />
    public partial class test3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "test",
                table: "Parseller",
                newName: "wkt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "wkt",
                table: "Parseller",
                newName: "test");
        }
    }
}
