using System.Text.Json.Serialization;

namespace JojGame.Client.Windows.Models;

public sealed class CredentialRecord
{
    [JsonPropertyName("username")]
    public string Username { get; init; } = string.Empty;

    [JsonPropertyName("salt")]
    public string Salt { get; init; } = string.Empty;

    [JsonPropertyName("passwordHash")]
    public string PasswordHash { get; init; } = string.Empty;

    [JsonPropertyName("role")]
    public string Role { get; init; } = "user";

    [JsonPropertyName("createdAt")]
    public string? CreatedAt { get; init; }
}
