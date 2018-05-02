using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Daebit.Data;
using Daebit.Modules.Finance.Budgets.ViewModels;
using Daebit.Shared.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Daebit.Modules.Finance.Snapshots;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Users;
using Microsoft.AspNetCore.Authorization;

namespace Daebit.Modules.Finance.Budgets
{
  [Authorize]
  [Route("api/[controller]")]
  public class BudgetsController : Controller
  {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;

    public BudgetsController(
        UserManager<ApplicationUser> userManager,
        IMapper mapper,
        ApplicationDbContext db)
    {
      _userManager = userManager;
      _mapper = mapper;
      _db = db;
    }

    [HttpGet("getall")]
    public async Task<IActionResult> GetAll()
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "get_budgets_failure",
          "Unable to find a user for this budget",
          ModelState));

      var budgets = await _db.Budgets
        .Where(x => x.UserId == userId)
        .ToListAsync();

      return new OkObjectResult(
        _mapper.Map<List<BudgetGetViewModel>>(budgets));
    }

    [HttpGet("getactive")]
    public async Task<IActionResult> GetActive()
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "get_budgets_failure",
          "Unable to find a user for this budget",
          ModelState));

      var budgets = await _db.Budgets
        .Where(x => x.UserId == userId && x.IsActive == true)
        .ToListAsync();

      return new OkObjectResult(
        _mapper.Map<List<BudgetGetViewModel>>(budgets));
    }

    [HttpGet("getarchived")]
    public async Task<IActionResult> GetArchived()
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "get_budgets_failure",
          "Unable to find a user for this budget",
          ModelState));

      var budgets = await _db.Budgets
        .Where(x => x.UserId == userId && x.IsActive == false)
        .ToListAsync();

      return new OkObjectResult(
        _mapper.Map<List<BudgetGetViewModel>>(budgets));
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] BudgetAddViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var user = await _userManager.GetUserAsync(HttpContext.User);
      if (user == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_budget_failure",
          "Unable to find a user for this budget",
          ModelState));

      // add
      var newBudget = new Budget
      {
        Name = model.Name,
        IsActive = true,
        User = user,
        UserId = user.Id
      };
      _db.Budgets.Add(newBudget);
      await _db.SaveChangesAsync();

      // add first snapshot always 0 est and 0 act
      var newSnapshot = new Snapshot
      {
        Date = model.StartDate,
        ActualBalance = 0,
        EstimatedBalance = 0,
        Budget = newBudget,
        BudgetId = newBudget.Id
      };
      _db.Snapshots.Add(newSnapshot);
      await _db.SaveChangesAsync();

      // return both results
      var result = new
      {
        BudgetId = newBudget.Id,
        SnapshotId = newSnapshot.Id
      };

      return new OkObjectResult(result);
    }

    [HttpPut("edit")]
    public async Task<IActionResult> Edit([FromBody] BudgetEditViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "edit_budget_failure",
          "Unable to find a user for this budget",
          ModelState));

      // get record
      var budget = _db.Budgets
        .FirstOrDefault(x => x.UserId == userId && x.Id == model.Id);
      if (budget == null)
        return BadRequest(Errors.AddErrorToModelState(
          "edit_budget_failure",
          "Unable to find the budget",
          ModelState));

      budget.Name = model.Name;
      budget.IsActive = model.IsActive;

      await _db.SaveChangesAsync();

      return new OkObjectResult(new { message = "success" });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete(int id)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_budget_failure",
          "Unable to find a user for this budget",
          ModelState));

      var budget = await _db.Budgets
        .Include(x => x.Balances)
        .Include(x => x.Revenues)
        .Include(x => x.Expenses)
        .Include(x => x.Snapshots)
        .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);
      if (budget == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_budget_failure",
          "Unable to find budget to delete",
          ModelState));

      _db.Balances.RemoveRange(budget.Balances);
      _db.Revenues.RemoveRange(budget.Revenues);
      _db.Expenses.RemoveRange(budget.Expenses);
      _db.Snapshots.RemoveRange(budget.Snapshots);

      // Remove Class
      _db.Budgets.Remove(budget);
      await _db.SaveChangesAsync();
      return new OkObjectResult(new { message = "success" });
    }
  }
}
