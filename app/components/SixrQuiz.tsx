"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import SixrHeader from "./SixrHeader";
import Player from "./Player";
import QuizBall from "./QuizBall";
import Scoreboard from "./Scoreboard";
import TimerBar from "./TimerBar";

// 🔁 Fisher-Yates shuffle for truly unique random selection
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

type Question = {
  id: number;
  question: string;
  choices: string[];
  answerIndex: number;
};

type SixrQuizProps = {
  questions: Question[];
};

export default function SixrQuiz({ questions }: SixrQuizProps) {
  const TOTAL = 20;
  const QUESTION_TIME = 20;

  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<null | "correct" | "wrong">(
    null
  );
  const [isBatting, setIsBatting] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 🧠 Pick 20 unique random questions per quiz seed
  const selected = useMemo(
    () => pickRandom(questions, TOTAL),
    [questions, seed]
  );

  useEffect(() => {
    if (!showScoreboard) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(null, true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [index, seed]);

  function handleAnswer(choiceIndex: number | null, timedOut = false) {
    clearInterval(timerRef.current!);
    const current = selected[index];
    const correct = !timedOut && current.answerIndex === choiceIndex;
    setIsBatting(true);
    setShowFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => nextQuestion(), 1300);
  }

  function nextQuestion() {
    setIsBatting(false);
    setShowFeedback(null);
    if (index + 1 >= selected.length) {
      setShowScoreboard(true);
    } else {
      setIndex((i) => i + 1);
      setTimeLeft(QUESTION_TIME);
    }
  }

  function startNewQuiz() {
    setSeed((s) => s + 1); // resets randomization
    setIndex(0);
    setScore(0);
    setShowFeedback(null);
    setShowScoreboard(false);
    setIsBatting(false);
    setTimeLeft(QUESTION_TIME);
  }

  const currentQ = selected[index] ?? null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <SixrHeader />
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full max-w-5xl bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 overflow-hidden">
        <div className="col-span-1 flex flex-col items-center gap-4">
          <Player isBatting={isBatting} />
          <TimerBar timeLeft={timeLeft} total={QUESTION_TIME} />
          <div className="text-3xl font-bold text-blue-600 mt-4">
            Score: {score}
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          {!showScoreboard ? (
            <QuizBall
              question={currentQ?.question ?? ""}
              choices={currentQ?.choices ?? []}
              showFeedback={showFeedback}
              isBatting={isBatting}
              onSelect={(i) => handleAnswer(i)}
            />
          ) : (
            <Scoreboard
              score={score}
              total={selected.length}
              onRetake={startNewQuiz}
            />
          )}
        </div>
      </main>
    </div>
  );
}
