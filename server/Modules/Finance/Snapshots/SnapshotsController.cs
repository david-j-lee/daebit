using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Daebit.Data;
using Daebit.Modules.Finance.Snapshots.ViewModels;
using Daebit.Shared.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Daebit.Modules.Finance.Balances;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Users;

namespace Daebit.Modules.Finance.Snapshots
{
  [Route("api/[controller]")]
  public class SnapshotsController : Controller
  {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;

    public SnapshotsController(
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
          "get_snapshot_failure",
          "Unable to find a user for this snapshot",
          ModelState));

      var snapshots = await _db.Snapshots
        .Include(x => x.Budget)
        .Where(x => x.Budget.UserId == userId && x.BudgetId == budgetId)
        .ToListAsync();

      return new OkObjectResult(_mapper.Map<List<SnapshotGetViewModel>>(
        snapshots.OrderByDescending(x => x.Date).ThenByDescending(x => x.Id)));
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add(
      [FromBody] SnapshotAddAllViewModel model)
    {
      // TODO: Clean up this action
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      var user = await _db.Users
          .Include(x => x.Budgets)
          .ThenInclude(x => x.Balances)
          .FirstOrDefaultAsync(x => x.Id == userId);
      if (user == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_snapshot_failure",
          "Unable to find a user for this snapshot",
          ModelState));

      // confirm class exists
      var budget = user.Budgets.FirstOrDefault(x => x.Id == model.BudgetId);
      if (budget == null)
        return NotFound(Errors.AddErrorToModelState(
          "add_snapshot_failure",
          "Unable to find a budget for this snapshot",
          ModelState));

      // add snapshot
      var newRecord = new Snapshot
      {
        Date = model.Snapshot.Date,
        EstimatedBalance = model.Snapshot.EstimatedBalance,
        ActualBalance = model.Snapshot.ActualBalance,
        Budget = budget,
        BudgetId = budget.Id
      };
      _db.Snapshots.Add(newRecord);

      // delete old balances
      _db.Balances.RemoveRange(budget.Balances
          .Where(m => !model.SnapshotBalances.Any(x => x.Id == m.Id)));

      // update balances
      var postedBalances = new List<Balance>();
      foreach (var balance in model.SnapshotBalances)
      {
        if (balance.Id != 0)
        {
          // update database
          var dbBalance = _db.Balances.FirstOrDefault(x => x.Id == balance.Id);
          if (dbBalance.Budget.UserId == user.Id)
          {
            dbBalance.Description = balance.Description;
            dbBalance.Amount = balance.Amount;
          }
        }
        else
        {
          // add
          var newBalance = new Balance
          {
            Description = balance.Description,
            Amount = balance.Amount,
            Budget = budget,
            BudgetId = budget.Id
          };
          _db.Balances.Add(newBalance);
          postedBalances.Add(newBalance);
        }
      }

      await _db.SaveChangesAsync();

      var result = new
      {
        SnapshotId = newRecord.Id,
        BalanceIds = postedBalances.Select(m => m.Id)
      };

      return new OkObjectResult(result);
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete(int id)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_snapshot_failure",
          "Unable to find a user for this snapshot",
          ModelState));

      var snapshot = await _db.Snapshots
        .Include(x => x.Budget)
        .FirstOrDefaultAsync(x => x.Budget.UserId == userId && x.Id == id);
      if (snapshot == null)
        return NotFound(Errors.AddErrorToModelState(
          "delete_snapshot_failure",
          "Unable to find snapshot to delete",
          ModelState));

      _db.Snapshots.Remove(snapshot);
      await _db.SaveChangesAsync();
      return new OkObjectResult(new { message = "success" });
    }
  }
}
