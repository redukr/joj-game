# Android Client

Native Android client built with **Kotlin** to deliver the game on phones and tablets.

## Planned stack
- Kotlin with Android Studio (Giraffe/Flamingo or newer)
- Jetpack Compose for UI
- Kotlin Coroutines + Flow for async work
- Retrofit/Ktor Client for networking

## Getting started
1. Open the project in Android Studio and create a new Compose-enabled application.
2. Set the minimum SDK (e.g., 24+) and configure namespace/package IDs.
3. Add dependencies in `build.gradle.kts` for Compose, coroutines, and networking (Retrofit or Ktor Client).
4. Point the networking layer to the FastAPI backend; store the base URL in `local.properties` or build config fields.
5. Run on an emulator or connected device using the Play button.

## Next steps
- Define data models mirroring backend card/session schemas.
- Implement key screens: deck browser, lobby/matchmaking, in-game table.
- Add unit tests with JUnit and UI tests with Compose Testing.
