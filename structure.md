# Project architecture

Catalog of every file in the repository with brief notes on why it exists and how it connects to the project.

## Repo configuration and meta
- `.github/copilot-instructions.md` – Guidance for code suggestions and conventions.
- `.gitignore` – Ignores build artifacts, Python caches, and OS files.
- `.vscode/settings.json` – Workspace defaults for the VS Code editor.
- `LICENSE` – Project license (MIT).
- `README.md` – Top-level overview and quickstart for the game services.

## Admin web client (`admin-web/`)
- `admin-web/README.md` – Notes for running and maintaining the admin UI.
- `admin-web/admin.html` – Admin entry page markup.
- `admin-web/main.js` – Admin logic for tokens, deck management, and accessibility enhancements.
- `admin-web/management.html` – Room/user management page markup.
- `admin-web/styles.css` – Styling for admin pages, focus states, dialogs, and layout.

## Player web client (`client-web/`)
- `client-web/README.md` – Usage notes for the player-facing web bundle.
- `client-web/index.html` – Landing/login markup for players.
- `client-web/main.html` – Game lobby and play surface markup.
- `client-web/main.js` – Client-side logic for authentication, rooms, cards, and validation.
- `client-web/styles.css` – Player UI styling, focus indicators, and toasts.

## Platform client stubs
- `client-android/README.md` – Android client scaffold description.
- `client-ios/README.md` – iOS client scaffold description.
- `client-macos/README.md` – macOS client scaffold description.
- `client-unix/README.md` – Unix desktop client notes.
- `client-windows/README.md` – Windows client overview.
- `client-windows/auth/credentials.sample.json` – Sample credentials file for Windows client auth plugin.
- `client-windows/src/JojGame.Client.Windows/JojGame.Client.Windows.csproj` – Project file for the Windows WPF client.
- `client-windows/src/JojGame.Client.Windows/appsettings.json` – Client configuration defaults.
- `client-windows/src/JojGame.Client.Windows/App.xaml` – WPF application definition.
- `client-windows/src/JojGame.Client.Windows/App.xaml.cs` – App bootstrap code-behind.
- `client-windows/src/JojGame.Client.Windows/Models/AuthenticationResult.cs` – Auth result model.
- `client-windows/src/JojGame.Client.Windows/Models/CredentialRecord.cs` – Credential storage model.
- `client-windows/src/JojGame.Client.Windows/Plugins/FileAuthenticationPlugin.cs` – File-based authentication implementation.
- `client-windows/src/JojGame.Client.Windows/Plugins/IAuthenticationPlugin.cs` – Plugin interface for authentication providers.
- `client-windows/src/JojGame.Client.Windows/Services/AuthService.cs` – Auth service wiring plugins and hashing.
- `client-windows/src/JojGame.Client.Windows/Settings/AppSettings.cs` – Strongly typed settings holder.
- `client-windows/src/JojGame.Client.Windows/Utilities/PasswordHasher.cs` – Helper for hashing and verifying passwords.
- `client-windows/src/JojGame.Client.Windows/Views/LoginWindow.xaml` – Login UI definition.
- `client-windows/src/JojGame.Client.Windows/Views/LoginWindow.xaml.cs` – Login window logic.
- `client-windows/src/JojGame.Client.Windows/Views/MainWindow.xaml` – Main window layout.
- `client-windows/src/JojGame.Client.Windows/Views/MainWindow.xaml.cs` – Main window code-behind.

## Game data (`cards/`)
- `cards/README.md` – Notes about card data formats.
- `cards/cards_1.txt` – Sample raw card text data.
- `cards/sample-deck-lyap.json` – Example deck definition (Lyapunov-themed).
- `cards/sample-deck.json` – Example deck definition used by server loaders and tests.

## Server (FastAPI backend)
- `server/README.md` – Backend-specific setup and run instructions.
- `server/app/__init__.py` – Marks the FastAPI app package.
- `server/app/config.py` – Environment-driven configuration loader.
- `server/app/db.py` – SQLAlchemy engine/session setup and context management.
- `server/app/dependencies.py` – FastAPI dependencies for auth and repository wiring.
- `server/app/loaders.py` – Card/deck ingestion utilities used at startup.
- `server/app/main.py` – FastAPI entrypoint mounting static bundles and API routers.
- `server/app/models.py` – ORM and Pydantic models for users, rooms, cards, and auth payloads.
- `server/app/repository.py` – Data access layer encapsulating CRUD operations.
- `server/app/routes/__init__.py` – Router package marker.
- `server/app/routes/admin.py` – Admin-only endpoints (token verification, deck/user management).
- `server/app/routes/auth.py` – Authentication/login endpoints.
- `server/app/routes/cards.py` – Card/deck retrieval and upload endpoints.
- `server/app/routes/rooms.py` – Lobby/room creation and join endpoints.
- `server/app/test_integration.py` – Integration tests for admin/auth/room/card flows.
- `server/app/test_models_unit.py` – Unit tests for model validation and helpers.
- `server/config/settings.yaml` – Example configuration values for deployments.
- `server/error-log.txt` – Captured server error log sample.
- `server/requirements.txt` – Python dependencies for the backend service.

## Documentation & helpers
- `manual.txt` – Additional manual/reference notes for gameplay or operations.
- `strat-server.bat` – Windows helper script to start the server.
- `structure.md` – This repository map for fast onboarding.
