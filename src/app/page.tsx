import Shindan from "./components/Shindan";
import BrandBar from "./components/BrandBar";

const siteUrl = "https://mac-shindan.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.step-out.jp/#organization",
      name: "ステップアウトマーケティング合同会社",
      url: "https://www.step-out.jp/",
      logo: `${siteUrl}/stepout-logo.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Mac診断",
      url: siteUrl,
      inLanguage: "ja",
      publisher: { "@id": "https://www.step-out.jp/#organization" },
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapplication`,
      name: "Mac診断",
      url: siteUrl,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      inLanguage: "ja",
      isAccessibleForFree: true,
      description:
        "用途に合わせてMacBookのモデル、メモリ、ストレージ構成の目安を確認できる無料診断ツールです。",
      provider: { "@id": "https://www.step-out.jp/#organization" },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BrandBar />
      <Shindan />
      <footer className="text-center py-6 px-4 text-xs text-muted/70 leading-relaxed">
        Apple、Mac、MacBookは、Apple Inc.の商標です。
        本サイトはApple Inc.と関係のない非公式の診断ツールです。
      </footer>
    </div>
  );
}
