# 検証記録

対象の現行版は`0.4.1`。以下は記録した条件での検証結果であり、外部サービスや実機条件の現在の動作保証とは区別する。

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
