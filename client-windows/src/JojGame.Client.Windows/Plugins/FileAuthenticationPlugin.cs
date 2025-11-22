using System.Text.Json;
using JojGame.Client.Windows.Models;
using JojGame.Client.Windows.Utilities;

namespace JojGame.Client.Windows.Plugins;

public sealed class FileAuthenticationPlugin : IAuthenticationPlugin
{
    private readonly string _credentialPath;
    private const string DefaultRole = "user";

    public FileAuthenticationPlugin(string credentialPath)
    {
        _credentialPath = credentialPath;
    }

    public string Name => "Local file";

    public async Task<AuthenticationResult> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(username))
        {
            return new AuthenticationResult
            {
                Success = false,
                Role = null,
                Message = "Username is required to authenticate.",
                CreatedNewCredential = false
            };
        }

        var fileExists = File.Exists(_credentialPath);
        if (!fileExists)
        {
            return await CreateCredentialAsync(username, password, cancellationToken);
        }

        var credential = await LoadCredentialAsync(cancellationToken);
        if (credential is null)
        {
            return new AuthenticationResult
            {
                Success = false,
                Role = null,
                Message = "Credential store is corrupted. Delete it to register again.",
                CreatedNewCredential = false
            };
        }

        if (!string.Equals(credential.Username, username, StringComparison.OrdinalIgnoreCase))
        {
            return new AuthenticationResult
            {
                Success = false,
                Role = null,
                Message = "Unknown user. Remove the credential file to register a new account.",
                CreatedNewCredential = false
            };
        }

        if (!IsValidBase64(credential.Salt) || !IsValidBase64(credential.PasswordHash))
        {
            return new AuthenticationResult
            {
                Success = false,
                Role = null,
                Message = "Credential store is corrupted. Delete it to register again.",
                CreatedNewCredential = false
            };
        }

        bool verified;
        try
        {
            verified = PasswordHasher.Verify(password, credential.Salt, credential.PasswordHash);
        }
        catch
        {
            return new AuthenticationResult
            {
                Success = false,
                Role = null,
                Message = "Credential store is corrupted. Delete it to register again.",
                CreatedNewCredential = false
            };
        }
        return new AuthenticationResult
        {
            Success = verified,
            Role = verified ? credential.Role : null,
            Message = verified ? "Signed in successfully." : "Invalid password.",
            CreatedNewCredential = false
        };
    }

    private async Task<AuthenticationResult> CreateCredentialAsync(string username, string password, CancellationToken cancellationToken)
    {
        var (salt, hash) = PasswordHasher.HashPassword(password);
        var record = new CredentialRecord
        {
            Username = username,
            Salt = salt,
            PasswordHash = hash,
            Role = DefaultRole,
            CreatedAt = DateTime.UtcNow.ToString("O")
        };

        var directory = Path.GetDirectoryName(_credentialPath);
        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        await using var stream = File.Create(_credentialPath);
        await JsonSerializer.SerializeAsync(stream, record, cancellationToken: cancellationToken);

        return new AuthenticationResult
        {
            Success = true,
            Role = record.Role,
            Message = "Created a local credential on first sign-in.",
            CreatedNewCredential = true
        };
    }

    private async Task<CredentialRecord?> LoadCredentialAsync(CancellationToken cancellationToken)
    {
        try
        {
            await using var stream = File.OpenRead(_credentialPath);
            return await JsonSerializer.DeserializeAsync<CredentialRecord>(stream, cancellationToken: cancellationToken);
        }
        catch
        {
            return null;
        }
    }

    private static bool IsValidBase64(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        Span<byte> buffer = stackalloc byte[value.Length];
        return Convert.TryFromBase64String(value, buffer, out _);
    }
}
