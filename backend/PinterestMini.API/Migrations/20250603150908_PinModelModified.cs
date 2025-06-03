using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PinterestMini.API.Migrations
{
    /// <inheritdoc />
    public partial class PinModelModified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowComments",
                table: "Pins",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Pins",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowComments",
                table: "Pins");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Pins");
        }
    }
}
