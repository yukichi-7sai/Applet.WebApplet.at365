. ([IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\AppDock.at365\scripts\publish-paths.ps1')))
$taskRoot = Split-Path $PSScriptRoot -Parent
Install-PublishedDeployment $taskRoot (Get-PublishDirectory $taskRoot)
