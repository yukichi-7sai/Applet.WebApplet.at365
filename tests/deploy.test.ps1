$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot -Parent
. (Join-Path $taskRoot '..\AppDock.at365\scripts\publish-paths.ps1')
$taskPublished = Get-PublishDirectory $taskRoot
$taskRun = Join-Path $taskRoot ('.artifacts\deploy-test-' + [DateTime]::Now.ToString('yyyyMMdd-HHmmss'))
$taskFixture = Join-Path $taskRun 'repo'
$taskTarget = Join-Path $taskRun '配置先 with spaces'
New-Item -ItemType Directory -Path "$taskFixture\scripts", "$taskFixture\extensions", "$taskTarget\data", "$taskTarget\extensions\other" -Force | Out-Null
Copy-Item -LiteralPath "$taskPublished\deploy.bat" -Destination $taskFixture
Copy-Item -LiteralPath "$taskPublished\scripts\install-local.ps1" -Destination "$taskFixture\scripts"
Copy-Item -LiteralPath "$taskPublished\extensions\at365.web-applet" -Destination "$taskFixture\extensions" -Recurse
[IO.File]::WriteAllText("$taskTarget\AppDock.at365.exe", 'fixture')
foreach ($taskRelative in @('settings.json', 'data\keep.txt', 'extensions\other\keep.txt')) {
    [IO.File]::WriteAllText((Join-Path $taskTarget $taskRelative), 'preserve')
}
function Invoke-Deploy([string[]]$Arguments, [string]$Name, [bool]$Success) {
    & "$taskFixture\deploy.bat" @Arguments *> "$taskRun\$Name.log"
    if (($LASTEXITCODE -eq 0) -ne $Success) { throw "Unexpected result: $Name, exit=$LASTEXITCODE" }
}
Invoke-Deploy @($taskTarget) 'explicit' $true
foreach ($taskFile in Get-ChildItem -LiteralPath "$taskPublished\extensions\at365.web-applet" -Recurse -File) {
    $taskRelative = $taskFile.FullName.Substring(("$taskPublished\extensions\at365.web-applet").Length + 1)
    if ((Get-FileHash -LiteralPath $taskFile.FullName).Hash -ne
        (Get-FileHash -LiteralPath "$taskTarget\extensions\at365.web-applet\$taskRelative").Hash) { throw 'Copy mismatch' }
}
[IO.File]::WriteAllText("$taskFixture\deploy.local.txt", $taskTarget, [Text.UTF8Encoding]::new($true))
Invoke-Deploy @() 'utf8-config' $true
[IO.File]::WriteAllText("$taskFixture\deploy.local.txt", "$taskRun\missing", [Text.UTF8Encoding]::new($false))
Invoke-Deploy @($taskTarget) 'argument-precedence' $true
Invoke-Deploy @() 'invalid-target' $false
[IO.File]::WriteAllText("$taskFixture\deploy.local.txt", '', [Text.UTF8Encoding]::new($false))
Invoke-Deploy @() 'empty-config' $false
$taskInstalled = "$taskTarget\extensions\at365.web-applet\index.cjs"
$taskBefore = (Get-FileHash -LiteralPath $taskInstalled).Hash
Remove-Item -LiteralPath "$taskFixture\extensions\at365.web-applet\index.cjs"
Invoke-Deploy @($taskTarget) 'missing-payload' $false
if ((Get-FileHash -LiteralPath $taskInstalled).Hash -ne $taskBefore) { throw 'Missing payload changed installed file' }
foreach ($taskRelative in @('settings.json', 'data\keep.txt', 'extensions\other\keep.txt')) {
    if ([IO.File]::ReadAllText((Join-Path $taskTarget $taskRelative)) -ne 'preserve') { throw 'User data changed' }
}
[ordered]@{ passed = 6; fixture = $taskRun; hashesMatch = $true; dataPreserved = $true; missingPayloadPreserved = $true } |
    ConvertTo-Json | Set-Content -LiteralPath "$taskRun\result.json" -Encoding UTF8
Write-Output "PASS: $taskRun"
