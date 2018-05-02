using FluentValidation.Attributes;

namespace Daebit.Modules.Auth.Account.ViewModels
{
    [Validator(typeof(LoginViewModelValidator))]
    public class LoginViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
