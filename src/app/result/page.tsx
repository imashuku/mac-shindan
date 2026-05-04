import { Metadata } from "next";
import {
  memoryLabels,
  storageLabels,
  getSharedConfig,
} from "../data";
import SharedResultClient from "./SharedResultClient";

type Props = {
  searchParams: Promise<{ m?: string; mem?: string; s?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const config = getSharedConfig(params.m, params.mem, params.s);
  const spec = config?.spec ?? null;
  const memLabel = config ? memoryLabels[config.memory] : "";
  const stoLabel = config ? storageLabels[config.storage] : "";

  const title = spec
    ? `${spec.name}（${memLabel} / ${stoLabel}）がおすすめ！ | Mac診断`
    : "あなたにぴったりのMacは？ | Mac診断";

  const description = spec
    ? `Mac診断の結果、${spec.name}（${spec.chip} / ${memLabel} / ${stoLabel}）がおすすめです。あなたも診断してみませんか？`
    : "いくつかの質問に答えるだけで、あなたに最適なMacBookの構成がわかります。";

  const ogUrl = config
    ? `/api/og?m=${config.model}&mem=${config.memory}&s=${config.storage}`
    : "/api/og";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const config = getSharedConfig(params.m, params.mem, params.s);
  const spec = config?.spec ?? null;
  const memLabel = config ? memoryLabels[config.memory] : "";
  const stoLabel = config ? storageLabels[config.storage] : "";

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="max-w-md w-full">
          {spec ? (
            <div className="text-center animate-fade-in-up">
              <p className="text-sm text-muted mb-3">この人の診断結果</p>
              <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
                <div className="p-6 sm:p-8 text-center border-b border-border">
                  <div className="text-sm text-muted mb-1">{spec.chip}</div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    {spec.name}
                  </h1>
                  <p className="text-muted">{spec.screen}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 p-5 bg-foreground/[0.02]">
                  <div className="bg-background rounded-xl p-4 text-center">
                    <div className="text-xs text-muted mb-1">メモリ</div>
                    <div className="text-lg font-bold text-foreground">{memLabel}</div>
                  </div>
                  <div className="bg-background rounded-xl p-4 text-center">
                    <div className="text-xs text-muted mb-1">ストレージ</div>
                    <div className="text-lg font-bold text-foreground">{stoLabel}</div>
                  </div>
                  <div className="bg-background rounded-xl p-4 text-center">
                    <div className="text-xs text-muted mb-1">価格</div>
                    <div className="text-lg font-bold text-foreground">
                      {spec.priceFrom.toLocaleString()}円〜
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center animate-fade-in-up mb-8">
              <h1 className="text-2xl font-bold text-foreground">
                あなたに合うMacはどれだろう？
              </h1>
            </div>
          )}

          <SharedResultClient />
        </div>
      </div>
      <footer className="text-center py-6 px-4 text-xs text-muted/50 leading-relaxed">
        Apple、Mac、MacBookは、Apple Inc.の商標です。
        本サイトはApple Inc.と関係のない非公式の診断ツールです。
      </footer>
    </div>
  );
}
