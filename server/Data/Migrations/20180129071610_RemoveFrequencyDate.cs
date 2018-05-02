using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Daebit.Data.Migrations
{
    public partial class RemoveFrequencyDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FrequencyDate",
                table: "Revenues");

            migrationBuilder.DropColumn(
                name: "FrequencyDate",
                table: "Expenses");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FrequencyDate",
                table: "Revenues",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FrequencyDate",
                table: "Expenses",
                nullable: true);
        }
    }
}
