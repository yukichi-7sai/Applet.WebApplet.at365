# 開発

機能の説明・操作方法・設定・既定値・動作環境は[機能・操作・設定](docs/usage.md)を参照してください。共通の文書構成は[ドキュメント方針](../AppDock.at365/docs/documentation.md)に従います。

## 発行先

標準発行先は `A:\40.ARTIFACT\Applet.WebApplet.at365` です。`publish.bat`はソースrepoから実行します。詳細は[共通発行手順](../AppDock.at365/docs/publishing.md)を参照してください。

共通契約は[Appletガイド](../AppDock.at365/docs/applet-development.md)、[API](../AppDock.at365/docs/extensions.md)、[動的ページ](../AppDock.at365/docs/applet-pages.md)、[保存](../AppDock.at365/docs/settings-sync.md)、[開発手順](../AppDock.at365/docs/development-workflow.md)を参照します。

src/index.tsは制限付きメタデータ取得、src/metadata.tsは推奨JSONの検証を担当します。サイト管理はホストの共通設定フォームを使用し、独立した管理HTMLや管理コマンドは持ちません。サイトの許可やCookieをApplet側で直接操作しません。

## ビルド・発行

AppDockのプロジェクトローカルNode/TypeScriptを使用します。AppDockフォルダーから `dev.bat exec node ../Applet.WebApplet.at365/scripts/build.cjs` で型検査とビルド、`dev.bat exec node --test ../Applet.WebApplet.at365/tests/*.test.cjs` で単体試験を行います。

一覧・ダイアログ・画像選択はホストの共通設定部品で描画します。本AppletはNodeコードとmanifest、本AppletのMIT Licenseだけを配布し、ブラウザー用JS/CSSやFluidの複製を含めません。buildは型検査の後、既知の旧管理ページ生成物だけを発行先から除去し、未知のファイルは保持します。

本repoのpublish.batでruntime資産とupdate.zip/update.jsonを生成します。配布時の.NET依存はありません。共通pack-applet-update.ps1が使う開発用パッケージツールはホスト側の.NET SDKでビルドされます。更新元はmanifestの`updateRepository: "yukichi-7sai/Applet.WebApplet.at365"`です。GitHub Releaseの公開は別工程です。

GUI・保存済みID・固定EXE試験はホストのscripts/dynamic-pages-ui-test.cjs、web-list-ui-test.cjs、web-applets-portable-test.cjsを使用します。実利用データに接続しない隔離fixtureを用います。

配置先の本体は0.172.0以降が必要です。

ローカル配置は対象のAppDockを完全終了し、`A:/40.ARTIFACT/Applet.WebApplet.at365/extensions/at365.web-applet`を配置先の`extensions/at365.web-applet`へコピーします。設定・data・他Appletは保持し、配置後はAppDockを起動し直してください。

一覧の列・初期値・ダイアログ項目はextension.jsonのobject-list/list/fieldsで宣言します。`list.draftAction`が`discover`を参照し、ホスト設定から既存の`page.action` RPCを呼びます。`onPageAction`のpageIdは`settings:sites`です。返す値はname/url/navigation、任意のmessageとPNG/JPEGのimageBytesで、ホストが宣言済みフィールドだけを一時入力へ適用します。共通契約は[一覧設定UI](../AppDock.at365/docs/settings-list-editing.md)を参照してください。

共通画像のAPI・型・保存は[登録画像の契約](../AppDock.at365/docs/registered-images.md)を参照します。取得元bytesは親ダイアログのOKでimportし、手動選択と旧iconを保持します。固定EXEとの画像連携は本体のscripts/web-applets-portable-test.cjsとscripts/image-library-ui-test.cjsで確認します。

独自の画像画面やページbridgeは持たず、本体所有の画像選択を使います。`sites` と `siteShortcutDefaults` を宣言し、サイト別のログイン枠と回収は[本体の設定由来ページ](../AppDock.at365/docs/web-applets.md#保存と回収)に委譲します。

## 共通の運用

文書構成・生成物・版更新・配布は[共通手順](../AppDock.at365/docs/development-workflow.md)、[文書方針](../AppDock.at365/docs/documentation.md)、[発行と配置](../AppDock.at365/docs/publishing.md)、[更新パッケージ](../AppDock.at365/docs/updates.md)、[生成物の整理](../AppDock.at365/DEVELOPMENT.md#作業完了時のテストフォルダー整理)を参照する。Applet固有の実行条件と結果は[検証記録](VERIFICATION.md)へ記載する。

## テストの共通実行場所

GUI試験のAppDockは[共通実行場所](../AppDock.at365/docs/testing.md#固定配布物の共通実行場所)を使い、本repoの`.artifacts`をprofile保存rootとして明示します。既存の`--test-profile`等で設定・data・必要なextensionsと結果・ログを分離します。固定build出力を使う試験には追加コピーを作りません。
