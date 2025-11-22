using JojGame.Client.Windows.Models;
using JojGame.Client.Windows.Plugins;
using JojGame.Client.Windows.Settings;

namespace JojGame.Client.Windows.Services;

public sealed class AuthService
{
    private readonly IAuthenticationPlugin _plugin;

    public AuthService(AppSettings settings)
    {
        _plugin = new FileAuthenticationPlugin(settings.CredentialFile);
    }

    public Task<AuthenticationResult> SignInAsync(string username, string password, CancellationToken cancellationToken = default)
    {
        return _plugin.AuthenticateAsync(username, password, cancellationToken);
    }
}
