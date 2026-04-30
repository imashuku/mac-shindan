"use client";

import {
  MacModel,
  MemorySize,
  StorageSize,
  macSpecs,
  memoryLabels,
  storageLabels,
  questions,
  ReasonEntry,
} from "../data";

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
          className="inline-block min-h-[44px] px-8 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 active:bg-foreground/80 transition-colors duration-200"
        >
          Apple Storeで見る
        </a>
      </div>

      {/* Restart */}
      <div className="text-center animate-fade-in-up stagger-6 pb-4">
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
