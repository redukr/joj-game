# Windows Client

Native Windows client built with **.NET** and **WPF** to provide a desktop experience tailored to Windows users.

## Planned stack
- .NET 8 SDK
- WPF (C#)
- MVVM pattern with CommunityToolkit.Mvvm
- HttpClient for backend communication

## Getting started
1. Install the .NET 8 SDK and open the repository in Visual Studio 2022+.
2. Create a new WPF App project targeting .NET 8 inside `client-windows/`.
3. Add NuGet packages for `CommunityToolkit.Mvvm` and any JSON serialization library (e.g., `System.Text.Json`).
4. Configure an `appsettings.Development.json` or constants for the FastAPI backend URL.
5. Run the app with F5 to verify the window and navigation skeleton.

## Next steps
- Define models and services for cards, sessions, and authentication.
- Build views for lobby, deck viewer, and in-game table using MVVM bindings.
- Add unit tests with xUnit/NUnit and UI automation with WinAppDriver or Playwright for .NET.
