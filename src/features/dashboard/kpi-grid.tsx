import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight, IndianRupee, ShoppingBag, UserRound, Waypoints } from "lucide-react";
import { scaleIn, staggerContainer } from "@/lib/motion";
import { useBusinessData } from "@/features/data/use-business-data";

function trendOf(series: number[]) {
  if (series.length < 4) return 0;
  const half = Math.floor(series.length / 2);
  const previous = series.slice(0, half).reduce((a, b) => a + b, 0);
  const current = series.slice(half).reduce((a, b) => a + b, 0);
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function CountUp({ value, display }: { value: number; display: (value: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null); const visible = useInView(ref, { once: true }); const reduceMotion = useReducedMotion(); const [current, setCurrent] = useState(0);
  useEffect(() => { if (!visible) return; if (reduceMotion) { setCurrent(value); return; } const start = performance.now(); const frame = (now: number) => { const progress = Math.min((now - start) / 900, 1); setCurrent(value * (1 - Math.pow(1 - progress, 3))); if (progress < 1) requestAnimationFrame(frame); }; requestAnimationFrame(frame); }, [reduceMotion, value, visible]);
  return <span ref={ref}>{display(current)}</span>;
}

export function KpiGrid() {
  const { snapshot, isDemo } = useBusinessData();
  const revenueSpark = snapshot.revenueSeries["30d"].map((point) => point.revenue);
  const orderSpark = snapshot.salesSeries.map((point) => point.current);

  const kpis = [
    { label: "Total Revenue", value: snapshot.kpis.revenue, display: (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`, trend: isDemo ? 18.4 : trendOf(revenueSpark), icon: IndianRupee, data: revenueSpark },
    { label: "Total Orders", value: snapshot.kpis.orders, display: (v: number) => Math.round(v).toLocaleString("en-IN"), trend: isDemo ? 12.6 : trendOf(orderSpark), icon: ShoppingBag, data: orderSpark },
    { label: "Customers", value: snapshot.kpis.customers, display: (v: number) => Math.round(v).toLocaleString("en-IN"), trend: isDemo ? 8.2 : trendOf(orderSpark), icon: UserRound, data: orderSpark },
    { label: "Conversion Rate", value: snapshot.kpis.conversion, display: (v: number) => `${v.toFixed(2)}%`, trend: isDemo ? 2.4 : trendOf(revenueSpark), icon: Waypoints, data: revenueSpark },
  ];

  return <motion.section variants={staggerContainer} initial="hidden" animate="visible" data-tour="kpis" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key business metrics">
    {kpis.map((kpi) => { const up = kpi.trend >= 0; const Trend = up ? ArrowUpRight : ArrowDownRight; const chartData = (kpi.data.length ? kpi.data : [0, 0]).map((value, index) => ({ index, value }));
      return <motion.article key={kpi.label} variants={scaleIn} whileHover={{ y: -3 }} className="panel group relative min-w-0 overflow-hidden p-5 transition-colors hover:border-primary/35">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-brand opacity-0 transition-opacity group-hover:opacity-80" />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-muted-foreground">{kpi.label}</p><h2 className="mt-3 truncate text-2xl font-bold tabular-nums tracking-normal"><CountUp value={kpi.value} display={kpi.display} /></h2></div><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><kpi.icon className="size-4" /></span></div>
      <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-end gap-3"><span className={`mb-1 inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-success" : "text-destructive"}`}><Trend className="size-3" />{Math.abs(kpi.trend).toFixed(1)}%<span className="hidden font-normal text-muted-foreground 2xl:inline"> vs previous</span></span><div className="h-12 min-w-0"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id={`spark-${kpi.label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.32}/><stop offset="100%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill={`url(#spark-${kpi.label.replace(/\s/g, "")})`} isAnimationActive animationDuration={900}/></AreaChart></ResponsiveContainer></div></div>
    </motion.article>; })}
  </motion.section>;
}
