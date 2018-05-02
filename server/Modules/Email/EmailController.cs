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
using Daebit.Shared.Helpers;
using System;
using System.Net.Mail;
using System.Net;
using Daebit.Modules.Email.ViewModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Daebit.Modules.Email
{
  [Route("api/email")]
  public class EmailController : Controller
  {
    private readonly IConfiguration _config;
    private readonly IHostingEnvironment _env;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public EmailController(
      IConfiguration config,
      IHostingEnvironment env,
      IMapper mapper,
      ApplicationDbContext dbContext,
      UserManager<ApplicationUser> userManager)
    {
      _config = config;
      _env = env;
      _mapper = mapper;
      _db = dbContext;
      _userManager = userManager;
    }

    [HttpPost("contact")]
    public IActionResult Contact([FromBody] ContactViewModel contact)
    {
      string to = _config["AwsSmtpEmail:ContactTo"];
      string subject = $"{contact.Name} has sent you a message on DaveTheDev.me";
      string content = $@"
        <h3>You have received the following message on DaveTheDev.me:<h3>
        <p>{contact.Message}</p>
        <h4 style=""margin-bottom: 0;"">{contact.Name}</h4>
        <div>{contact.Email}</div>
        <div>{contact.Phone}</div>
      ";
      if (EmailHelper.SendEmail(new EmailHelperModel
      {
        Username = _config["AwsSmtpEmail:Username"],
        Password = _config["AwsSmtpEmail:Password"],
        WebRootPath = _env.WebRootPath,
        To = to,
        Subject = subject,
        Content = content
      }))
        return Ok(true);
      else
        return BadRequest(false);
    }
  }
}
