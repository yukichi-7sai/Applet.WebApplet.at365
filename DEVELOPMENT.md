# 開発

## 発行・配置ファイルの保存先

標準発行先は `A:\40.ARTIFACT\Applet.WebApplet.at365` です。`publish.bat`はソースrepo、`deploy.bat`は発行先から実行します。配置用ファイル・設定の保持とテンプレートの更新は[共通発行手順](../AppDock.at365/docs/publishing.md)を参照してください。

共通契約は[Appletガイド](../AppDock.at365/docs/applet-development.md)、[API](../AppDock.at365/docs/extensions.md)、[動的ページ](../AppDock.at365/docs/dynamic-pages-webapplet-design.md)、[保存](../AppDock.at365/docs/settings-sync.md)、[開発手順](../AppDock.at365/docs/development-workflow.md)を参照します。

src/index.tsは管理コマンドと制限付きメタデータ取得、src/metadata.tsは推奨JSONの検証、webは管理画面です。Host APIはページ・プロフィール・画像・自設定保存に限定します。サイトの許可やCookieをApplet側で直接操作しません。

AppDockのプロジェクトローカルNode/TypeScriptを使用します。AppDockフォルダーから `dev.bat exec node ../Applet.WebApplet.at365/scripts/build.cjs` で型検査とビルド、`dev.bat exec node --test ../Applet.WebApplet.at365/tests/*.test.cjs` で単体試験を行います。

本repoのpublish.batでruntime資産とupdate.zip/update.jsonを生成します。配布時の.NET依存はありません。共通pack-applet-update.ps1が使う開発用パッケージツールはホスト側の.NET SDKでビルドされます。更新元はmanifestの`updateRepository: "yukichi-7sai/Applet.WebApplet.at365"`です。GitHub Releaseの公開は別工程です。

GUI・保存済みID・固定EXE試験はホストのscripts/dynamic-pages-ui-test.cjs、web-list-ui-test.cjs、web-applets-portable-test.cjsを使用します。実利用データに接続しない隔離fixtureを用います。

ローカル配置は対象のAppDockを終了してから `A:\40.ARTIFACT\Applet.WebApplet.at365\deploy.bat "配置先フォルダー"` を実行します。引数を省略する場合は、発行先直下の `deploy.local.txt` の先頭行へAppDock.at365.exeがあるフォルダーの絶対パスをUTF-8で保存します。この端末専用ファイルはGit管理しません。配置先の本体は0.45.0以降が必要です。

deployは発行済みの成果物から、`A:/40.ARTIFACT/Applet.WebApplet.at365/extensions/at365.web-applet` を配置先の `extensions/at365.web-applet` へコピーし、各ファイルのSHA256を照合します。設定・data・他Appletは保持します。本体の更新・終了・起動は自動実行しません。配置後はAppDockを起動し直してください。

一覧の列・初期値・ダイアログ項目はextension.jsonのobject-list/list/fieldsで宣言します。管理画面はsrc/list-ui.tsxからホスト共通SettingsListTableをViteで同梱し、設定画面は本体が自動生成します。共通契約は[一覧設定UI](../AppDock.at365/docs/settings-list-editing.md)を参照してください。
