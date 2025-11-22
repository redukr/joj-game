# Windows Client

Native Windows client built with **.NET 8** and **WPF** to provide a desktop experience tailored to Windows users. The client ships with a pluggable authentication provider that stores a hashed password in a local credential file and lets you set that password on the first login attempt. The default role for new credentials is `user`.

## Stack
- .NET 8 SDK (Windows)
- WPF (C#)
- Local file-based authentication plugin (PBKDF2-SHA256 hashing)
- `System.Text.Json` for persistence

## Project layout
```
client-windows/
├── auth/credentials.sample.json     # Example file with encoded password hash for user "tester"
└── src/JojGame.Client.Windows/      # WPF project with App.xaml, views, and auth plugin
```

## Getting started
1. Install the .NET 8 SDK on Windows and open the repository in Visual Studio 2022+ (or `dotnet build` from a developer prompt).
2. Open `client-windows/src/JojGame.Client.Windows/JojGame.Client.Windows.csproj` and run the project. The app starts with the login window.
3. On first launch, enter a username and password. If no credential file exists, the app will **hash the password and create** `%APPDATA%\JojGame\credentials.json`, granting the base `user` role.
4. On subsequent launches, the same file is used to validate the password. Delete the file to register a new user locally.

## Credential file
- The credential store uses PBKDF2-SHA256 (100k iterations) with a random salt per user.
- A sample hashed record is provided at `client-windows/auth/credentials.sample.json`. Copy it to `%APPDATA%\JojGame\credentials.json` if you want to reuse the `tester` account locally; the password is `P@ssw0rd!` and the role is `user`.

## Roadmap
- Wire HttpClient calls to the FastAPI backend once endpoints for rooms and decks are available.
- Add lobby, deck viewer, and table screens.
- Introduce UI tests with WinAppDriver or Playwright for .NET.
