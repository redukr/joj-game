# iOS Client

Native iOS client built with **SwiftUI** to deliver the game experience on iPhone and iPad.

## Planned stack
- Swift 5.9+
- SwiftUI for UI
- Combine for state updates
- URLSession/async-await networking to the FastAPI backend

## Getting started
1. Open the project in Xcode 15 or newer.
2. Create an iOS App target using SwiftUI lifecycle and minimum iOS 16.
3. Add networking layer pointing to the FastAPI server (configurable via build settings).
4. Use Swift Package Manager for dependencies (e.g., `swift-collections`, `swift-algorithms` if needed).

## Next steps
- Define shared models that match the backend's card/session schemas.
- Add preview data for key screens (deck browser, game table, settings).
- Integrate offline caching if needed using `FileManager` or Core Data.
