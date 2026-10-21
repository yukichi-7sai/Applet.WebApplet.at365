# Applet.WebAppletの作業ルール

[共通作業ルール](../AGENTS.md)、[AppDockの技術情報](../AppDock.at365/AGENTS.md)、[Applet実装ガイド](../AppDock.at365/docs/applet-development.md)を確認する。

このAppletはTypeScript/NodeとローカルHTMLで実装する。.NETやElectronの直接参照を追加せず、ページ・プロフィール・設定・画像処理はホストの公開APIを利用する。リモートサイトへホストAPIを渡さない。

共有仕様は[分離設計](../AppDock.at365/docs/applet-pages.md)を参照し、実測結果はVERIFICATION.mdへ記録する。ホストのプロジェクトローカルツールチェーンでビルドする。変更時の版更新・publishは[共通手順](../AppDock.at365/docs/development-workflow.md)に従う。
