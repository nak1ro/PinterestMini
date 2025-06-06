using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PinterestMini.API.Migrations
{
    /// <inheritdoc />
    public partial class PinBoardUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PinBoards",
                table: "PinBoards");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "PinBoards",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PinBoards",
                table: "PinBoards",
                columns: new[] { "BoardId", "PinId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_PinBoards_UserId",
                table: "PinBoards",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PinBoards_AspNetUsers_UserId",
                table: "PinBoards",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PinBoards_AspNetUsers_UserId",
                table: "PinBoards");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PinBoards",
                table: "PinBoards");

            migrationBuilder.DropIndex(
                name: "IX_PinBoards_UserId",
                table: "PinBoards");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "PinBoards");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PinBoards",
                table: "PinBoards",
                columns: new[] { "BoardId", "PinId" });
        }
    }
}
