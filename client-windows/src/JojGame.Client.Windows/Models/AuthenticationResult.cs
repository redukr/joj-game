namespace JojGame.Client.Windows.Models;

public sealed class AuthenticationResult
{
    public bool Success { get; init; }
    public string? Role { get; init; }
    public string Message { get; init; } = string.Empty;
    public bool CreatedNewCredential { get; init; }
}
