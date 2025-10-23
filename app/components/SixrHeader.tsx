"use client";
import { motion } from "framer-motion";

export default function SixrHeader() {
  return (
    <header className="flex items-center justify-center gap-4 p-4">
      <img
        src="/images/sixr_logo.png"
        alt="SIXR Logo"
        className="w-16 h-16 object-contain"
      />
      <motion.div
        initial={{ y: -8, opacity: 0.8 }}
        animate={{ y: [-12, -8, -12], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl font-bold text-blue-600 drop-shadow-lg bg-white/80 px-8 py-2 rounded-full"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
      >
        SIXR CRICKET
      </motion.div>
    </header>
  );
}
