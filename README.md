This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## ラインナップの月次照合

`src/app/data.ts` の `macSpecs` を Apple公式（日本）の購入ページ・仕様ページと突き合わせる。

```bash
npm run lineup:check   # 差分レポートを表示（何も書き換えない）
npm run lineup:apply   # 価格差分だけを data.ts に反映し、日付表記を更新する
```

- 終了コード: `0` 差分なし ／ `10` 差分または警告あり ／ `2` 取得・解析に失敗
- 自動で書き換えるのは `priceFrom` のみ。メモリ・ストレージ・重さ・バッテリー・チップ・新機種は警告として出すだけで、採点への反映は人が判断する
- 取得できないときは推測で埋めずに `2` で止まる
- 毎月1日 9:00 に今宿さんの Mac のスケジュールタスク `mac-shindan-lineup-check` がこれを回し、価格差分があればPR、警告のみ・取得失敗なら Issue を立てる（Apple公式サイトはクラウド実行環境のIPを 403 で遮断するため、クラウドでは動かない）

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
