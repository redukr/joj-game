using System.Windows;
using JojGame.Client.Windows.Services;
using JojGame.Client.Windows.Settings;
using JojGame.Client.Windows.Views;

namespace JojGame.Client.Windows;

public partial class App : Application
{
    private AuthService? _authService;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);
        var settings = AppSettings.Load();
        _authService = new AuthService(settings);
        var loginWindow = new LoginWindow(_authService);
        loginWindow.Show();
    }
}
