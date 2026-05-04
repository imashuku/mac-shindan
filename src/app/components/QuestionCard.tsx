"use client";

import { Question } from "../data";

type Props = {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedIndices: number[];
  onSelectSA: (optionIndex: number) => void;
  onToggleMA: (optionIndex: number) => void;
  onConfirmMA: () => void;
  onBack: () => void;
  animDirection: "right" | "left";
  disabled?: boolean;
};

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedIndices,
  onSelectSA,
  onToggleMA,
  onConfirmMA,
  onBack,
  animDirection,
  disabled = false,
}: Props) {
  const animClass =
    animDirection === "right" ? "animate-slide-in-right" : "animate-slide-in-left";

  return (
    <div key={question.id} className={`w-full ${animClass}`}>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          disabled={currentIndex === 0}
          aria-hidden={currentIndex === 0}
          tabIndex={currentIndex === 0 ? -1 : 0}
          className={`min-h-[44px] min-w-[44px] flex items-center text-sm font-medium transition-colors duration-200 cursor-pointer rounded-lg ${
            currentIndex === 0
              ? "invisible"
              : "text-muted hover:text-foreground"
          }`}
        >
          ← 戻る
        </button>
        <span className="text-sm text-muted">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
        {question.question}
      </h2>
      {question.sub && (
        <p className="text-sm text-muted mt-2">{question.sub}</p>
      )}

      <div className="mt-8 space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedIndices.includes(index);
          return (
            <button
              key={index}
              onClick={() =>
                question.type === "sa" ? onSelectSA(index) : onToggleMA(index)
              }
              disabled={disabled}
              className={`stagger-${index + 1} animate-fade-in-up w-full text-left min-h-[52px] p-4 sm:p-5 rounded-xl transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? "border-foreground bg-foreground/[0.03] shadow-sm"
                  : "border-border bg-card hover:border-foreground/30 hover:shadow-sm"
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3">
                {question.type === "ma" && (
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? "bg-foreground border-foreground"
                        : "border-border"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 12 10"
                        fill="none"
                        className="text-background"
                      >
                        <path
                          d="M1 5L4.5 8.5L11 1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">
                    {option.label}
                  </div>
                  <div className="text-sm text-muted mt-0.5 leading-relaxed">
                    {option.sub}
                  </div>
                </div>
                {question.type === "sa" && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-muted/50 shrink-0"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {question.type === "ma" && (
        <div className="mt-6 animate-fade-in-up stagger-6">
          <button
            onClick={onConfirmMA}
            disabled={selectedIndices.length === 0 || disabled}
            className={`w-full min-h-[48px] py-3.5 rounded-xl font-medium text-base transition-all duration-200 cursor-pointer ${
              selectedIndices.length > 0 && !disabled
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
            }`}
          >
            次へ進む
            {selectedIndices.length > 0 && (
              <span className="ml-2 text-sm opacity-60">
                ({selectedIndices.length}件選択)
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
