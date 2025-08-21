import React from "react";
import { motion } from "framer-motion";

export default function StarRating({ value = 0 }) {
  const full = Math.floor(value || 0);
  const half = (value || 0) - full >= 0.5;

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) {
          return (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="text-amber-500 drop-shadow-sm"
            >
              ★
            </motion.span>
          );
        } else if (i === full && half) {
          return (
            <motion.span
              key={i}
              className="text-amber-400/70"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              ⯨
            </motion.span>
          );
        } else {
          return (
            <span key={i} className="text-gray-300">
              ★
            </span>
          );
        }
      })}
    </div>
  );
}
