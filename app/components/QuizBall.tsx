"use client";
import { motion } from "framer-motion";

type QuizBallProps = {
  question: string;
  choices: string[];
  showFeedback: null | "correct" | "wrong";
  isBatting: boolean;
  onSelect: (index: number) => void;
};

export default function QuizBall({
  question,
  choices,
  showFeedback,
  isBatting,
  onSelect,
}: QuizBallProps) {
  return (
    <div className="relative bg-blue-50 border border-blue-100 rounded-xl p-6 min-h-[220px] flex items-center">
      <div className="absolute left-6 top-6">
        <motion.div
          initial={{ x: -40, y: 0 }}
          animate={{
            x: isBatting ? 360 : 0,
            y: isBatting ? -80 : 0,
            rotate: isBatting ? 30 : 0,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="flex items-center gap-3"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
              showFeedback === "correct" ? "ring-4 ring-green-200" : ""
            } ${showFeedback === "wrong" ? "ring-4 ring-red-200" : ""}`}
          >
            <div className="w-10 h-10 rounded-full bg-red-500 shadow-inner border border-red-600" />
          </div>
          <motion.div
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-md p-3 shadow-md border border-blue-50 w-[520px] max-w-[60vw]"
            style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
          >
            <div className="text-lg font-semibold text-slate-800">
              {question}
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  disabled={!!showFeedback}
                  className="text-left rounded-lg p-2 border border-blue-100 hover:scale-[1.01] transition-transform"
                >
                  <div className="text-sm text-slate-700">
                    {String.fromCharCode(65 + i)}. {c}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
