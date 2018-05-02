using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Daebit.Data;
using Daebit.Modules.Users;
using System.IO;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Rewrite;
using Daebit.Shared.Helpers;

namespace Daebit
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
      {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        // builder.WithOrigins("https://daebit.com").AllowAnyMethod().AllowAnyHeader();
        // builder.WithOrigins("http://davethedev.me").AllowAnyMethod().AllowAnyHeader();
      }));

      services.AddMvc();

      services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(
          Configuration.GetConnectionString("DefaultConnection")));

      // identity
      services.AddIdentity<ApplicationUser, IdentityRole>
      (o =>
        {
          // configure identity options
          o.Password.RequireDigit = true;
          o.Password.RequireLowercase = false;
          o.Password.RequireUppercase = false;
          o.Password.RequireNonAlphanumeric = false;
          o.Password.RequiredLength = 8;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

      // api user claim policy
      // v remove default claims
      JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
      services
        .AddAuthentication(options =>
        {
          options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;
          options.DefaultScheme =
            JwtBearerDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;

        })
        .AddJwtBearer(jwtBearerOptions =>
        {
          jwtBearerOptions.TokenValidationParameters =
            new TokenValidationParameters()
            {
              // ValidateActor = false,
              // ValidateAudience = false,
              // ValidateLifetime = true,
              // ValidateIssuerSigningKey = true,
              ValidIssuer = Configuration["Jwt:Issuer"],
              ValidAudience = Configuration["Jwt:Issuer"],
              IssuerSigningKey = new SymmetricSecurityKey(
              Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
            };
        })
        .AddCookie();

      services.AddAutoMapper();
    }

    // This method gets called by the runtime.
    // Use this method to configure the HTTP request pipeline.
    public void Configure(
      IApplicationBuilder app,
      IHostingEnvironment env,
      ApplicationDbContext db)
    {
      app.UseCors("MyPolicy");

      // for aws https
      var options = new RewriteOptions()
        .AddRedirectToProxiedHttps()
        .AddRedirect("(.*)/$", "$1");  // remove trailing slash
      app.UseRewriter(options);

      app.UseAuthentication();

      app.UseMvc();
    }
  }
}
