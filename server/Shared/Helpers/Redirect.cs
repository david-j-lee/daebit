using System.Text;
using Microsoft.AspNetCore.Rewrite;

// https://stackoverflow.com/questions/46701670/net-core-https-with-aws-load-balancer-and-elastic-beanstalk-doesnt-work
// Currently not being used

namespace Daebit.Shared.Helpers
{
  public static class RedirectToProxiedHttpsExtensions
  {
    public static RewriteOptions AddRedirectToProxiedHttps(this RewriteOptions options)
    {
      options.Rules.Add(new RedirectToProxiedHttpsRule());
      return options;
    }
  }

  public class RedirectToProxiedHttpsRule : IRule
  {
    public virtual void ApplyRule(RewriteContext context)
    {
      var request = context.HttpContext.Request;

      // #1) Did this request start off as HTTP?
      string reqProtocol;
      if (request.Headers.ContainsKey("X-Forwarded-Proto"))
      {
        reqProtocol = request.Headers["X-Forwarded-Proto"][0];
      }
      else
      {
        reqProtocol = (request.IsHttps ? "https" : "http");
      }


      // #2) If so, redirect to HTTPS equivalent
      if (reqProtocol != "https")
      {
        var newUrl = new StringBuilder()
          .Append("https://").Append(request.Host)
          .Append(request.PathBase).Append(request.Path)
          .Append(request.QueryString);

        context.HttpContext.Response.Redirect(newUrl.ToString(), true);
      }
    }
  }
}
