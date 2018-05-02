using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Daebit.Data;
using Daebit.Modules.Finance.Revenues.ViewModels;
using Daebit.Shared.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Users;
using Microsoft.AspNetCore.Authorization;

namespace Daebit.Modules.Finance.Revenues
{
  [Authorize]
  [Route("api/[controller]")]
  public class RevenuesController : Controller
  {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;

    public RevenuesController(
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
          "get_revenues_failure",
          "Unable to find a user for this revenue",
          ModelState));

      var revenues = await _db.Revenues
        .Include(x => x.Budget)
        .Where(x => x.Budget.UserId == userId && x.BudgetId == budgetId)
        .ToListAsync();

      return new OkObjectResult(
        _mapper.Map<List<RevenueGetViewModel>>(revenues));
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] RevenueAddViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_revenue_failure",
          "Unable to find a user for this revenue",
          ModelState));

      // confirm class exists
      var budget = _db.Budgets
        .FirstOrDefault(x => x.UserId == userId && x.Id == model.BudgetId);
      if (budget == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_revenue_failure",
          "Unable to find a budget for this revenue",
          ModelState));

      // add
      var newRecord = new Revenue
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
      _db.Revenues.Add(newRecord);
      await _db.SaveChangesAsync();

      return new OkObjectResult(newRecord.Id);
    }

    [HttpPut("edit")]
    public async Task<IActionResult> Edit([FromBody] RevenueEditViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "edit_revenue_failure",
          "Unable to find a user for this revenue",
          ModelState));

      var revenue = _db.Revenues
          .Include(x => x.Budget)
          .FirstOrDefault(x => x.Budget.UserId == userId && x.Id == model.Id);
      if (revenue == null)
        return BadRequest(Errors.AddErrorToModelState(
          "edit_revenue_failure",
          "Unable to find this revenue",
          ModelState));

      // Update
      revenue.Description = model.Description;
      revenue.Amount = model.Amount;
      revenue.IsForever = model.IsForever;
      revenue.StartDate = model.StartDate;
      revenue.EndDate = model.EndDate;
      revenue.Frequency = model.Frequency;
      revenue.RepeatMon = model.RepeatMon;
      revenue.RepeatTue = model.RepeatTue;
      revenue.RepeatWed = model.RepeatWed;
      revenue.RepeatThu = model.RepeatThu;
      revenue.RepeatFri = model.RepeatFri;
      revenue.RepeatSat = model.RepeatSat;
      revenue.RepeatSun = model.RepeatSun;

      await _db.SaveChangesAsync();
      return new OkObjectResult(new { message = "success" });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete(int id)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_revenue_failure",
          "Unable to find a user for this revenue",
          ModelState));

      var revenue = await _db.Revenues
        .Include(x => x.Budget)
        .FirstOrDefaultAsync(x => x.Budget.UserId == userId && x.Id == id);
      if (revenue == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_revenue_failure",
          "Unable to find revenue to delete",
          ModelState));

      _db.Revenues.Remove(revenue);
      await _db.SaveChangesAsync();
      return new OkObjectResult(new { message = "success" });
    }
  }
}
