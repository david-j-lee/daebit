using System.Text.RegularExpressions;

namespace Daebit.Shared.Utilities
{
  public static class StringExtensions
  {
    public static string ToUrlSafeString(this string s)
    {
      return Regex.Replace(
        s.ToLower(), "[^a-zA-Z0-9_.]+", "", RegexOptions.Compiled);
    }
  }
}