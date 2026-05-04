"use client";

import { questions } from "../data";

type Props = {
  answers: Record<string, number[]>;
  currentIndex: number;
  onJump: (index: number) => void;
};

function isAutoSkipped(
  qIndex: number,
  answers: Record<string, number[]>
): boolean {
  const q = questions[qIndex];
  if (
    q.id === "current_pc_age" &&
    answers["current_frustrations"]?.includes(5)
  )
    return true;
  if (
    q.id === "experience" &&
    (answers["current_pc_age"]?.includes(4) ||
      answers["current_frustrations"]?.includes(5))
  )
    return true;
  return false;
}

export default function AnswerChips({ answers, currentIndex, onJump }: Props) {
  const chips: { qIndex: number; label: string }[] = [];

  for (let i = 0; i < currentIndex; i++) {
    if (isAutoSkipped(i, answers)) continue;
    const q = questions[i];
    const selected = answers[q.id] ?? [];
    for (const idx of selected) {
      const opt = q.options[idx];
      if (opt) {
        chips.push({ qIndex: i, label: opt.label });
      }
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={() => onJump(chip.qIndex)}
          className="text-xs px-3 py-1.5 rounded-full bg-foreground/8 text-foreground/80 hover:bg-foreground/12 transition-colors cursor-pointer"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
