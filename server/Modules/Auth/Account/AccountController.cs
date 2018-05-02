using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Daebit.Data;
using Daebit.Modules.Users;
using Daebit.Shared.Helpers;
using Daebit.Shared.Utilities;
using Daebit.Modules.Auth.Account.ViewModels;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using System.Web;

namespace Daebit.Modules.Auth.Account
{
  [Route("api/[controller]")]
  public class AccountController : Controller
  {
    private readonly IHostingEnvironment _env;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public AccountController(
      IHostingEnvironment env,
      IConfiguration config,
      IMapper mapper,
      ApplicationDbContext db,
      UserManager<ApplicationUser> userManager)
    {
      _env = env;
      _config = config;
      _mapper = mapper;
      _db = db;
      _userManager = userManager;
    }

    // POST api/account/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginViewModel credentials)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var userToVerify = await _userManager.FindByNameAsync(credentials.Email);
      if (userToVerify == null)
      {
        return BadRequest(Errors.AddErrorToModelState("login_failure", "Invalid username or password.", ModelState));
      }

      // check the credentials
      if (!await _userManager.CheckPasswordAsync(userToVerify, credentials.Password))
      {
        return BadRequest(Errors.AddErrorToModelState("login_failure", "Invalid username or password.", ModelState));
      }

      var token = GetJwtSecurityToken(userToVerify);
      return Ok(new { token = token });
    }

    // POST api/account/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegistrationViewModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var userIdentity = _mapper.Map<ApplicationUser>(model);
      var result = await _userManager.CreateAsync(userIdentity, model.Password);

      if (!result.Succeeded)
      {
        return new BadRequestObjectResult(
            Errors.AddErrorsToModelState(result, ModelState));
      }
      else
      {
        // TODO: figure out how to do this from userIdentity, maybe making two trips to DB
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == model.Email);
        if (user != null)
        {
          user.FirstName = model.FirstName;
          user.LastName = model.LastName;
          await _db.SaveChangesAsync();
        }
        else
        {
          return BadRequest(ModelState);
        }

        // send confirmation email
        string code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        string callbackUrl = $@"https://daebit.com/account/confirm-email/?userId={user.Id}&code={code}";
        string to = model.Email;
        string subject = "Welcome to Daebit!";
        string content = $@"
          <h2>Hello {user.FirstName} {user.LastName} </h2>
          <p>Thank you for signing up with Daebit.com. To complete your registration please click the link below: </p>
          <a href=""{callbackUrl}"" target=""_blank"">{callbackUrl}</a>
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
          return BadRequest(Errors.AddErrorToModelState(
            "register",
            "Sorry something went wrong, please try again later",
            ModelState));

        var token = GetJwtSecurityToken(user);
        return Ok(new { token = token });
      }
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailViewModel model)
    {
      if (!ModelState.IsValid)
        return BadRequest();

      var user = await _db.Users.SingleOrDefaultAsync(x => x.Id == model.UserId);
      var result = await _userManager.ConfirmEmailAsync(user, HttpUtility.UrlDecode(model.Code).Replace(" ", "+"));
      if (result.Succeeded)
        return Ok(true);
      else
        return BadRequest(false);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
    {
      if (ModelState.IsValid)
      {
        var user = await _userManager.FindByNameAsync(model.Email);
        if (user == null)
          return Ok(true);

        if (user.EmailConfirmed)
        {
          var code = await _userManager.GeneratePasswordResetTokenAsync(user);

          string to = user.Email;
          string subject = "Reset your password for Daebit.com";
          string url = $@"https://daebit.com/account/reset-password?userId={user.Id}&code={code}";
          string content = $@"
            <h3>To reset your password click the link below:</h3>
            <a href=""{url}"" target=""_blank"">{url}</a>
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
        else
        {
          // send confirmation email
          string code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
          string callbackUrl = $@"https://daebit.com/account/confirm-email/?userId={user.Id}&code={code}";
          string to = model.Email;
          string subject = "Welcome to Daebit!";
          string content = $@"
            <h2>Hello {user.FirstName} {user.LastName} </h2>
            <p>
              Before you reset your password you must confirm your email address. 
              Please follow the link below and then request another 
              link to reset your password.
            </p>
            <a href=""{callbackUrl}"" target=""_blank"">{callbackUrl}</a>
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
      return BadRequest(ModelState);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var user = await _userManager.FindByIdAsync(model.UserId);
      if (user == null)
        // Don't reveal that the user does not exist
        return new OkObjectResult(new { message = "success" });

      var result = await _userManager.ResetPasswordAsync(
        user, HttpUtility.UrlDecode(model.Code).Replace(" ", "+"), model.Password);

      if (!result.Succeeded)
        return BadRequest(Errors.AddErrorToModelState(
          "reset_password", "Unable to reset your password", ModelState));
      else
        return Ok(true);
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(string oldPassword, string newPassword)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      // get user
      var user = await _userManager.GetUserAsync(HttpContext.User);
      if (user == null)
        return NotFound();

      // change the password
      var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
      if (result.Succeeded)
        return new OkObjectResult(new { message = "success" });

      return BadRequest(Errors.AddErrorToModelState("change_password_failure", "Something went wrong, please try again", ModelState));
    }

    private string GetJwtSecurityToken(ApplicationUser user)
    {
      var issuer = _config["Jwt:Issuer"];
      var audience = _config["Jwt:Issuer"];

      var userClaims = _userManager.GetClaimsAsync(user).Result;
      var claims = GetTokenClaims(user).Union(userClaims);

      var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"])), SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.UtcNow.AddDays(1),
        signingCredentials: signingCredentials
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static IEnumerable<Claim> GetTokenClaims(ApplicationUser user)
    {
      return new List<Claim>
        {
          new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
          new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
          new Claim(ClaimTypes.NameIdentifier, user.Id)
        };
    }
  }
}
