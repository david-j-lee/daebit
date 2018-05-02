using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using Microsoft.AspNetCore.Hosting;

namespace Daebit.Shared.Helpers
{
  public class EmailHelperModel
  {
    public string Username { get; set; }
    public string Password { get; set; }
    public string WebRootPath { get; set; }
    public string To { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
  }
  
  public class EmailHelper
  {
    public static bool SendEmail(EmailHelperModel model)
    {
      // const String FROM = "daebit@no-reply.com";
      const String FROMNAME = "Daebit";
      const String FROMEMAIL = "no-reply@daebit.com";
      const String HOST = "email-smtp.us-west-2.amazonaws.com";
      const int PORT = 587;

      // The body of the email
      var pathToEmailTemplate = model.WebRootPath
        + Path.DirectorySeparatorChar.ToString()
        + "Templates"
        + Path.DirectorySeparatorChar.ToString()
        + "contact-message.html";

      string body = "";

      using (StreamReader SourceReader = System.IO.File.OpenText(pathToEmailTemplate))
      {
        body = SourceReader.ReadToEnd();
      }

      body = body.Replace("###YEAR###", DateTime.Now.Year.ToString());
      body = body.Replace("###CONTENT###", model.Content);

      // Create and build a new MailMessage object
      MailMessage message = new MailMessage();
      message.IsBodyHtml = true;
      // message.From = new MailAddress(FROM, FROMNAME);
      message.From = new MailAddress(FROMEMAIL, FROMNAME);
      message.To.Add(new MailAddress(model.To));
      message.Subject = model.Subject;
      message.Body = body;

      SmtpClient client = new SmtpClient(HOST, PORT);
      client.Credentials = new NetworkCredential(model.Username, model.Password);
      client.EnableSsl = true;

      try
      {
        client.Send(message);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return false;
      }

      return true;
    }
  }
}