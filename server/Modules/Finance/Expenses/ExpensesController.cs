using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Daebit.Data;
using Daebit.Modules.Finance.Expenses.ViewModels;
using Daebit.Shared.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Users;
using Microsoft.AspNetCore.Authorization;

namespace Daebit.Modules.Finance.Expenses
{
  [Authorize]
  [Route("api/[controller]")]
  public class ExpensesController : Controller
  {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;

    public ExpensesController(
        UserManager<ApplicationUser> userManager,
        IMapper mapper,
        ApplicationDbContext db)
    {
      _userManager = userManager;
      _mapper = mapper;
      _db = db;
    }

    [HttpGet("getall")]
    public async Task<IActionResult> GetAll(int budgetId)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "get_expense_failure",
          "Unable to find a user for these expenses",
          ModelState));

      var expenses = await _db.Expenses
        .Include(x => x.Budget)
        .Where(x => x.Budget.UserId == userId && x.BudgetId == budgetId)
        .ToListAsync();

      return new OkObjectResult(
        _mapper.Map<List<ExpenseGetViewModel>>(expenses));
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] ExpenseAddViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_expense_failure",
          "Unable to find a user for this expense",
          ModelState));

      // confirm class exists
      var budget = _db.Budgets
        .FirstOrDefault(x => x.Id == model.BudgetId && x.UserId == userId);
      if (budget == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_expense_failure",
          "Unable to find a class for this expense",
          ModelState));

      // add
      var newRecord = new Expense
      {
        Description = model.Description,
        Amount = model.Amount,
        IsForever = model.IsForever,
        StartDate = model.StartDate,
        EndDate = model.EndDate,
        Frequency = model.Frequency,
        RepeatMon = model.RepeatMon,
        RepeatTue = model.RepeatTue,
        RepeatWed = model.RepeatWed,
        RepeatThu = model.RepeatThu,
        RepeatFri = model.RepeatFri,
        RepeatSat = model.RepeatSat,
        RepeatSun = model.RepeatSun,
        Budget = budget,
        BudgetId = budget.Id
      };
      _db.Expenses.Add(newRecord);
      await _db.SaveChangesAsync();

      return new OkObjectResult(newRecord.Id);
    }

    [HttpPut("edit")]
    public async Task<IActionResult> Edit([FromBody] ExpenseEditViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_expense_failure",
          "Unable to find a user for this expense",
          ModelState));

      var expense = _db.Expenses
          .Include(x => x.Budget)
          .FirstOrDefault(x => x.Budget.UserId == userId && x.Id == model.Id);
      if (expense == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_expense_failure",
          "Unable to find this expense",
          ModelState));

      // Update
      expense.Description = model.Description;
      expense.Amount = model.Amount;
      expense.IsForever = model.IsForever;
      expense.StartDate = model.StartDate;
      expense.EndDate = model.EndDate;
      expense.Frequency = model.Frequency;
      expense.RepeatMon = model.RepeatMon;
      expense.RepeatTue = model.RepeatTue;
      expense.RepeatWed = model.RepeatWed;
      expense.RepeatThu = model.RepeatThu;
      expense.RepeatFri = model.RepeatFri;
      expense.RepeatSat = model.RepeatSat;
      expense.RepeatSun = model.RepeatSun;

      await _db.SaveChangesAsync();

      return new OkObjectResult(new { message = "success" });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete(int id)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_expense_failure",
          "Unable to find a user for this expense",
          ModelState));

      var expense = await _db.Expenses
          .Include(x => x.Budget)
          .FirstOrDefaultAsync(x => x.Budget.UserId == userId && x.Id == id);
      if (expense == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_expense_failure",
          "Unable to find expense to delete",
          ModelState));

      _db.Expenses.Remove(expense);
      await _db.SaveChangesAsync();
      return new OkObjectResult(new { message = "success" });
    }
  }
}
