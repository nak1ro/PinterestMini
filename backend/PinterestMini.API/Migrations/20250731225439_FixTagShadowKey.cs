using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PinterestMini.API.Migrations
{
    /// <inheritdoc />
    public partial class FixTagShadowKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsageCount",
                table: "Tags",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsageCount",
                table: "Tags");
        }
    }
}
