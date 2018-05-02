using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Daebit.Data.Migrations
{
    public partial class RepeatDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "RepeatDate",
                table: "Revenues",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RepeatDate",
                table: "Expenses",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RepeatDate",
                table: "Revenues");

            migrationBuilder.DropColumn(
                name: "RepeatDate",
                table: "Expenses");
        }
    }
}
