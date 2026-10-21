@echo off
setlocal
title GrandRP HUB - Local Preview
cd /d "%~dp0"

set "PORT=8080"

where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo   Node.js was not found on PATH.
    echo   Install it from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

if not exist "tools\preview-server.js" (
    echo.
    echo   Missing tools\preview-server.js
    echo.
    pause
    exit /b 1
)

echo Starting GrandRP HUB preview...
echo If port %PORT% is busy, the next free port is used automatically.
echo.

node "tools\preview-server.js" "%CD%" %PORT%

echo.
echo Server stopped.
timeout /t 3 >nul
