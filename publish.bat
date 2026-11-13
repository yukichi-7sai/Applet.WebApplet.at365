@echo off
setlocal
pushd "%~dp0..\AppDock.at365"
call dev.bat exec node "%~dp0scripts\build.cjs"
if errorlevel 1 (popd & exit /b 1)
popd
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\pack-update.ps1"
exit /b %errorlevel%
