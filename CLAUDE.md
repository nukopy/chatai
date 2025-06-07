# CLAUDE.md

全て日本語で書いてください。

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

個人向けメンタリングツールとして、AI メンターとの対話を通じて利用者のメンタルケアと成長をサポートするチャットアプリケーションです。

### Purpose

- **Vision**: パーソナライズされたメンタリングサービスの提供
- **Mission**: AI 技術を活用した対話型メンタリング体験の実現
- **Value**: 24 時間対応、個人最適化、プライバシー配慮

## 技術スタック

### Frontend

- **Language**: TypeScript
- **Framework**: React Router v7
- **CSS**: Tailwind CSS + daisyUI
- **State Management**: React Router v7 built-in (loader/action)
- **UI Reference**: [daisyUI llms.txt](./docs/daisyUI.llms.txt) - UIコンポーネント実装時の参考

### Backend

- **Framework**: React Router v7 (Full-stack)
- **Runtime**: Cloudflare Workers (local development first)

### AI Integration

- **Provider**: Cloudflare Workers AI
- **Model**: Claude 3.5 Sonnet (Workers AI)
- **SDK**: Workers AI REST API
- **Documentation**: [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)

## アーキテクチャ

```
┌─────────────────┐
│   Browser       │
│ (React Router)  │
└────────┬────────┘
         │
┌────────┴────────┐
│ React Router v7 │
│  (TypeScript)   │
└────────┬────────┘
         │
┌────────┴────────┐
│ Cloudflare      │
│  Workers AI     │
└─────────────────┘
```

## 機能要件（MVP 版）

### 1. 基本的なチャット機能

- [x] メッセージの送信
- [x] メッセージの受信
- [x] メッセージの表示（チャット履歴）
- [x] リアルタイム表示更新

### 2. ユーザーインターフェース

- [x] メッセージ入力フィールド
- [x] 送信ボタン
- [x] チャット表示エリア
- [x] レスポンシブデザイン対応（Tailwind CSS）
- [x] 美しい UI コンポーネント（daisyUI）

### 3. メンター機能

- **メンターの人格設定**:
  - [ ] 名前の設定
  - [ ] 性格・話し方の設定
  - [ ] 専門分野の設定
- **メンタルに寄り添う会話機能**:
  - [ ] 共感的な応答
  - [ ] 励ましとサポート
  - [ ] 建設的なアドバイス

### 4. AI 統合機能

- [ ] Cloudflare Workers AI 経由での Claude 3.5 Sonnet 連携
- [ ] Workers AI REST API の利用（ストリーミング対応）
- [ ] プロンプトエンジニアリング
- [ ] ストリーミングレスポンス処理
- [ ] エラーハンドリング

## 将来の拡張機能

### Phase 2: データ管理

- [ ] 会話履歴の永続化
- [ ] 会話のエクスポート
- [ ] セッション管理

### Phase 3: 高度な機能

- [ ] ユーザー認証
- [ ] 複数のメンター管理
- [ ] 会話の分析・インサイト
- [ ] マークダウン対応

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm run dev

# プロダクション用ビルド
pnpm run build

# プロダクション版の実行
pnpm start

# 型チェック
pnpm run typecheck

# リンティング
pnpm run lint
```

## プロジェクト構成

```
/
├── app/              # React Router v7 アプリケーションファイル
│   ├── routes/       # ルートコンポーネント
│   ├── components/   # 再利用可能なコンポーネント
│   ├── lib/          # ユーティリティとヘルパー
│   └── root.tsx      # ルートコンポーネント
├── public/           # 静的アセット
└── react-router.config.ts   # React Router v7 設定
```

## 開発ガイドライン

1. 新しいファイルはすべて TypeScript を使用
2. ルーティングとデータ読み込みは React Router v7 の規約に従う
3. Tailwind CSS ユーティリティクラスと daisyUI コンポーネントを使用
4. AI とのやり取りでエラーを適切に処理
5. コンポーネントは焦点を絞り、再利用可能に保つ

## デプロイメント

### CI/CD パイプライン

- **GitHub Actions**: 自動デプロイメントワークフロー
- **Trigger**: main ブランチへの push
- **Platform**: Cloudflare Workers
- **Required Secrets**:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

### デプロイメントコマンド

```bash
# Cloudflare Workers へのデプロイ
pnpm run deploy

# プレビューデプロイ
pnpm run preview
```

## Git 規約

1. **コミット粒度**: 1 コミット = 1 機能/1 タスク
2. **ステージング**: `git add -A`は避け、関連ファイルのみを選択的にステージング
3. **コミット前チェック**: 必ず `pnpm run before-commit` を実行してからコミット
4. **コミットメッセージ**: 変更内容と目的を明確に記載
5. **ブランチ戦略**: 機能ごとにブランチを作成（必要に応じて）
6. **CLAUDE.md 更新**: .claude 配下のコード変更時は必ず CLAUDE.md も同時に更新・コミット

# 重要な指示リマインダー

求められたことを実行する。それ以上でも以下でもない。
目標達成に絶対に必要でない限り、ファイルを作成してはならない。
新しいファイルを作成するよりも、既存のファイルを編集することを常に優先する。
ドキュメントファイル（\*.md）や README ファイルを積極的に作成してはならない。ユーザーが明示的に要求した場合のみドキュメントファイルを作成する。
.claude ディレクトリのコードを変更する場合は、関連する CLAUDE.md の更新と合わせて、必ず同じコミットでそれらの変更をコミットする。
