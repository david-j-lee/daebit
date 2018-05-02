using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Daebit.Modules.Auth.Account.ViewModels
{
  public class ConfirmEmailViewModel
  {
    [Required]
    public string UserId { get; set; }

    [Required]
    public string Code { get; set; }
  }
}
