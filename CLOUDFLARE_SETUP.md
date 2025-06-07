# Cloudflare Workers デプロイメント設定

## 必要なシークレット

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください。

### 1. CLOUDFLARE_API_TOKEN
- **説明**: Cloudflare Workers へのデプロイに必要な API トークン
- **取得方法**:
  1. [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) にアクセス
  2. 「Create Token」をクリック
  3. 「Cloudflare Workers:Edit」テンプレートを選択
  4. 必要なアカウントとゾーンを選択
  5. 生成されたトークンをコピー

### 2. CLOUDFLARE_ACCOUNT_ID
- **説明**: Cloudflare アカウント ID
- **取得方法**:
  1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にアクセス
  2. 右サイドバーの「Account ID」をコピー

## デプロイメントフロー

### 本番デプロイ
- **トリガー**: `main` ブランチへの push
- **環境**: `production`
- **Worker名**: `chatai`
- **URL**: `https://chatai.<account-id>.workers.dev`

### プレビューデプロイ  
- **トリガー**: Pull Request の作成・更新
- **環境**: `preview`
- **Worker名**: `chatai-preview`
- **URL**: `https://chatai-preview.<account-id>.workers.dev`

## ローカル開発

```bash
# 依存関係のインストール
npm install

# ローカル開発サーバー起動（Cloudflare Workers 環境）
npm start

# 従来の開発サーバー（Node.js環境）
npm run dev

# ビルド
npm run build

# 手動デプロイ
npm run deploy          # 本番環境
npm run deploy:preview  # プレビュー環境
```

## カスタムドメイン設定（オプション）

カスタムドメインを使用する場合は、`wrangler.toml` の以下の部分をコメントアウトして設定してください：

```toml
[env.production]
name = "chatai"
routes = [
  { pattern = "your-domain.com", custom_domain = true }
]
```

## トラブルシューティング

### ビルドエラー
- Node.js バージョンが 20 以上であることを確認
- `npm ci` で依存関係をクリーンインストール

### デプロイエラー
- Cloudflare API トークンとアカウント ID が正しく設定されているか確認
- wrangler.toml の設定内容を確認

### プレビュー URL が表示されない
- GitHub Actions の実行権限を確認
- シークレットが正しく設定されているか確認