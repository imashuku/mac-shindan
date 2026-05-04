"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
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
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const answeredUpTo = questions.reduce((max, q, i) => {
    return answers[q.id] !== undefined ? Math.max(max, i + 1) : max;
  }, 0);

  const handleStart = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setPhase("question");
    setCurrentQ(0);
    setAnswers({});
    setMaSelections([]);
    setIsAdvancing(false);
    setAnimDirection("right");
    setAnimKey((k) => k + 1);
  }, []);

  const goToQuestion = useCallback(
    (index: number) => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      setIsAdvancing(false);
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

  const shouldSkip = useCallback(
    (qIndex: number, ans: Record<string, number[]>): number[] | null => {
      const q = questions[qIndex];
      if (
        q.id === "current_pc_age" &&
        ans["current_frustrations"]?.includes(5)
      ) {
        return [4];
      }
      if (
        q.id === "experience" &&
        (ans["current_pc_age"]?.includes(4) ||
          ans["current_frustrations"]?.includes(5))
      ) {
        return [0];
      }
      return null;
    },
    []
  );

  const advance = useCallback(
    (newAnswers: Record<string, number[]>) => {
      setIsAdvancing(false);
      advanceTimerRef.current = null;
      let next = currentQ + 1;
      let updated = newAnswers;
      while (next < questions.length) {
        const autoAnswer = shouldSkip(next, updated);
        if (autoAnswer) {
          updated = { ...updated, [questions[next].id]: autoAnswer };
          next++;
        } else {
          break;
        }
      }
      setAnswers(updated);
      if (next < questions.length) {
        setAnimDirection("right");
        setCurrentQ(next);
        const nextQ = questions[next];
        if (nextQ.type === "ma") {
          setMaSelections(updated[nextQ.id] ?? []);
        }
        setAnimKey((k) => k + 1);
      } else {
        setPhase("result");
      }
    },
    [currentQ, shouldSkip]
  );

  const answersThroughCurrent = useCallback(
    (optionIndices: number[]) => {
      const nextAnswers: Record<string, number[]> = {};
      for (let i = 0; i < currentQ; i++) {
        const q = questions[i];
        if (answers[q.id] !== undefined) {
          nextAnswers[q.id] = answers[q.id];
        }
      }
      nextAnswers[questions[currentQ].id] = optionIndices;
      return nextAnswers;
    },
    [answers, currentQ]
  );

  const handleSelectSA = useCallback(
    (optionIndex: number) => {
      if (isAdvancing) return;
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
      setIsAdvancing(true);
      const newAnswers = answersThroughCurrent([optionIndex]);
      setAnswers(newAnswers);
      advanceTimerRef.current = setTimeout(() => advance(newAnswers), 250);
    },
    [advance, answersThroughCurrent, isAdvancing]
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
    const newAnswers = answersThroughCurrent([...maSelections]);
    setAnswers(newAnswers);
    advance(newAnswers);
  }, [answersThroughCurrent, maSelections, advance]);

  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      let prev = currentQ - 1;
      while (prev > 0 && shouldSkip(prev, answers) !== null) {
        prev--;
      }
      goToQuestion(prev);
    }
  }, [currentQ, answers, goToQuestion, shouldSkip]);

  const handleRestart = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({});
    setMaSelections([]);
    setIsAdvancing(false);
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const skippedIndices = useMemo(() => {
    const set = new Set<number>();
    for (let i = 0; i < questions.length; i++) {
      if (shouldSkip(i, answers) !== null) set.add(i);
    }
    return set;
  }, [answers, shouldSkip]);

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
            skippedIndices={skippedIndices}
          />
          <AnswerChips
            answers={answers}
            currentIndex={currentQ}
            onJump={goToQuestion}
          />
          <div className="flex-1 flex flex-col justify-center" key={animKey}>
            <QuestionCard
              question={questions[currentQ]}
              currentIndex={currentQ - [...skippedIndices].filter((i) => i < currentQ).length}
              totalQuestions={questions.length - skippedIndices.size}
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
              disabled={isAdvancing}
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
