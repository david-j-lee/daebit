using System.Threading.Tasks;
using AutoMapper;
using Daebit.Data;
using Daebit.Shared.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Daebit.Modules.Users.ViewModels;

namespace Daebit.Modules.Users
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(
            IMapper mapper,
            ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager)
        {
            _mapper = mapper;
            _db = dbContext;
            _userManager = userManager;
        }

        [HttpGet("get")]
        public async Task<IActionResult> Get()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                return new OkObjectResult(_mapper.Map<UserGetViewModel>(user));
            }
        }

        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromBody] UserEditViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _db.Users
                .FirstOrDefaultAsync(m => m.Id == model.Id);

            if (user == null)
            {
                return NotFound();
            }
            
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Theme = model.Theme;

            await _db.SaveChangesAsync();

            return new OkObjectResult(new { message = "success" });
        }
    }
}