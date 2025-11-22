using System.Windows;

namespace JojGame.Client.Windows.Views;

public partial class MainWindow : Window
{
    private readonly AuthenticatedUser _user;

    public MainWindow(AuthenticatedUser user)
    {
        _user = user;
        InitializeComponent();
        RenderUserContext();
    }

    private void RenderUserContext()
    {
        WelcomeText.Text = $"Welcome, {_user.Username}!";
        RoleText.Text = $"Role: {_user.Role}";

        var message = _user.FirstRun
            ? "We created a secure credential file for you on first login. You can now access the game services with the base user role."
            : "You are signed in with your saved local credential. Move forward to lobby, deck browsing, or session features.";

        TipsText.Text = message;
    }
}
