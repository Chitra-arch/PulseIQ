import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";
import { KpiGrid } from "./kpi-grid";
import { RevenueChart, SalesChart } from "./analytics-charts";
import { ActivityPanel, ProductsPanel, TransactionsPanel } from "./data-panels";
import { fadeUp } from "@/lib/motion";
import { DataModeBanner } from "@/features/data/data-mode-banner";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { useTourLauncher } from "@/features/tour/dashboard-tour";
import { useAccountIdentity } from "@/hooks/use-account-identity";

export function DashboardPage() {
  const startTour = useTourLauncher();
  const { name } = useAccountIdentity();
  return <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <motion.header variants={fadeUp} initial="hidden" animate="visible" className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div><div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-primary"><Sparkles className="size-3.5" /> Monday overview</div><h1 className="text-2xl font-extrabold tracking-normal sm:text-3xl">Good morning, {name} <span aria-hidden="true">👋</span></h1><p className="mt-2 text-sm text-muted-foreground">Here's what's happening with your business today.</p></div><div className="flex flex-wrap items-center gap-2"><Button variant="outline" size="sm" onClick={startTour}><Compass />Take the tour</Button><div className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground md:hidden"><CalendarDays className="size-4" />Aug 1 – Aug 31, 2026</div></div></motion.header>
    <DataModeBanner />
    <KpiGrid />
    <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3"><RevenueChart /><SalesChart /></div>
    <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3"><TransactionsPanel /><ProductsPanel /></div>
    <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2"><ActivityPanel /><BusinessPulse /></div>
  </main>;
}

function BusinessPulse() {
  return <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="panel relative overflow-hidden p-6"><div className="absolute inset-x-0 top-0 h-px bg-gradient-brand"/><div className="flex items-center gap-2 text-xs font-bold uppercase text-primary"><span className="size-2 rounded-full bg-success" /> Pulse insight</div><h2 className="mt-5 max-w-md text-xl font-bold">Your strongest August is closing 18.4% above last month.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Enterprise upgrades are driving most of the lift, while acquisition cost remains stable. Growth Plan conversions are the clearest opportunity for September.</p><div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5"><div><p className="text-lg font-bold">₹3.8L</p><p className="text-[11px] text-muted-foreground">Projected lift</p></div><div><p className="text-lg font-bold">42%</p><p className="text-[11px] text-muted-foreground">Enterprise share</p></div><div><p className="text-lg font-bold">4.2x</p><p className="text-[11px] text-muted-foreground">ROI</p></div></div></motion.section>;
}