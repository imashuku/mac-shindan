"use client";

import { questions } from "../data";

type Props = {
  currentIndex: number;
  onJump: (index: number) => void;
  answeredUpTo: number;
  skippedIndices?: Set<number>;
};

export default function ProgressBar({ currentIndex, onJump, answeredUpTo, skippedIndices }: Props) {
  return (
    <div className="flex items-center gap-1.5 w-full max-w-md mx-auto mb-2 py-3">
      {questions.map((_, i) => {
        if (skippedIndices?.has(i)) return null;
        const isCompleted = i < answeredUpTo;
        const isCurrent = i === currentIndex;
        const isClickable = i <= answeredUpTo;
        return (
          <button
            key={i}
            onClick={() => isClickable && onJump(i)}
            disabled={!isClickable}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              isCurrent
                ? "bg-foreground"
                : isCompleted
                  ? "bg-foreground/30 hover:bg-foreground/50 cursor-pointer"
                  : "bg-foreground/10"
            } ${isClickable && !isCurrent ? "cursor-pointer" : ""}`}
            aria-label={`質問${i + 1}${isCurrent ? "（現在）" : ""}`}
          />
        );
      })}
    </div>
  );
}
