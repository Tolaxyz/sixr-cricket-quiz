"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SixrHeader from "./SixrHeader";
import Player from "./Player";
import QuizBall from "./QuizBall";
import Scoreboard from "./Scoreboard";
import TimerBar from "./TimerBar";

/** Fisher–Yates shuffle for reliable randomness */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  const TOTAL = 50; // number of questions per round
  const QUESTION_TIME = 20;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<null | "correct" | "wrong">(
    null
  );
  const [isBatting, setIsBatting] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef<number | null>(null);

  const [selectedBatch, setSelectedBatch] = useState<Question[]>([]);
  const deckRef = useRef<{ deck: number[]; pointer: number }>({
    deck: [],
    pointer: 0,
  });

  /** Initialize question deck once on mount */
  useEffect(() => {
    const totalCount = questions.length;
    const shuffledIndices = shuffle(
      Array.from({ length: totalCount }, (_, i) => i)
    );
    deckRef.current = { deck: shuffledIndices, pointer: 0 };
    createNextBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Create the next 50-question batch */
  function createNextBatch() {
    const totalCount = questions.length;
    let { deck, pointer } = deckRef.current;

    // Reshuffle if deck is running low
    if (pointer + TOTAL > deck.length) {
      deck = shuffle(Array.from({ length: totalCount }, (_, i) => i));
      pointer = 0;
    }

    const slice = deck.slice(pointer, pointer + TOTAL);
    deckRef.current = { deck, pointer: pointer + TOTAL };

    const batch = slice.map((idx) => questions[idx]);
    setSelectedBatch(batch);

    // Reset UI states
    setIndex(0);
    setScore(0);
    setShowFeedback(null);
    setShowScoreboard(false);
    setIsBatting(false);
    setTimeLeft(QUESTION_TIME);
  }

  /** Manage timer for each question */
  useEffect(() => {
    if (showScoreboard) return;

    clearInterval(timerRef.current!);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, selectedBatch, showScoreboard]);

  function handleAnswer(choiceIndex: number | null, timedOut = false) {
    if (showFeedback) return;
    clearInterval(timerRef.current!);

    const current = selectedBatch[index];
    if (!current) return;

    const correct = !timedOut && current.answerIndex === choiceIndex;
    setIsBatting(true);
    setShowFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);

    setTimeout(() => nextQuestion(), 1000);
  }

  function nextQuestion() {
    setIsBatting(false);
    setShowFeedback(null);
    if (index + 1 >= selectedBatch.length) {
      setShowScoreboard(true);
      clearInterval(timerRef.current!);
    } else {
      setIndex((i) => i + 1);
      setTimeLeft(QUESTION_TIME);
    }
  }

  const currentQ = selectedBatch[index] ?? null;

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
              total={selectedBatch.length}
              onRetake={createNextBatch}
            />
          )}
        </div>
      </main>
    </div>
  );
}
