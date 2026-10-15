@echo off
setlocal
pushd "%~dp0..\AppDock.at365"
call dev.bat exec node "%~dp0scripts\build.cjs"
if errorlevel 1 (popd & exit /b 1)
popd
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0..\AppDock.at365\scripts\pack-applet-update.ps1" -SourceDirectory "%~dp0publish\extensions\at365.web-applet" -OutputDirectory "%~dp0publish"
if errorlevel 1 exit /b 1
exit /b 0
