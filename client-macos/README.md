# macOS Client

Desktop client for macOS built with **SwiftUI** to match the native look and feel on Mac.

## Planned stack
- Swift 5.9+
- SwiftUI + AppKit interop where needed
- Combine for state updates
- URLSession/async-await networking

## Getting started
1. Open the workspace in Xcode 15+ and create a macOS App (SwiftUI) target.
2. Configure bundle identifiers and signing for development builds.
3. Add a shared networking layer and models aligned with the server API.
4. Use Swift Package Manager for any shared modules between iOS and macOS targets.

## Next steps
- Prototype core screens (dashboard, card library, multiplayer lobby).
- Add menu commands and keyboard shortcuts for common actions.
- Prepare unit/UI tests using XCTest and SwiftUI previews.
