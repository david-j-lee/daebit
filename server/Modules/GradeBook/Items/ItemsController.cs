using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Daebit.Data;
using Daebit.Modules.Gradebook.Items.ViewModels;
using Daebit.Shared.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Users;

namespace Daebit.Modules.Gradebook.Items
{
  [Route("api/[controller]")]
  public class ItemsController : Controller
  {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;

    public ItemsController(
        UserManager<ApplicationUser> userManager,
        IMapper mapper,
        ApplicationDbContext db)
    {
      _userManager = userManager;
      _mapper = mapper;
      _db = db;
    }

    [HttpGet("getall")]
    public async Task<IActionResult> GetAll(int classId)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "get_item_failure",
          "Unable to find a user for this item",
          ModelState));

      var items = await _db.Items
          .Include(x => x.Class)
          .Where(x => x.Class.UserId == userId && x.ClassId == classId)
          .ToListAsync();

      return new OkObjectResult(
        _mapper.Map<List<ItemGetViewModel>>(items));
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] ItemAddViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var user = await _userManager.GetUserAsync(HttpContext.User);
      if (user == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_item_failure",
          "Unable to find a user for this item",
          ModelState));

      // confirm class exists
      var myClass = _db.Classes
        .FirstOrDefault(x => x.UserId == user.Id && x.Id == model.ClassId);
      if (myClass == null)
        return NotFound(Errors.AddErrorToModelState(
          "add_item_failure",
          "Unable to find a class for this item",
          ModelState));

      // add
      var newRecord = new Item
      {
        Description = model.Description,
        IsCompleted = model.IsCompleted,
        DateDue = model.DateDue,
        Earned = model.Earned,
        Possible = model.Possible,
        Weight = model.Weight,
        Class = myClass,
        ClassId = myClass.Id
      };
      _db.Items.Add(newRecord);
      await _db.SaveChangesAsync();

      return new OkObjectResult(newRecord.Id);
    }

    [HttpPost("edit")]
    public async Task<IActionResult> Edit([FromBody] ItemEditViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "edit_item_failure",
          "Unable to find a user for this item",
          ModelState));

      var item = _db.Items
        .Include(x => x.Class)
        .FirstOrDefault(x => x.Class.UserId == userId && x.Id == model.Id);
      if (item == null)
        return NotFound(Errors.AddErrorToModelState(
          "edit_item_failure",
          "Unable to find this item",
          ModelState));

      // Update
      item.Description = model.Description;
      item.IsCompleted = model.IsCompleted;
      item.DateDue = model.DateDue;
      item.Earned = model.Earned;
      item.Possible = model.Possible;
      item.Weight = model.Weight;

      await _db.SaveChangesAsync();

      return new OkObjectResult(new { message = "success" });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete(int id)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_item_failure",
          "Unable to find a user for this item",
          ModelState));

      var item = await _db.Items
          .Include(x => x.Class)
          .FirstOrDefaultAsync(x => x.Class.UserId == userId && x.Id == id);
      if (item == null)
        return NotFound(Errors.AddErrorToModelState(
          "delete_item_failure",
          "Unable to find item to delete",
          ModelState));

      _db.Items.Remove(item);
      await _db.SaveChangesAsync();
      return new OkObjectResult(new { message = "success" });
    }
  }
}
