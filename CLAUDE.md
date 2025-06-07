# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

個人向けメンタリングツールとして、AIメンターとの対話を通じて利用者のメンタルケアと成長をサポートするチャットアプリケーションです。

### Purpose
- **Vision**: パーソナライズされたメンタリングサービスの提供
- **Mission**: AI技術を活用した対話型メンタリング体験の実現
- **Value**: 24時間対応、個人最適化、プライバシー配慮

## Technology Stack

### Frontend
- **Language**: TypeScript
- **Framework**: Remix
- **CSS**: Tailwind CSS + daisyUI
- **State Management**: Remix built-in (loader/action)

### Backend
- **Framework**: Remix (Full-stack)
- **Runtime**: Cloudflare Workers (local development first)

### AI Integration
- **Provider**: Amazon Bedrock
- **Model**: Claude 3.5 Sonnet
- **SDK**: Anthropic SDK

## Architecture

```
┌─────────────────┐
│   Browser       │
│  (Remix SPA)    │
└────────┬────────┘
         │
┌────────┴────────┐
│  Remix Server   │
│  (TypeScript)   │
└────────┬────────┘
         │
┌────────┴────────┐
│ Amazon Bedrock  │
│  (Claude API)   │
└─────────────────┘
```

## 機能要件（MVP版）

### 1. 基本的なチャット機能 ✅
- メッセージの送信
- メッセージの受信
- メッセージの表示（チャット履歴）
- リアルタイム表示更新

### 2. ユーザーインターフェース ✅
- メッセージ入力フィールド
- 送信ボタン
- チャット表示エリア
- レスポンシブデザイン対応（Tailwind CSS）
- 美しいUIコンポーネント（daisyUI）

### 3. メンター機能 ✅
- **メンターの人格設定**:
  - 名前の設定
  - 性格・話し方の設定
  - 専門分野の設定
- **メンタルに寄り添う会話機能**:
  - 共感的な応答
  - 励ましとサポート
  - 建設的なアドバイス

### 4. AI統合機能 ✅
- Amazon Bedrock経由でのClaude 3.5 Sonnet連携
- Anthropic SDKの利用
- プロンプトエンジニアリング
- レスポンス処理
- エラーハンドリング

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

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Project Structure

```
/
├── app/              # Remix application files
│   ├── routes/       # Route components
│   ├── components/   # Reusable components
│   ├── lib/          # Utilities and helpers
│   └── root.tsx      # Root component
├── public/           # Static assets
└── remix.config.js   # Remix configuration
```

## Development Guidelines

1. Use TypeScript for all new files
2. Follow Remix conventions for routing and data loading
3. Use Tailwind CSS utility classes with daisyUI components
4. Handle errors gracefully in AI interactions
5. Keep components focused and reusable

## Git Conventions

1. **コミット粒度**: 1コミット = 1機能/1タスク
2. **ステージング**: `git add -A`は避け、関連ファイルのみを選択的にステージング
3. **コミットメッセージ**: 変更内容と目的を明確に記載
4. **ブランチ戦略**: 機能ごとにブランチを作成（必要に応じて）
