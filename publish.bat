@echo off
setlocal
pushd "%~dp0..\AppDock.at365"
call dev.bat exec node "%~dp0scripts\build.cjs"
if errorlevel 1 (popd & exit /b 1)
popd
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0..\AppDock.at365\scripts\pack-applet-update.ps1" -SourceDirectory "%~dp0..\..\40.ARTIFACT\Applet.WebApplet.at365\extensions\at365.web-applet" -OutputDirectory "%~dp0..\..\40.ARTIFACT\Applet.WebApplet.at365"
if errorlevel 1 exit /b 1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\publish-deployment.ps1"
exit /b %errorlevel%
