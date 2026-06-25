"use client";

import { motion } from "framer-motion";

/*
 * Lightweight page-level fade-in.
 *
 * Wraps the page content in a single motion.div that transitions from
 * opacity 0 → 1 on mount. The 350ms duration completes well before the
 * Hero's internal stagger animations begin (which are delayed by 350ms),
 * so the two effects compose naturally rather than competing.
 *
 * opacity is the only animated property — no layout shift, no reflow.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
