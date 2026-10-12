import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Step { target: string; title: string; body: string }
const steps: Step[] = [
  { target: "kpis", title: "Key numbers", body: "Revenue, orders, customers and conversion count up as they load, with a small trend line for each." },
  { target: "revenue", title: "Revenue vs Expenses", body: "Switch between 7 days, 30 days, 3 months and 1 year. Hover the chart to see exact amounts." },
  { target: "sales", title: "Sales comparison", body: "This year's monthly orders side by side with last year's." },
  { target: "transactions", title: "Recent transactions", body: "The latest payments with their status. New ones appear here automatically." },
  { target: "products", title: "Top products", body: "Your best sellers ranked by revenue, with bars showing their share." },
];
const KEY = "pulseiq-tour-done";

export function useTourLauncher() {
  return () => window.dispatchEvent(new Event("pulseiq-tour"));
}

export function DashboardTour() {
  const [index, setIndex] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const start = () => setIndex(0);
    window.addEventListener("pulseiq-tour", start);
    if (!localStorage.getItem(KEY)) { const t = setTimeout(start, 1600); return () => { clearTimeout(t); window.removeEventListener("pulseiq-tour", start); }; }
    return () => window.removeEventListener("pulseiq-tour", start);
  }, []);

  const measure = useCallback(() => {
    if (index === null) return;
    const el = document.querySelector(`[data-tour="${steps[index]!.target}"]`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const el = document.querySelector(`[data-tour="${steps[index]!.target}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(measure, 400);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [index, measure]);

  const close = () => { localStorage.setItem(KEY, "1"); setIndex(null); setRect(null); };
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  if (index === null) return null;
  const step = steps[index]!;
  const pad = 8;
  const cardTop = rect ? Math.min(rect.bottom + 14, window.innerHeight - 200) : window.innerHeight / 2 - 90;
  const cardLeft = rect ? Math.max(16, Math.min(rect.left, window.innerWidth - 336)) : window.innerWidth / 2 - 160;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Dashboard walkthrough">
      <div className="absolute inset-0" onClick={close} />
      <AnimatePresence>
        {rect && <motion.div key="spot" className="pointer-events-none absolute rounded-2xl ring-2 ring-primary" style={{ boxShadow: "0 0 0 9999px color-mix(in oklab, var(--background) 72%, transparent)" }}
          initial={false} animate={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} transition={{ type: "spring", stiffness: 260, damping: 30 }} />}
      </AnimatePresence>
      <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
        className="panel absolute w-[min(20rem,calc(100vw-2rem))] p-5 shadow-xl" style={{ top: cardTop, left: cardLeft }}>
        <p className="text-[11px] font-semibold text-primary">Step {index + 1} of {steps.length}</p>
        <h2 className="mt-1 text-base font-bold">{step.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
        <div className="mt-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={close}>Skip</Button>
          <div className="flex gap-2">
            {index > 0 && <Button variant="outline" size="sm" onClick={() => setIndex(index - 1)}>Back</Button>}
            <Button size="sm" onClick={() => (index === steps.length - 1 ? close() : setIndex(index + 1))}>{index === steps.length - 1 ? "Done" : "Next"}</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
