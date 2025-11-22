@echo off
setlocal

set "VENV_DIR=.venv"
set "PYTHON_BIN="

for %%P in (python "py -3" py) do (
  where %%~P >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON_BIN=%%~P"
    goto :found_python
  )
)

echo [ERROR] Python interpreter not found in PATH. Install Python 3.10+ and retry.
goto :error

:found_python

REM Start the FastAPI server for local development on Windows.
REM Run this from the repository root. It will create/activate a venv,
REM install dependencies, and launch Uvicorn with autoreload.

if not exist server (
  echo [ERROR] Run this script from the repository root where the ^"server^" folder exists.
  exit /b 1
)

pushd server >nul

if not exist "%VENV_DIR%" (
  echo [INFO] Creating Python virtual environment in server\%VENV_DIR%...
  %PYTHON_BIN% -m venv "%VENV_DIR%" >nul 2>&1
  if errorlevel 1 (
    echo [ERROR] Failed to create virtual environment. Ensure you have write permissions to %CD%.
    echo         If %VENV_DIR% already exists, close any processes using it and delete it before retrying.
    goto :error
  )
)

if not exist "%VENV_DIR%\Scripts\activate.bat" (
  echo [ERROR] Virtual environment activation script not found at %VENV_DIR%\Scripts\activate.bat.
  exit /b 1
)

call "%VENV_DIR%\Scripts\activate.bat"
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
