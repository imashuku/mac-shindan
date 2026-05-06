"use client";

import { useEffect, useRef } from "react";
import {
  MacModel,
  MemorySize,
  StorageSize,
  macSpecs,
  memoryLabels,
  storageLabels,
  questions,
  ReasonEntry,
  buildComparison,
} from "../data";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

type Props = {
  bestModel: MacModel;
  bestMemory: MemorySize;
  bestStorage: StorageSize;
  runners: MacModel[];
  reasons: ReasonEntry[];
  answers: Record<string, number[]>;
  onRestart: () => void;
  onJumpToQuestion: (index: number) => void;
};

function ConfigTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="bg-background rounded-xl p-4 text-center">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-lg font-bold text-foreground">{value}</div>
      {detail && <div className="text-xs text-muted mt-0.5">{detail}</div>}
    </div>
  );
}

export default function ResultCard({
  bestModel,
  bestMemory,
  bestStorage,
  runners,
  reasons,
  answers,
  onRestart,
  onJumpToQuestion,
}: Props) {
  const spec = macSpecs[bestModel];
  const price = spec.priceFrom.toLocaleString();
  const savedRef = useRef(false);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackEvent(analyticsEvents.resultView, {
      best_model: bestModel,
      best_memory: bestMemory,
      best_storage: bestStorage,
    });
  }, [bestModel, bestMemory, bestStorage]);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        nickname: "",
        answers: JSON.stringify(answers),
        best_model: bestModel,
        best_memory: bestMemory,
        best_storage: bestStorage,
      }),
    })
      .then((response) => {
        trackEvent(analyticsEvents.saved, {
          status: response.ok ? "success" : "error",
          best_model: bestModel,
          best_memory: bestMemory,
          best_storage: bestStorage,
        });
      })
      .catch(() => {
        trackEvent(analyticsEvents.saved, {
          status: "error",
          best_model: bestModel,
          best_memory: bestMemory,
          best_storage: bestStorage,
        });
      });
  }, [answers, bestModel, bestMemory, bestStorage]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-10 animate-fade-in-up">
        <p className="text-sm text-muted mb-3">診断結果</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          あなたにおすすめの構成
        </h2>
      </div>

      {/* Hero recommendation */}
      <div className="animate-fade-in-up stagger-1 bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
        <div className="p-6 sm:p-8 text-center border-b border-border">
          <div className="text-sm text-muted mb-1">{spec.chip}</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            {spec.name}
          </h3>
          <p className="text-muted">{spec.screen}</p>
        </div>

        {/* Configuration tiles */}
        <div className="grid grid-cols-3 gap-3 p-5 bg-foreground/[0.02]">
          <ConfigTile label="メモリ" value={memoryLabels[bestMemory]} />
          <ConfigTile label="ストレージ" value={storageLabels[bestStorage]} />
          <ConfigTile label="価格" value={`${price}円〜`} detail="税込" />
        </div>

        {/* Spec details */}
        <div className="p-5 sm:p-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">重さ</span>
            <span className="text-foreground font-medium">{spec.weight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">バッテリー</span>
            <span className="text-foreground font-medium">{spec.battery}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">ポート</span>
            <span className="text-foreground font-medium text-right max-w-[60%]">
              {spec.ports}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">ファンレス</span>
            <span className="text-foreground font-medium">
              {spec.fanless ? "静音（ファンなし）" : "あり"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">カラー</span>
            <span className="text-foreground font-medium text-right max-w-[60%]">
              {spec.colors}
            </span>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div className="animate-fade-in-up stagger-1 flex gap-3 mb-6">
        <button
          onClick={() => {
            const url = `${location.origin}/result?m=${bestModel}&mem=${bestMemory}&s=${bestStorage}`;
            const text = `Mac診断の結果、${spec.name}（${memoryLabels[bestMemory]} / ${storageLabels[bestStorage]}）がおすすめでした！`;
            trackEvent(analyticsEvents.share, {
              method: "line",
              best_model: bestModel,
              best_memory: bestMemory,
              best_storage: bestStorage,
            });
            window.open(
              `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
              "_blank",
              "width=600,height=500"
            );
          }}
          className="flex-1 min-h-[44px] py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-foreground/5 active:bg-foreground/8 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          LINEで送る
        </button>
        <button
          onClick={() => {
            const url = `${location.origin}/result?m=${bestModel}&mem=${bestMemory}&s=${bestStorage}`;
            const text = `Mac診断の結果、${spec.name}（${memoryLabels[bestMemory]} / ${storageLabels[bestStorage]}）がおすすめでした！`;
            trackEvent(analyticsEvents.share, {
              method: "x",
              best_model: bestModel,
              best_memory: bestMemory,
              best_storage: bestStorage,
            });
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
              "_blank",
              "width=600,height=400"
            );
          }}
          className="flex-1 min-h-[44px] py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-foreground/5 active:bg-foreground/8 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Xでシェア
        </button>
      </div>

      {/* Before/After comparison */}
      {(() => {
        const comparisons = buildComparison(answers, bestModel);
        if (comparisons.length === 0) return null;
        return (
          <div className="animate-fade-in-up stagger-2 bg-card rounded-2xl border border-border overflow-hidden mb-6">
            <div className="p-5 sm:p-6">
              <h4 className="font-bold text-foreground mb-1 text-sm">
                今のお悩み、このMacで解決できます
              </h4>
              <p className="text-xs text-muted mb-4">あなたが選んだ「困っていること」に対して</p>
              <div className="space-y-4">
                {comparisons.map((c, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="shrink-0 mt-0.5 flex flex-col items-center gap-1">
                      <span className="text-red-400 text-xs font-bold" aria-hidden="true">✕</span>
                      <div className="w-px flex-1 bg-border" />
                      <span className="text-green-500 text-xs font-bold" aria-hidden="true">✓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-red-500/70 line-through decoration-red-300">
                        {c.frustration}
                      </div>
                      <div className="text-sm text-foreground font-medium mt-1 leading-relaxed">
                        {c.resolution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Reasoning */}
      <div className="animate-fade-in-up stagger-2 bg-card rounded-2xl border border-border p-5 sm:p-6 mb-6">
        <h4 className="font-bold text-foreground mb-4 text-sm">
          この構成をおすすめする理由
        </h4>
        <div className="space-y-4">
          {reasons.map((r, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1.5 rounded-full bg-foreground/30 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-muted mb-0.5">
                  あなたの回答: {r.answer}
                </div>
                <div className="text-sm text-foreground leading-relaxed">
                  {r.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Runners up */}
      {runners.length > 0 && (
        <div className="animate-fade-in-up stagger-3 mb-6">
          <h4 className="font-bold text-foreground mb-3 text-sm">
            ほかの候補
          </h4>
          <div className="space-y-2">
            {runners.map((id) => {
              const s = macSpecs[id];
              return (
                <div
                  key={id}
                  className="bg-card rounded-xl border border-border p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {s.name}
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      {s.chip} / {s.screen}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {s.priceFrom.toLocaleString()}円〜
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Answer review */}
      <div className="animate-fade-in-up stagger-4 bg-card rounded-2xl border border-border p-5 sm:p-6 mb-8">
        <h4 className="font-bold text-foreground mb-4 text-sm">
          あなたの回答
        </h4>
        <div className="space-y-3">
          {questions.map((q, qIdx) => {
            const selected = answers[q.id] ?? [];
            const labels = selected
              .map((i) => q.options[i]?.label)
              .filter(Boolean);
            if (labels.length === 0) return null;
            return (
              <button
                key={q.id}
                onClick={() => onJumpToQuestion(qIdx)}
                className="w-full min-h-[44px] text-left flex items-start justify-between gap-3 group cursor-pointer rounded-lg p-2 -mx-2 hover:bg-foreground/[0.03] active:bg-foreground/[0.05] transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted">{q.question}</div>
                  <div className="text-sm text-foreground font-medium mt-0.5">
                    {labels.join("、")}
                  </div>
                </div>
                <span className="text-xs text-accent shrink-0 mt-1">
                  変更
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Apple Store CTA */}
      <div className="animate-fade-in-up stagger-5 bg-card rounded-2xl border border-border p-5 sm:p-6 mb-6 text-center">
        <p className="text-sm text-foreground font-medium mb-1">
          メモリやストレージのカスタマイズは
          <br className="sm:hidden" />
          Apple Storeで注文できます
        </p>
        <p className="text-xs text-muted mb-4">
          実店舗ならスタッフに相談しながら購入できます
        </p>
        <a
          href="https://www.apple.com/jp/shop/go/mac"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent(analyticsEvents.ctaClick, {
              cta: "apple_store",
              best_model: bestModel,
              best_memory: bestMemory,
              best_storage: bestStorage,
            });
          }}
          className="inline-block min-h-[44px] px-8 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 active:bg-foreground/80 transition-colors duration-200"
        >
          Apple Storeで見る
        </a>
      </div>

      {/* Consulting CTA */}
      <div className="animate-fade-in-up stagger-5 bg-card rounded-2xl border border-border p-5 sm:p-6 mb-6 text-center">
        <h4 className="font-bold text-foreground mb-1 text-sm">
          仕事環境づくりやAI活用のご相談はこちら
        </h4>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          Mac選びの先にある、初期設定やAIの仕事への
          <br className="sm:hidden" />
          活かし方まで必要な範囲で相談できます
        </p>
        <a
          href="https://www.step-out.jp/contact/consult"
          onClick={() => {
            trackEvent(analyticsEvents.ctaClick, {
              cta: "stepout_consult",
              best_model: bestModel,
              best_memory: bestMemory,
              best_storage: bestStorage,
            });
          }}
          className="inline-block min-h-[44px] px-8 py-3 border border-foreground rounded-full text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors duration-200"
        >
          ステップアウトに相談する
        </a>
      </div>

      {/* Restart */}
      <div className="text-center animate-fade-in-up pb-4">
        <button
          onClick={onRestart}
          className="min-h-[44px] px-8 py-3 border border-border rounded-full text-sm font-medium text-foreground hover:bg-foreground/5 active:bg-foreground/8 transition-colors duration-200 cursor-pointer"
        >
          最初からやり直す
        </button>
      </div>
    </div>
  );
}
