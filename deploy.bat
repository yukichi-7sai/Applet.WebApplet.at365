@echo off
setlocal DisableDelayedExpansion

if not "%~1"=="" (
    pwsh.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\install-local.ps1" -AppDockDirectory "%~f1"
) else (
    pwsh.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\install-local.ps1"
)

exit /b %errorlevel%
