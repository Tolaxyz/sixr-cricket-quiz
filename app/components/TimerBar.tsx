"use client";
import { motion } from "framer-motion";

type TimerProps = {
  timeLeft: number;
  total: number;
};

export default function TimerBar({ timeLeft, total }: TimerProps) {
  const progress = (timeLeft / total) * 100;
  return (
    <div className="w-full mt-4">
      <div className="text-sm text-slate-600">Time left</div>
      <div className="w-full h-3 bg-white rounded-full border border-blue-100 mt-2 overflow-hidden">
        <motion.div
          className="h-full bg-blue-400 rounded-full"
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>
      <div className="mt-1 text-xs text-slate-500">{timeLeft}s</div>
    </div>
  );
}
