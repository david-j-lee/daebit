using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Daebit.Data;
using Daebit.Modules.Gradebook.Classes.ViewModels;
using Daebit.Shared.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Users;
using Microsoft.AspNetCore.Authorization;

namespace Daebit.Modules.Gradebook.Classes
{
  [Authorize]
  [Route("api/[controller]")]
  public class ClassesController : Controller
  {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;

    public ClassesController(
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
          "get_classes_failure",
          "Unable to find a user for this budget",
          ModelState));

      var classes = await _db.Classes
        .Where(x => x.UserId == userId).ToListAsync();

      return new OkObjectResult(
          _mapper.Map<List<ClassGetViewModel>>(classes));
    }

    [HttpGet("getactive")]
    public async Task<IActionResult> GetActive()
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "get_classes_failure",
          "Unable to find a user for this budget",
          ModelState));

      var classes = await _db.Classes
        .Where(x => x.UserId == userId && x.IsActive == true).ToListAsync();

      return new OkObjectResult(
          _mapper.Map<List<ClassGetViewModel>>(classes));
    }

    [HttpGet("getarchived")]
    public async Task<IActionResult> GetArchived()
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "get_classes_failure",
          "Unable to find a user for this budget",
          ModelState));

      var classes = await _db.Classes
        .Where(x => x.UserId == userId && x.IsActive == false).ToListAsync();

      return new OkObjectResult(
          _mapper.Map<List<ClassGetViewModel>>(classes));
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] ClassAddViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var user = await _userManager.GetUserAsync(HttpContext.User);
      if (user == null)
        return BadRequest(Errors.AddErrorToModelState(
          "add_class_failure",
          "Unable to find a user for this class",
          ModelState));

      // add
      var newClass = new Class
      {
        Name = model.Name,
        IsWeighted = model.IsWeighted,
        IsActive = true,
        User = user,
        UserId = user.Id
      };
      _db.Classes.Add(newClass);
      await _db.SaveChangesAsync();

      return new OkObjectResult(newClass.Id);
    }

    [HttpPut("edit")]
    public async Task<IActionResult> Edit([FromBody] ClassEditViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // confirm user exists
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(
          Errors.AddErrorToModelState(
            "edit_class_failure",
            "Unable to find a user for this class",
            ModelState));

      // get record
      var myClass = _db.Classes
        .FirstOrDefault(x => x.UserId == userId && x.Id == model.Id);
      if (myClass == null)
        return NotFound(Errors.AddErrorToModelState(
          "edit_class_failure",
          "Unable to find the class",
          ModelState));

      myClass.Name = model.Name;
      myClass.IsWeighted = model.IsWeighted;
      myClass.IsActive = model.IsActive;

      await _db.SaveChangesAsync();

      return new OkObjectResult(new { message = "success" });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete(int id)
    {
      var userId = _userManager.GetUserId(HttpContext.User);
      if (userId == null)
        return BadRequest(Errors.AddErrorToModelState(
          "delete_class_failure",
          "Unable to find a user for this class",
          ModelState));

      var myClass = await _db.Classes
        .Include(x => x.Items)
        .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);
      if (myClass == null)
        return NotFound(Errors.AddErrorToModelState(
          "delete_item_failure",
          "Unable to find item to delete",
          ModelState));

      // Remove Items
      _db.Items.RemoveRange(myClass.Items);
      // Remove Class
      _db.Classes.Remove(myClass);
      await _db.SaveChangesAsync();
      return new OkObjectResult(new { message = "success" });
    }
  }
}
