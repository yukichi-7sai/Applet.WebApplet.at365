param([string]$AppDockDirectory)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot -Parent
if ([string]::IsNullOrWhiteSpace($AppDockDirectory)) {
    $taskConfig = Join-Path $taskRoot 'deploy.local.txt'
    if (Test-Path -LiteralPath $taskConfig -PathType Leaf) {
        $AppDockDirectory = Get-Content -LiteralPath $taskConfig -Encoding UTF8 -TotalCount 1
    }
}
if ([string]::IsNullOrWhiteSpace($AppDockDirectory)) {
    throw 'AppDock.at365.exeがあるフォルダーを引数またはdeploy.local.txtの先頭行で指定してください。'
}
$taskHostDirectory = [IO.Path]::GetFullPath($AppDockDirectory.Trim())
if (-not (Test-Path -LiteralPath (Join-Path $taskHostDirectory 'AppDock.at365.exe') -PathType Leaf)) {
    throw '配置先にAppDock.at365.exeがありません。引数またはdeploy.local.txtを確認してください。'
}


$taskSource = Join-Path $taskRoot 'extensions\at365.web-applet'
$taskTarget = Join-Path $taskHostDirectory 'extensions\at365.web-applet'
$taskManifest = Get-Content -LiteralPath (Join-Path $taskSource 'extension.json') -Raw -Encoding UTF8 | ConvertFrom-Json
if ($taskManifest.id -ne 'at365.web-applet') { throw '発行物のApplet IDが一致しません。' }
foreach ($taskRequired in @('index.cjs', 'metadata.cjs', 'web\index.html', 'web\app.js', 'web\style.css', 'web\lists.js', 'web\lists.css')) {
    if (-not (Test-Path -LiteralPath (Join-Path $taskSource $taskRequired) -PathType Leaf)) {
        throw "発行物が不足しています: $taskRequired"
    }
}
if ([IO.Path]::GetFullPath($taskSource) -eq [IO.Path]::GetFullPath($taskTarget)) {
    throw '発行元と配置先が同じです。別のAppDock配置先を指定してください。'
}
foreach ($taskFile in Get-ChildItem -LiteralPath $taskSource -Recurse -File) {
    $taskRelative = $taskFile.FullName.Substring($taskSource.Length + 1)
    $taskDestination = Join-Path $taskTarget $taskRelative
    New-Item -ItemType Directory -Path (Split-Path $taskDestination -Parent) -Force | Out-Null
    Copy-Item -LiteralPath $taskFile.FullName -Destination $taskDestination -Force
    if ((Get-FileHash -LiteralPath $taskFile.FullName -Algorithm SHA256).Hash -ne
        (Get-FileHash -LiteralPath $taskDestination -Algorithm SHA256).Hash) {
        throw "配置後のハッシュが一致しません: $taskRelative"
    }
}
Write-Host "Deployed: $taskTarget"
Write-Host 'AppDock 0.45.0以降で起動し直し、WebAppletを有効にしてください。'
