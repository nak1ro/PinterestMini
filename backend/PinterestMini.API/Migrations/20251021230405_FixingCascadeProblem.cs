using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PinterestMini.API.Migrations
{
    /// <inheritdoc />
    public partial class FixingCascadeProblem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_AspNetUsers_UserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_PinBoards_AspNetUsers_UserId",
                table: "PinBoards");

            migrationBuilder.DropForeignKey(
                name: "FK_SavedPins_AspNetUsers_UserId",
                table: "SavedPins");

            migrationBuilder.DropForeignKey(
                name: "FK_SavedPins_Pins_PinId1",
                table: "SavedPins");

            migrationBuilder.DropIndex(
                name: "IX_SavedPins_PinId1",
                table: "SavedPins");

            migrationBuilder.DropColumn(
                name: "PinId1",
                table: "SavedPins");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_AspNetUsers_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PinBoards_AspNetUsers_UserId",
                table: "PinBoards",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SavedPins_AspNetUsers_UserId",
                table: "SavedPins",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_AspNetUsers_UserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_PinBoards_AspNetUsers_UserId",
                table: "PinBoards");

            migrationBuilder.DropForeignKey(
                name: "FK_SavedPins_AspNetUsers_UserId",
                table: "SavedPins");

            migrationBuilder.AddColumn<Guid>(
                name: "PinId1",
                table: "SavedPins",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SavedPins_PinId1",
                table: "SavedPins",
                column: "PinId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_AspNetUsers_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PinBoards_AspNetUsers_UserId",
                table: "PinBoards",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SavedPins_AspNetUsers_UserId",
                table: "SavedPins",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SavedPins_Pins_PinId1",
                table: "SavedPins",
                column: "PinId1",
                principalTable: "Pins",
                principalColumn: "Id");
        }
    }
}
