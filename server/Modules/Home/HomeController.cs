using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Users;
using Microsoft.AspNetCore.Authorization;
using Daebit.Data;

namespace Daebit.Modules.Gradebook.Home
{
  [Route("/")]
  public class HomeController : Controller
  {
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public HomeController(
      IMapper mapper,
      ApplicationDbContext dbContext,
      UserManager<ApplicationUser> userManager)
    {
      _mapper = mapper;
      _db = dbContext;
      _userManager = userManager;
    }

    [HttpGet("")]
    public IActionResult Index()
    {
      return Ok();
    }
  }
}
