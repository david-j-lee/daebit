using System.ComponentModel.DataAnnotations;

namespace Daebit.Modules.Auth.Account.ViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
