@echo off
setlocal
title Debugique - Launcher
cd /d "%~dp0"

echo ==========================================================
echo   Debugique  -  starting backend and frontend together
echo ==========================================================
echo.

rem --- Install missing dependencies automatically -------------
if not exist "%~dp0backend\node_modules" (
    echo [info] Installing backend dependencies (first run)...
    call npm install --prefix "%~dp0backend"
    if errorlevel 1 goto :error
)
if not exist "%~dp0client\node_modules" (
    echo [info] Installing frontend dependencies (first run)...
    call npm install --prefix "%~dp0client"
    if errorlevel 1 goto :error
)

rem --- Launch backend and frontend in separate windows --------
echo [ok] Starting backend on  http://localhost:5000
start "Debugique Backend (port 5000)" cmd /k "cd /d backend && node server.js"

echo [ok] Starting frontend on http://localhost:5173
start "Debugique Frontend (client)" cmd /k "cd /d client && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Keep those windows open - closing them stops the app.
echo.
pause
exit /b 0

:error
echo.
echo [ERROR] Something went wrong. See the message above.
pause
exit /b 1