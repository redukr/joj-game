@echo off
setlocal

REM Start the FastAPI server for local development on Windows.
REM Run this from the repository root. It will create/activate a venv,
REM install dependencies, and launch Uvicorn with autoreload.

if not exist server (
  echo [ERROR] Run this script from the repository root where the ^"server^" folder exists.
  exit /b 1
)

pushd server >nul

if not exist .venv (
  echo [INFO] Creating Python virtual environment in server\.venv...
  python -m venv .venv
  if errorlevel 1 goto :error
)

if not exist .venv\Scripts\activate.bat (
  echo [ERROR] Virtual environment activation script not found at .venv\Scripts\activate.bat.
  exit /b 1
)

call .venv\Scripts\activate.bat
if errorlevel 1 goto :error

if not exist requirements.txt (
  echo [ERROR] requirements.txt not found.
  exit /b 1
)

echo [INFO] Installing dependencies from requirements.txt...
pip install -r requirements.txt
if errorlevel 1 goto :error

echo [INFO] Starting Uvicorn with autoreload...
uvicorn app.main:app --reload
if errorlevel 1 goto :error

goto :eof

:error
echo [ERROR] Failed to start the server.
exit /b 1
