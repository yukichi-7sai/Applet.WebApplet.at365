# 検証記録

## 2026-11-07 main取り込み版AppDockへの対応（0.6.0）

- 作業ブランチは取得した `main` と `origin/main` の `3dafcbb` を含んでいた。機能を含む統合後の本体に合わせて最低ホスト版を0.172.0に引き上げ、Appletを0.6.0へ更新した。
- TypeScriptビルド、単体試験2件、統合後の固定EXEでのサイト登録、ログイン枠の分離、未導入時の回収が成功した。
- 配布物は `A:/40.ARTIFACT/Applet.WebApplet.at365/worktrees/web-applet-site-accounts-main-0.172.0/`。6ファイルを発行元とSHA256照合した。更新ZIPは `bc7263caf2647716a5352dd2390ce3a5d2f78a2dcd9d06b37b88e62172200cec`。配布manifestとfeedの版・最低ホスト版を照合した。
- 証跡は `.artifacts/main-sync-web-applet-site-accounts/`。

## 2026-11-07 サイトごとのログイン枠（0.5.0）

- 発行前レビューで、登録一覧と初期ショートカットを新しい設定キーで開始し、枠の選択欄を廃止する宣言を確認した。設定項目の変更と最低ホスト版0.170.0への引き上げに伴うマイナー更新。
- TypeScriptビルドと単体試験2件が成功。対応する固定EXEで、空の登録一覧から追加、推奨設定・画像の確定と取消、同一URLのCookie分離、再起動、削除、Applet未導入時の回収を確認した。実サイトのログインは対象外。
- 配布物は `A:\40.ARTIFACT\Applet.WebApplet.at365\worktrees\web-applet-site-accounts`。6ファイルを発行元とSHA256照合した。更新ZIPのSHA256は `daeb12f79ddd619927a3988531af988bebbe23eb57ae0b09b486940eef7a57e1`。配布manifestの版・最低ホスト版をfeedと照合した。
- ビルドと試験ログ、試験入力treeおよび最終treeは `.artifacts/commit-validation-web-applet-site-accounts/`。

## 2026-11-03 配置ツール整理のコミット前照合

- 実装時の最終差分と削除状態、試験入力・成功ログ・発行先185ファイルのSHA256を照合した。関連試験6件と構文・参照検査の成功を再利用し、追加の製品回帰・再発行は行っていない。
- 共通指示と本体・8Appletの今回差分だけをコミット対象とした。再利用判定、stage treeとcommit treeの照合結果は`../AppDock.at365/.artifacts/commit-validation-deploy-removal-20261103/`に保存する。push・Release・実利用先配置は行わない。

## 2026-11-03 開発用配置スクリプトの除去

- deployment一式と40.ARTIFACT内の配置用スクリプト・記入例・配置先設定を、存在する範囲で削除した。publishから専用コピー処理を外し、開発文書と不要なGit除外規則を整理した。配置専用のscripts/publish-deployment.ps1とtests/deploy.test.ps1も削除した。
- 差分レビューで既存のビルドと更新ZIP/JSON生成を保持していることを確認した。変更スクリプトの構文・現行の廃止ファイル参照・git diff --checkと、本体を含む全9repoの発行先計算を確認した。発行先の配置ツール以外のファイルは削除前後のSHA256が一致した。
- 製品コード・manifest・依存・設定/保存仕様と配布payloadは変更していない。開発用配置ツールの整理として製品版更新・再ビルド・再発行なし。製品回帰・GUI・実利用先配置・commit・push・Releaseは実施していない。共通の削除一覧・ハッシュ・検証結果は../AppDock.at365/.artifacts/deploy-removal-20261103/を参照する。過去の検証記録は履歴として保持する。

## 2026-11-02 Applet共通実行場所のコミット前照合

- 利用者の受け入れとコミット依頼を受け、今回のテスト基盤/開発文書2ファイルをコミット対象として再確認した。文書だけの変更として、ローカル参照・UTF-8・差分を確認した。製品回帰の追加実行は対象外。
- 実装入力1,249件・配布物706ファイル・成功ログと保存対象6,347ファイルのハッシュが一致し、不要コピー55組の整理結果も維持されている。入力や対象機能の変更がないため成功結果を再利用する。版更新・publish・pushは追加しない。
- 証跡は本repoの`.artifacts/commit-validation-applet-shared-runtime-20261102/` の `validation.json`、`stage.json`、`commit.json`。共同の照合結果はAppDock側の同フォルダーの `reuse.json` を参照する。

## 2026-11-02 テスト実行場所の共通化

- AppDock本体の共通EXEを利用し、既存の`--test-profile`等で本repoの設定・data・必要なextensionsと結果・ログを分離する。共通方式を開発手順へ接続した。
- 発行済みmanifestを無効のまま隔離profileへ読み込み、同じ固定EXEとprofile内のChromium状態を実機確認。独自の毎回の本体コピー処理がないものは固定build出力・既存のfixture方式を維持した。
- 不要と確認した旧成功コピー0組を整理した。ログ・設定・data・manifest・必要なfixtureは保持し、失敗・状態不明・保全用・固定build出力は削除しない。共通ヘルパーの52件、本体MCP7項目、8種類の分離・再起動保持、ランチャー2方式、ネイティブ2種類の検証結果と整理監査はAppDockの`.artifacts/applet-runtime-20261102/`を参照する。
- レビューではprofile境界・排他・配布物全体のSHA256・再起動・fixture保持・削除範囲を確認。テスト基盤と開発文書のみの変更で、製品の版更新・publishは対象外。コミット・pushは今回行わない。

## 2026-10-29: 情報metadataのコミット前照合

- icon/taglineと版の変更、配置manifest/entry、更新ZIP/feedを先行発行時の入力とSHA256へ照合し一致。本体0.101.9の固定EXEでも既存8Appletの情報表示を確認した。実装入力は不変で、先行の発行・表示試験を再利用し、追加の版更新・再発行は行わない。
- 共通レビューと再利用判断は`../AppDock.at365/.artifacts/commit-validation-applet-information-20261029/{review,reuse,validation}.json`、stage/commitとGitHub origin/mainの照合結果は同じ場所の`stage.json`・`commits.json`・`push.json`を参照する。先行の検証資料は保持。実サービス・実利用のApplet起動・GitHub Release・実利用deployは今回の検証対象外。

対象の現行版は`0.4.2`。以下は記録した条件での検証結果であり、外部サービスや実機条件の現在の動作保証とは区別する。

## 2026-10-29: Applet情報のアイコンとキャッチコピー 0.4.2

- main/追跡先とcleanを確認し、通常環境のpull --ff-only後に、manifestの任意表示情報 `icon: globe` と `tagline: いつものサイトを、すぐそばに。` を設定。設定・コマンド・保存・権限・最低本体版は変更せず、0.4.1→0.4.2のパッチ更新として関連する版の正本を揃えた。発行前にmetadataと版の差分をレビューし、阻害事項なし。
- 標準publish.batで40.ARTIFACTへ発行。配置manifest/ZIP内manifest/feedのID・版・icon/tagline、ZIPのサイズ/SHA256を照合し成功。native/.NETはProductVersionも一致。本体0.101.6の固定EXEへ発行物をコピーし、停止状態で情報パネルの表示を確認した。通常のApplet起動や外部サービス・実入力は実行していない。
- 共通の入力・完全ログ・配布照合は`../AppDock.at365/.artifacts/applet-branding-20261029/`、本体の`VERIFICATION.md`、本repoの`.artifacts/applet-branding-20261029/validation.json`を参照。機能別の標準全回帰は今回実行せず、表示情報と配布の影響に必要な範囲を検証した。既存の再利用資料を保持し、今回の整理による削除なし。コミット/プッシュ/Release/実利用deployは行っていない。

## 2026-10-24: 管理を本体設定へ集約しmainへ移植 0.4.1

- cleanなmain`ef4ecf7`をff-only取得して更新なし。元のcodex/fluid-ui `fb48e89`から、管理ページ・管理コマンド・settingActions/managementCommand・ローカルHTML/JS/CSSと一覧bundleを除去する機能差分だけを選択した。Fluidへの接続をmainへ取り込まず、Nodeコード・manifest・本AppletのMIT Licenseだけを配布する。元のcodex/fluid-ui refは保持する。
- 登録サイト・初期ショートカットは本体の宣言型一覧で編集し、アカウントはWebアカウント設定で管理する。既存discoverをlist.draftActionから呼び、値とPNG/JPEG imageBytesを一時入力へ返す。手動入力・選択済み画像・旧iconを保ち、取消では設定/画像を保存せず、OKで登録する。設定・data・サイトID・名簿・Cookieの保存先や値を移行・削除しない。
- 本体mainへ同時移植した基盤に合わせ、minimumHostVersionは0.86.5。既に試行側で発行した0.4.0から通常の追加修正として0.4.1へ進めた。buildは型検査後、既知の旧管理生成物だけを境界/リンク検査付きで除去し、未知ファイルを保持する。発行前レビューの未解決指摘なし。
- 通常ユーザーの固定Node/pnpmでbuild・publish終了0、既存単体2/2が成功。本体標準874/874、ソースGUI17群と固定EXEの設定一覧5/推奨取得8/画像9群、smokeが成功した。画像ライブラリの旧URLを待っていた試験だけを現在の本体内表示へ接続し、同じ配布物で再実行成功。新規の見た目比較assertはない。実サービスや実入力の検証ではなく、隔離profile/loopbackを使う。
- update.json/ZIP/runtime manifestは0.4.1・最低本体0.86.5で一致。`A:\40.ARTIFACT\Applet.WebApplet.at365\update.zip`は5,427 bytes / SHA256 `e68b02a0024dd60e562141ca3c1c8941266b4fa4a8525288635a3830b68416d6`。ZIPとruntime4ファイル・MIT License一致、旧web/lists資産・Fluidの複製が含まれないことを確認。本体EXE0.86.5はSHA256 `c5ff249d053754066906497cec33e95922e5de3d6310ee065c57297c0bf18ffc`。
- 正本の証跡は本体`AppDock.at365/.artifacts/web-settings-port/`のbaseline/web-baseline/extraction/review、build/unit/source-gui/publish/fixed/fixed-remainingの各JSON・入力hash・log、package/verification.json、final-validation.json、cleanup-audit.json、commit-validation.jsonと本体VERIFICATION。開始時のGitHub main ef4ecf7/AQUA main 28476bcは祖先関係がある既存の差で、remoteへの操作はない。両mainへローカルコミットし、push・Release・実利用先deployは行わない。

## 2026-10-22: 共通画像UIの型更新に対応（0.3.1）

- AppDock0.82.0の全体ZIP作成時にImageLibraryApiのgalleryImage/galleryView/saveGalleryWidth不足でTS2739となった。本体へ委譲する画像選択を保ち、このAppletで提供しないローカルgallery操作は明示的に拒否するアダプターを追加。新たなホスト操作・権限・保存・移行は追加せず、最低本体版0.69.0を維持した。
- clean mainでpull --ff-onlyはAlready up to date。発行前レビューで本体pickの経路と未公開操作を拒否する境界を確認し、未解決の指摘なし。通常互換修正として0.3.0→0.3.1へパッチ更新。型検査/build・標準2/2・publish成功。
- 発行した0.3.1と固定AppDock0.82.0で共通画像GUI9群が成功し、WebAppletの画像選択中の既存View退避/復帰、同じView/入力の保持、画像参照保存と旧icon保持を確認。Profile、Node/.NET画像、3native Applet、明暗/狭幅と再起動も含む。旧GUIの独立image-library.html待機は本体統合後に不適合だったため、画面選択だけを現在の本体documentとimage-libraryモデル待機へ適応したdriverを使用し、全行動assertを保持した。
- 完全ログ・ソース入力の前後SHA256・発行物hash・旧GUI失敗・適応内容は本体`.artifacts/release-0.82.0-20261022/web-repair-{unit,publish,gui-current}.json/.log`、`image-library-gui-adaptation.json`、`.artifacts/image-library-ui-1792633258483/result.json`へ記録。update.zipは89,432 bytes / SHA256 `e60fd67c2c79a57465a761763003432a8a67be391b05b3403e437aa3b5ef8295`。リリース準備での再梱包後は新しいbundleと再照合する。実サービスログイン・実利用先deployは行わない。

## 2026-10-20: コミット前確認（0.3.0）

- 実装時と現在の製品・標準試験・共通部品/依存入力、成功ログと発行ZIP/feedをSHA256で照合し一致。標準2/2・型検査/buildと固定EXEの共通画像GUI8群を再利用した。本体の不足回帰538件とSDK影響先3Appletも成功し、本体標準は再利用込み692/692。
- 製品追加修正・再発行なし。今回の追記は検証記録のみ。[コミット検証](../AppDock.at365/.artifacts/commit-validation-profile-image-library-20261020/validation.json)と同フォルダーのstage/commit照合を参照。push・Release・実利用deployは対象外。
