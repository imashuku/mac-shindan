import Shindan from "./components/Shindan";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Shindan />
      <footer className="text-center py-6 px-4 text-xs text-muted/50 leading-relaxed">
        Apple、Mac、MacBookは、Apple Inc.の商標です。
        本サイトはApple Inc.と関係のない非公式の診断ツールです。
      </footer>
    </div>
  );
}
