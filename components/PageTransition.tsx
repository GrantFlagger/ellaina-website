/*
 * Lightweight page-level fade-in.
 *
 * Pure CSS (see .page-fade-in in globals.css) rather than framer-motion:
 * a motion.div server-renders `opacity: 0` and stays invisible until the JS
 * bundle hydrates, which pushed LCP back on every page. The CSS animation
 * starts on first paint instead. Same 350ms opacity-only fade — no layout
 * shift, no reflow.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-fade-in">{children}</div>;
}
