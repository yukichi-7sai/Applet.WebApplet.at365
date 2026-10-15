# 検証記録

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
