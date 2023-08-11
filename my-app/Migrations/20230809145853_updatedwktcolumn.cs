using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace staj.Migrations
{
    /// <inheritdoc />
    public partial class updatedwktcolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WKT",
                table: "Parseller",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WKT",
                table: "Parseller");
        }
    }
}
