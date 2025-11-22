using System.Text.Json;

namespace JojGame.Client.Windows.Settings;

public sealed class AppSettings
{
    public string ApiBaseUrl { get; init; } = "http://localhost:8000";
    public string CredentialFile { get; init; } = "${APPDATA}\\JojGame\\credentials.json";

    public static AppSettings Load()
    {
        var settingsPath = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
        if (!File.Exists(settingsPath))
        {
            return new AppSettings().Normalize();
        }

        try
        {
            var json = File.ReadAllText(settingsPath);
            var parsed = JsonSerializer.Deserialize<AppSettings>(json);
            return parsed is null ? new AppSettings().Normalize() : parsed.Normalize();
        }
        catch
        {
            return new AppSettings().Normalize();
        }
    }

    private AppSettings Normalize()
    {
        var normalizedCredentialFile = ExpandEnvironmentVariables(CredentialFile);
        return new AppSettings
        {
            ApiBaseUrl = ApiBaseUrl,
            CredentialFile = normalizedCredentialFile
        };
    }

    private static string ExpandEnvironmentVariables(string value)
    {
        const string appDataPlaceholder = "${APPDATA}";
        if (value.Contains(appDataPlaceholder, StringComparison.OrdinalIgnoreCase))
        {
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            value = value.Replace(appDataPlaceholder, appData, StringComparison.OrdinalIgnoreCase);
        }

        return Environment.ExpandEnvironmentVariables(value);
    }
}
