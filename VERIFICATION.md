# 検証記録

## 2026-10-20: コミット前確認（0.3.0）

- 実装時と現在の製品・標準試験・共通部品/依存入力、成功ログと発行ZIP/feedをSHA256で照合し一致。標準2/2・型検査/buildと固定EXEの共通画像GUI8群を再利用した。本体の不足回帰538件とSDK影響先3Appletも成功し、本体標準は再利用込み692/692。
- 製品追加修正・再発行なし。今回の追記は検証記録のみ。[コミット検証](../AppDock.at365/.artifacts/commit-validation-profile-image-library-20261020/validation.json)と同フォルダーのstage/commit照合を参照。push・Release・実利用deployは対象外。

## 2026-10-20: 共通画像ライブラリー（0.3.0）

- main/cleanを確認してpull --ff-onlyで最新確認後に実装。サイトのimageとlist.imageKey、最低ホスト0.69.0、registered-images capabilityを追加。管理ダイアログと本体設定から共通ライブラリーを使い、旧iconと保存済みID/参照を保持。設定追加のため0.2.1→0.3.0。
- 発行前に本体の[レビュー](../AppDock.at365/.artifacts/profile-image-library-20261020/review.md)と影響を確認。標準2/2、型検査/Vite build、publish.batが成功。固定AppDock0.69.0の[GUI8群](../AppDock.at365/.artifacts/image-library-ui-1792449984611/result.json)でライブラリー選択、親の保存、同じViewの復帰、旧inline icon保持とボタン表示を確認した。設定の途中入力と登録原画像の保存を分離する。
- update.zipは87625 bytes、SHA256 feeef163486bfeb9e02a8e6c8e2a164a6ceb60f688f77c7ed877ed149cac632c。ZIP全8ファイル/発行物、feedとmanifestのID/版/最低ホスト版/size/hashが一致。証跡: [共通検証](../AppDock.at365/.artifacts/profile-image-library-20261020/validation.json)。実利用データ・認証・実サイトへ接続せず、commit/push/Release/実利用deployなし。

## 2026-10-19: GitHub更新元変更のコミット確認

- 型検査/build・標準2/2・固定EXEの更新元GUIと一覧GUI7群を再利用。配置fixture6ケースを今回追加し成功。
- 実装時の全追跡入力（検証文書を除く）・成功ログ・配布ファイル・共通GUI結果とスクリプト・本体treeをSHA256/IDで再照合し一致。製品追加修正・再発行なし。レビューで新たな指摘なし。保存済み設定と実利用先は保持。
- `.artifacts/commit-validation-github-account-20261019/`へ再利用根拠・追加試験のログ・stage/commit treeを記録。今回対象だけをコミットし、その後、本体と合わせて登録済みGitHub/AQUAへの通常pushと先端一致を確認する。過去/今回の再利用資料と未確認状態のテスト資料は保持し削除0件。Release・実利用先deployなし。

## 2026-10-19: GitHub更新元の新アカウント対応（0.2.1）

- 開始時main／clean、現在のorigin/mainからpull --ff-only成功（Already up to date）。更新元を`yukichi-7sai/Applet.WebApplet.at365`へ統一。updateRepository未登録を追加。Git remoteは既に新アカウントを指しておりpull成功。初回発行で旧shared/settings-uiへのimportが失敗したため、既存renderer/settings-ui/SettingsListTableへ1行修正し再レビュー・再発行成功。単体2/2と、最終発行物の管理画面／本体設定の一覧・ダイアログ・保存／競合・並べ替え等7群のGUI成功。

- 発行前レビューは指摘なし。設定項目・保存ファイル・公開APIの追加削除なしのためパッチ更新。保存済みupdateSourceは変更・移行せず、既定復帰で新しいmanifestの更新元へ戻す。既存publish.batで自身の40.ARTIFACT配下へ発行成功。ZIP/feed/同梱manifestのID・版・size・SHA256・runtimeの存在が一致。

- 最終AppDock 0.62.4 EXE（SHA256 043d72acd4f4176d0417bbc4166a111cecc5aaa7e8740baf21b8d6647b0e85ab）と最終Applet一式を隔離コピー。全6Appletを停止した状態で、保存済み旧指定の保持、新しい既定値の説明、版表示、「既定に戻す」後の画面／メモリ／settings.jsonの一致、停止状態維持を各Appletで確認。正常終了0。

- 証跡: `.artifacts/github-account-20261019/validation.json`。共通GUI/画像: `../AppDock.at365/.artifacts/applet-github-account-20261019/profile-1792345747763/`。入力hashは前後一致、hostはb27bd046b704e1a27ad31fdc2f481f80ea086b31。変更と無関係な全回帰・実アカウント・実Google受信・実GitHub Release取得・各機能の実Windows効果は未実施。今回と過去の成功/失敗・再利用資料を保持し削除0件。

- 本体のGitHub参照修正は先にb27bd04へコミット済み。今回のApplet変更は未コミット。push・Release・実利用先deployなし。

## 2026-10-15: 初回コミット前確認

実装時の21入力ファイル、Node/HTMLの配布8資産、ホストの発行EXEを照合して一致。型検査/ビルド・Applet単体2件・配置6件・一覧5群/Web動作4群/動的4群の成功結果を再利用。本体は不足していた標準回帰416件を追加し、再利用と合わせて484/484成功した。製品ソースを変更せず、公開用remoteや更新元は未設定のまま初回コミットする。

前回後に再作成されたZIPの現SHA256は`0941e1f9474eb178e9d0600ae262595c4ed5adb5ebc928c1172b63c25945913d`、85,065 bytes。feedと一致し、全8エントリは前回検証時およびpublishフォルダーと同一。版0.2.0/最低ホスト0.45.0を維持。証跡は[本体のコミット検証](../AppDock.at365/.artifacts/commit-validation-webapplet-20261015/validation.json)、当repoの`.artifacts/commit-validation-webapplet-20261015/commit.json`。今回の実利用先deploy・push・Releaseは未実施。

## 2026-10-15: 共通一覧と編集ダイアログ0.2.0

登録サイト・初期ショートカットを共通SettingsListTableで表示し、追加/編集をダイアログ化。アイコン・トグル・削除確認・並べ替えに対応。本体設定はmanifestのobject-list.listから自動生成し、最低ホスト0.45.0。旧設定の取り込み処理はホストから撤去し、保存済みのID/ログイン保存先参照は維持する。

- 型検査/ビルド・単体2件成功。配置6件は8資産のコピーhash・設定/data保持・失敗時保護を確認（`.artifacts/deploy-test-20261015-174812/result.json`）。最終表示修正は配置コードに影響しないため、この配置試験を再利用した。
- 最終発行EXEで一覧5群（本体設定とApplet詳細設定を含む）、Web動作4群（推奨設定、View/実Cookie保持）、発行win-unpackedで動的ページ4群が成功。保存後に初期ショートカットの一覧が古いままになる問題を発見し、旧インライン入力向けの更新抑止を除去。Appletを再発行し、修正後に全13群を確認した。画像も目視。証跡・入力hash・環境・途中の失敗は[本体の記録](../AppDock.at365/.artifacts/list-ui-20261015/validation.json)を参照。
- `publish.bat`成功。ZIP8ファイルは配布フォルダーとhash一致、DLL/EXEなし。0.2.0 / minimumHostVersion0.45.0、**85,065 bytes / SHA256 1ef8ec7bf5fc46cb4f219b3d24d5c2ca9ff5934d0d838476ddb5b5bb19f2d5ee**。発行ログは`.artifacts/lists-publish-final.log`。
- 0.1.1のdeploy成功は利用者から報告済み。今回の0.2.0はpublishまでで実利用先deploy・commit/push/Releaseは行っていない。導入には本体とAppletの両方を更新する。

## 2026-10-15: 初版0.1.0

AppDock 0.44.0と同時に設計・実装・ローカル発行。実行資産はindex.cjs、metadata.cjs、HTML/JS/CSS、extension.jsonの6ファイル。DLL/EXEや.NETランタイムは含まない。TypeScript型検査・ビルド成功。publish.bat終了0。

- 単体2/2: 推奨JSONの許可フィールド、別origin転送拒否、認証なし取得、サイズ上限、資格情報付きURL拒否。ホストの関連55件（54件＋同期競合1件）も成功。
- 動的ページGUI、旧0.43.1の実Cookie移行、Gmail/固定ページの互換性、発行単一EXEとの結合試験が成功。取得した推奨設定を使ったサイト追加、手動名の再取得時保持、page/window移動、再起動後Cookie、明暗テーマ、親停止時破棄を確認。
- 証跡と実行条件は[ホストの検証記録](../AppDock.at365/VERIFICATION.md)と[validation.json](../AppDock.at365/.artifacts/dynamic-pages-20261015/validation.json)。発行前レビューの修正と再試験、途中のレイアウト待ち試験失敗も同所へ記録。
- update.zip: 11,771 bytes、SHA256 `166670cca5e39f7209e2712925018383205e278dd3e2d4d9aa8ac5b779630063`。feed/manifestは0.1.0、minimumHostVersion 0.44.0。ZIP内6ファイルとpublish/extensions/at365.web-appletが一致。

公開リポジトリと自動更新元は未設定。実利用先deploy、commit/push/Releaseは未実施。実サイトへの認証、長時間受信はfixtureでの成功と区別する。

## 2026-10-15: deploy修正0.1.1

原因はdeploy.batが参照するscripts/install-local.ps1の欠落。配置スクリプトを追加し、UTF-8のdeploy.local.txt読込をPowerShellへ集約した。設定・API・アプリ保存仕様の変更はなく、Appletだけパッチ更新。本体0.44.0は変更・再発行していない。

- 発行前レビュー: 欠落参照、引数優先、文字コード、publish失敗時中止、コピー範囲、ハッシュ照合を確認。指摘したBAT側set /pの文字化けリスクを修正。証跡は`.artifacts/deploy-fix-20261015/review.txt`。
- `tests/deploy.test.ps1`: 6/6成功。明示先、日本語/空白/BOM付きUTF-8設定、引数優先、不正先、空設定、publish失敗時の既存ファイル保持。全6ファイルのSHA256一致とsettings/data/別Appletの保持も確認。`.artifacts/deploy-test-20261015-170536/result.json`。
- `publish.bat`終了0。実際の`deploy.bat`も固定AppDock EXEをコピーした隔離先へ終了0で配置し、全6ファイルのSHA256一致。`.artifacts/deploy-fix-20261015/result.json`に対象入力hash・本体hash・feed・ZIP hash、同所にpublish/deployログ。
- feed/manifestとも0.1.1、minimumHostVersion 0.44.0。ZIP内6ファイルが発行元と一致。update.zipは11,772 bytes、SHA256 `1ab43af5c402397f53de661f92168910867440a2e4f868225070bc47cecb796c`。
- 今回は開発用配置処理の修正。runtime/画面コードを変更していないため、前項のGUI回帰は再実行していない。隔離先EXEの起動・実利用先deploy・commit/push/Releaseは今回未実施。

## 2026-10-16 発行先の40.ARTIFACTへの移行

- 発行先: `A:\40.ARTIFACT\Applet.WebApplet.at365`。publish.batとビルド・更新梱包・関連検証の参照を変更。配置用正本はdeployment/へ移動し、成功後に発行先へ追加。deployは発行済み成果物を使い、既存deploy.bat・関連スクリプト・deploy.local.txtを保持する。配置先設定はハッシュ一致を確認して旧repo直下から移動。旧publishの過去成果物は保持。
- レビュー: 発行パス・削除境界・配置の独立動作・設定保持・梱包/Release参照を確認。GmailのWeb出力ガード、配置時の再ビルド依存、試験fixtureの分離、文書参照を修正して再確認。未解決指摘なし。発行基盤のみの変更のため製品版は0.2.0を維持。
- 検証: publish.batを2回実行し両方終了0（`.artifacts/publish-relocation-20261016/publish.log`、`.artifacts/publish-relocation-20261016/republish.log`）。7repo合計24配置用ファイルのハッシュ保持。全7repoの独立配置fixture28ケースとWebApplet専用6ケース、WebApplet単体2件、梱包/Release fixture11件、本体型検査・最終EXE隔離起動が成功。全feedの版・サイズ・SHA256、Applet ZIPの全収録ファイルと発行物を照合。
- 発行物SHA256: `9c115bf4abd129a5863e0cd6df5129d6141b12bba3655ac12bd7d2190c82c0f1`。共通証跡: [検証一覧](../AppDock.at365/.artifacts/publish-relocation-20261016/validation.json)、[出力照合](../AppDock.at365/.artifacts/publish-relocation-20261016/artifact-validation.json)、[再発行保持](../AppDock.at365/.artifacts/publish-relocation-20261016/republish-result.json)。
- 制限環境のpnpm STATUS_STACK_OVERFLOWとEXE spawn失敗、fixtureのrename EPERMは通常ユーザー権限で同一処理を再実行して成功。依存版・lockfile・検証方針は維持。実利用先deploy・commit・push・外部公開は未実行。製品機能の変更がないため無関係な全回帰・実アカウント操作は実行していない。

## 2026-10-16 発行先移行のコミット前確認

- 実装時の入力スナップショット全7repoとログSHA256、最終発行EXE・各ZIP/feed・配置用24ファイルを照合し、型検査・ビルド・発行2回・配置・隔離起動・梱包Release fixture11件・WebApplet単体2件/配置6ケース・WebBrowserTools単体2件を再利用。製品と発行物の変更はないため再発行・版更新は不要。
- 不足分として本体標準回帰の残り487件、Gmail22件、Watch8件、WindowsTools38件、WallpaperSlideshow標準回帰を確認。本体486件は初回で成功、実行ディレクトリに依存するnode-invocationの1件は正しいrepoディレクトリから単独再実行して成功。既存11件と合わせ本体498件・skipなし。初回コマンドの終了1は保持し、全体成功へ読み替えず試験単位で照合。
- 通常ユーザー実行でfixtureビルドとネットワーク依存の.NET検証・Git fetchが成功。全7repoの入力と発行物を維持。失敗時の作業ディレクトリに生成された今回の試験資料は共通証跡内のinitial-cwd-artifactsへ移動して保持。
- 共通証跡: [コミット検証](../AppDock.at365/.artifacts/commit-validation-publish-relocation-20261016/validation.json)。stage treeとcommit tree、プッシュ先mainの一致を同フォルダーへ記録する。実利用先deployとGitHub Releaseは対象外。
