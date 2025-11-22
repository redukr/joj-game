using System.Windows;
using JojGame.Client.Windows.Models;
using JojGame.Client.Windows.Services;

namespace JojGame.Client.Windows.Views;

public partial class LoginWindow : Window
{
    private readonly AuthService _authService;

    public LoginWindow(AuthService authService)
    {
        _authService = authService;
        InitializeComponent();
    }

    private async void OnAuthenticateClick(object sender, RoutedEventArgs e)
    {
        var username = UsernameTextBox.Text.Trim();
        var password = PasswordBox.Password;

        var result = await _authService.SignInAsync(username, password);
        StatusText.Text = result.Message;

        if (!result.Success)
        {
            StatusText.Foreground = System.Windows.Media.Brushes.DarkRed;
            return;
        }

        StatusText.Foreground = System.Windows.Media.Brushes.DarkGreen;
        var mainWindow = new MainWindow(new AuthenticatedUser
        {
            Username = username,
            Role = result.Role ?? "user",
            FirstRun = result.CreatedNewCredential
        });

        mainWindow.Show();
        Close();
    }
}

public sealed class AuthenticatedUser
{
    public required string Username { get; init; }
    public required string Role { get; init; }
    public bool FirstRun { get; init; }
}
