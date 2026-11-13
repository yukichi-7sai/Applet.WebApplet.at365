$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot -Parent
$taskHost = Join-Path (Split-Path $taskRoot -Parent) 'AppDock.at365'
. (Join-Path $taskHost 'scripts\publish-paths.ps1')
$taskOutput = Get-PublishDirectory $taskRoot
& (Join-Path $taskHost 'scripts\pack-applet-update.ps1') -SourceDirectory (Join-Path $taskOutput 'extensions\at365.web-applet') -OutputDirectory $taskOutput
if ($LASTEXITCODE -ne 0) { throw 'Applet update packaging failed.' }
