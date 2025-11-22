# Unix/Desktop Client

Cross-platform desktop/web client built with **React** and **Node.js**. Intended to run in the browser or be packaged with Electron for Linux and other Unix-like systems.

## Planned stack
- Node.js 20+
- React with Vite (or Next.js) for the UI
- TypeScript for type safety
- Axios or Fetch for API calls to the FastAPI server
- Optional: Electron for desktop packaging

## Getting started
1. Install Node.js 20+ (use `nvm` or your package manager).
2. Initialize the project:
   ```bash
   npm create vite@latest client-unix -- --template react-ts
   cd client-unix
   npm install
   ```
3. Configure an `.env.local` with the backend API URL, e.g., `VITE_API_BASE_URL=http://localhost:8000`.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. For Electron packaging, add an Electron entry point and bridge to the React build output.

## Next steps
- Define shared TypeScript models for cards and sessions.
- Add routing for lobby, game table, and card browser screens.
- Set up testing with Vitest/React Testing Library and linting with ESLint/Prettier.
