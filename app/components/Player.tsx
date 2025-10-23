"use client";
import { motion, AnimatePresence } from "framer-motion";

type PlayerProps = {
  isBatting: boolean;
};

export default function Player({ isBatting }: PlayerProps) {
  const standingSrc = "/images/cricket_standing.png";
  const battingSrc = "/images/cricket_batting.png";

  return (
    <div className="relative w-56 h-56 flex items-end justify-center">
      <div className="absolute bottom-2 w-40 h-6 rounded-full bg-gradient-to-r from-blue-100 to-white/40 blur-sm opacity-80" />
      <AnimatePresence>
        {!isBatting ? (
          <motion.img
            key="stand"
            src={standingSrc}
            alt="Cricket standing"
            initial={{ scale: 0.96, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-48 h-auto object-contain drop-shadow-md"
          />
        ) : (
          <motion.img
            key="bat"
            src={battingSrc}
            alt="Cricket batting"
            initial={{ scale: 0.9, rotate: -8 }}
            animate={{ scale: 1.02, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-48 h-auto object-contain drop-shadow-lg"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
