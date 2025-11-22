using JojGame.Client.Windows.Models;

namespace JojGame.Client.Windows.Plugins;

public interface IAuthenticationPlugin
{
    string Name { get; }
    Task<AuthenticationResult> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default);
}
