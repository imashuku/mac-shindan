"use client";

import { useState, useCallback } from "react";
import { questions, computeResult } from "../data";
import ProgressBar from "./ProgressBar";
import AnswerChips from "./AnswerChips";
import QuestionCard from "./QuestionCard";
import ResultCard from "./ResultCard";

type Phase = "intro" | "question" | "result";

export default function Shindan() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [maSelections, setMaSelections] = useState<number[]>([]);
  const [animDirection, setAnimDirection] = useState<"right" | "left">("right");
  const [animKey, setAnimKey] = useState(0);

  const answeredUpTo = questions.reduce((max, q, i) => {
    return answers[q.id] !== undefined ? Math.max(max, i + 1) : max;
  }, 0);

  const handleStart = useCallback(() => {
    setPhase("question");
    setCurrentQ(0);
    setAnswers({});
    setMaSelections([]);
    setAnimDirection("right");
    setAnimKey((k) => k + 1);
  }, []);

  const goToQuestion = useCallback(
    (index: number) => {
      setAnimDirection(index > currentQ ? "right" : "left");
      setCurrentQ(index);
      const q = questions[index];
      if (q.type === "ma") {
        setMaSelections(answers[q.id] ?? []);
      }
      setAnimKey((k) => k + 1);
      if (phase === "result") {
        setPhase("question");
      }
    },
    [currentQ, answers, phase]
  );

  const advance = useCallback(
    (newAnswers: Record<string, number[]>) => {
      if (currentQ + 1 < questions.length) {
        setAnimDirection("right");
        setCurrentQ(currentQ + 1);
        const nextQ = questions[currentQ + 1];
        if (nextQ.type === "ma") {
          setMaSelections(newAnswers[nextQ.id] ?? []);
        }
        setAnimKey((k) => k + 1);
      } else {
        setPhase("result");
      }
    },
    [currentQ]
  );

  const handleSelectSA = useCallback(
    (optionIndex: number) => {
      const q = questions[currentQ];
      const newAnswers = { ...answers, [q.id]: [optionIndex] };
      setAnswers(newAnswers);
      setTimeout(() => advance(newAnswers), 250);
    },
    [currentQ, answers, advance]
  );

  const handleToggleMA = useCallback(
    (optionIndex: number) => {
      setMaSelections((prev) =>
        prev.includes(optionIndex)
          ? prev.filter((i) => i !== optionIndex)
          : [...prev, optionIndex]
      );
    },
    []
  );

  const handleConfirmMA = useCallback(() => {
    if (maSelections.length === 0) return;
    const q = questions[currentQ];
    const newAnswers = { ...answers, [q.id]: [...maSelections] };
    setAnswers(newAnswers);
    advance(newAnswers);
  }, [currentQ, answers, maSelections, advance]);

  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      goToQuestion(currentQ - 1);
    }
  }, [currentQ, goToQuestion]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({});
    setMaSelections([]);
  }, []);

  const result = phase === "result" ? computeResult(answers) : null;

  return (
    <div className="flex-1 flex flex-col">
      {phase === "intro" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 animate-fade-in-up">
          <div className="max-w-md text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight">
              あなたに合うMacは
              <br />
              どれだろう？
            </h1>
            <p className="text-muted mt-4 leading-relaxed">
              いくつかの質問に答えるだけで、モデル・メモリ・
              <br className="hidden sm:block" />
              ストレージまで、最適な構成がわかります。
            </p>
            <button
              onClick={handleStart}
              className="mt-10 min-h-[48px] px-10 py-3.5 bg-foreground text-background rounded-full text-base font-medium hover:bg-foreground/90 active:bg-foreground/80 transition-colors duration-200 cursor-pointer"
            >
              はじめる
            </button>
            <p className="text-xs text-muted/60 mt-6">
              2026年4月時点のラインナップに基づきます
            </p>
          </div>
        </div>
      )}

      {phase === "question" && (
        <div className="flex-1 flex flex-col px-5 py-8 sm:py-12 max-w-xl mx-auto w-full">
          <ProgressBar
            currentIndex={currentQ}
            onJump={goToQuestion}
            answeredUpTo={answeredUpTo}
          />
          <AnswerChips
            answers={answers}
            currentIndex={currentQ}
            onJump={goToQuestion}
          />
          <div className="flex-1 flex flex-col justify-center" key={animKey}>
            <QuestionCard
              question={questions[currentQ]}
              currentIndex={currentQ}
              totalQuestions={questions.length}
              selectedIndices={
                questions[currentQ].type === "ma"
                  ? maSelections
                  : answers[questions[currentQ].id] ?? []
              }
              onSelectSA={handleSelectSA}
              onToggleMA={handleToggleMA}
              onConfirmMA={handleConfirmMA}
              onBack={handleBack}
              animDirection={animDirection}
            />
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <div className="flex-1 px-5 py-8 sm:py-12">
          <ResultCard
            bestModel={result.bestModel}
            bestMemory={result.bestMemory}
            bestStorage={result.bestStorage}
            runners={result.runners}
            reasons={result.reasons}
            answers={answers}
            onRestart={handleRestart}
            onJumpToQuestion={goToQuestion}
          />
        </div>
      )}
    </div>
  );
}
