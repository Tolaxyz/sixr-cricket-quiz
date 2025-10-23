"use client";
import { motion } from "framer-motion";

type ScoreboardProps = {
  score: number;
  total: number;
  onRetake: () => void;
};

export default function Scoreboard({
  score,
  total,
  onRetake,
}: ScoreboardProps) {
  const accuracy = total ? Math.round((score / total) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-xl p-6 bg-blue-50 border border-blue-100 shadow-inner flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-6">
        <div className="text-sm text-slate-600">Your Score</div>
        <div className="text-4xl font-bold text-blue-600">
          {score} / {total}
        </div>
        <div className="text-sm text-slate-500">Accuracy: {accuracy}%</div>
      </div>
      <motion.button
        whileHover={{ y: -4 }}
        onClick={onRetake}
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
        className="px-6 py-3 rounded-full bg-white border border-blue-200 shadow-lg text-blue-600 font-bold text-lg"
      >
        Retake Quiz
      </motion.button>
    </motion.div>
  );
}
