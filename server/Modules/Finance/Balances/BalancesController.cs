using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Daebit.Data;
using Daebit.Modules.Finance.Balances.ViewModels;
using Daebit.Shared.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Users;
using Microsoft.AspNetCore.Authorization;

namespace Daebit.Modules.Finance.Balances
{
  [Authorize]
  [Route("api/[controller]")]
  public class BalancesController : Controller
  {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;

    public BalancesController(
        IMapper mapper,
        UserManager<ApplicationUser> userManager,
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
        return BadRequest(
          Errors.AddErrorToModelState(
            "get_balances_failure",
            "Unable to find a user for this balance",
            ModelState));

      var balances = await _db.Balances
        .Include(x => x.Budget)
        .Where(x => x.Budget.UserId == userId && x.BudgetId == budgetId)
        .ToListAsync();

      return new OkObjectResult(
        _mapper.Map<List<BalanceGetViewModel>>(balances));
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] BalanceAddViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(
          Errors.AddErrorToModelState(
            "add_balance_failure",
            "Unable to find a user for this balance",
            ModelState));

      var budget = _db.Budgets
        .FirstOrDefault(x => x.UserId == userId && x.Id == model.BudgetId);
      if (budget == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_balance_failure",
          "Unable to find a class for this balance",
          ModelState));

      var newRecord = new Balance
      {
        Description = model.Description,
        Amount = model.Amount,
        Budget = budget,
        BudgetId = budget.Id
      };
      _db.Balances.Add(newRecord);
      await _db.SaveChangesAsync();

      return new OkObjectResult(newRecord.Id);
    }

    [HttpPut("edit")]
    public async Task<IActionResult> Edit([FromBody] BalanceEditViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_balance_failure",
          "Unable to find a user for this balance",
          ModelState));

      var balance = _db.Balances
        .Include(x => x.Budget)
        .FirstOrDefault(x => x.Budget.UserId == userId && x.Id == model.Id);
      if (balance == null)
        return NotFound(Errors.AddErrorToModelState(
          "add_balance_failure",
          "Unable to find this balance",
          ModelState));

      // Update
      balance.Description = model.Description;
      balance.Amount = model.Amount;

      await _db.SaveChangesAsync();

      return new OkObjectResult(new { message = "success" });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete(int id)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_balance_failure",
          "Unable to find a user for this balance",
          ModelState));

      var balance = await _db.Balances
        .Include(x => x.Budget)
        .FirstOrDefaultAsync(x => x.Budget.UserId == userId && x.Id == id);
      if (balance == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_balance_failure",
          "Unable to find balance to delete",
          ModelState));

      _db.Balances.Remove(balance);
      await _db.SaveChangesAsync();
      return new OkObjectResult(new { message = "success" });
    }
  }
}
