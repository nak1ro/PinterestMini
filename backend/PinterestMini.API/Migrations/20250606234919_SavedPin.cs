using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PinterestMini.API.Migrations
{
    /// <inheritdoc />
    public partial class SavedPin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pins_AspNetUsers_UserId",
                table: "Pins");

            migrationBuilder.DropIndex(
                name: "IX_Pins_UserId",
                table: "Pins");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Pins");

            migrationBuilder.CreateTable(
                name: "SavedPins",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PinId = table.Column<Guid>(type: "uuid", nullable: false),
                    SavedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PinId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedPins", x => new { x.UserId, x.PinId });
                    table.ForeignKey(
                        name: "FK_SavedPins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedPins_Pins_PinId",
                        column: x => x.PinId,
                        principalTable: "Pins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedPins_Pins_PinId1",
                        column: x => x.PinId1,
                        principalTable: "Pins",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pins_OwnerId",
                table: "Pins",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPins_PinId",
                table: "SavedPins",
                column: "PinId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPins_PinId1",
                table: "SavedPins",
                column: "PinId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Pins_AspNetUsers_OwnerId",
                table: "Pins",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pins_AspNetUsers_OwnerId",
                table: "Pins");

            migrationBuilder.DropTable(
                name: "SavedPins");

            migrationBuilder.DropIndex(
                name: "IX_Pins_OwnerId",
                table: "Pins");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Pins",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pins_UserId",
                table: "Pins",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pins_AspNetUsers_UserId",
                table: "Pins",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
