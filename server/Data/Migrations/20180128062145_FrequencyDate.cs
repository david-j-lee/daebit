using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Daebit.Data.Migrations
{
    public partial class FrequencyDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RepeatDate",
                table: "Revenues",
                newName: "FrequencyDate");

            migrationBuilder.RenameColumn(
                name: "RepeatDate",
                table: "Expenses",
                newName: "FrequencyDate");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FrequencyDate",
                table: "Revenues",
                newName: "RepeatDate");

            migrationBuilder.RenameColumn(
                name: "FrequencyDate",
                table: "Expenses",
                newName: "RepeatDate");
        }
    }
}
