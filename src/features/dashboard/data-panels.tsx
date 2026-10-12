import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, CircleDollarSign, PackageCheck, UserPlus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/dashboard-data";
import { useBusinessData } from "@/features/data/use-business-data";
import { fadeUp, staggerContainer } from "@/lib/motion";

export const statusClass = (status: string) =>
  status === "Completed" ? "bg-success/10 text-success"
  : status === "Pending" ? "bg-warning/10 text-warning"
  : status === "Failed" ? "bg-destructive/10 text-destructive"
  : "bg-info/10 text-info";

const activityIcons = { customer: UserPlus, order: CheckCircle2, upgrade: Zap, payment: CircleDollarSign, product: PackageCheck };

function EmptyState({ message }: { message: string }) {
  return <p className="px-6 py-10 text-center text-sm text-muted-foreground">{message}</p>;
}

export function TransactionsPanel() {
  const { snapshot } = useBusinessData();
  return <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} data-tour="transactions" className="panel min-w-0 overflow-hidden xl:col-span-2"><div className="flex items-center justify-between p-5 sm:p-6"><div><h2 className="text-base font-bold">Recent Transactions</h2><p className="mt-1 text-xs text-muted-foreground">Latest customer payments</p></div><Button variant="ghost" size="sm" asChild><Link to="/sales">View all <ArrowUpRight /></Link></Button></div>{snapshot.transactions.length === 0 ? <EmptyState message="No transactions yet. Add your first one on the Sales page." /> : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-y border-border bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="px-6 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-6 py-3 text-right font-semibold">Date</th></tr></thead><motion.tbody variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>{snapshot.transactions.slice(0, 5).map((item) => <motion.tr key={item.id} variants={fadeUp} className="border-b border-border/70 transition-colors last:border-0 hover:bg-muted/35"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{item.initials}</span><div><span className="block font-semibold">{item.customer}</span><span className="text-[11px] text-muted-foreground">{item.reference}</span></div></div></td><td className="px-4 py-4 text-muted-foreground">{item.product}</td><td className="px-4 py-4 font-semibold tabular-nums">{formatINR(item.amount)}</td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(item.status)}`}><span className="size-1.5 rounded-full bg-current" />{item.status}</span></td><td className="px-6 py-4 text-right text-muted-foreground">{item.date}</td></motion.tr>)}</motion.tbody></table></div>}</motion.section>;
}

export function ProductsPanel() {
  const { snapshot } = useBusinessData();
  return <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} data-tour="products" className="panel p-5 sm:p-6"><div><h2 className="text-base font-bold">Top Products</h2><p className="mt-1 text-xs text-muted-foreground">Performance this month</p></div>{snapshot.products.length === 0 ? <EmptyState message="No products yet. Add them on the Products page." /> : <div className="mt-6 grid gap-6">{snapshot.products.slice(0, 5).map((product, index) => <div key={product.name}><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{product.name}</p><p className="text-[11px] text-muted-foreground">{product.sales.toLocaleString("en-IN")} sales</p></div><p className="text-sm font-bold tabular-nums">{formatINR(product.revenue)}</p></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div className="h-full rounded-full bg-gradient-brand" initial={{ width: 0 }} whileInView={{ width: `${product.progress}%` }} viewport={{ once: true }} transition={{ duration: 0.7, delay: index * 0.08 }} /></div></div>)}</div>}</motion.section>;
}

export function ActivityPanel() {
  const { snapshot } = useBusinessData();
  return <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="panel p-5 sm:p-6"><div><h2 className="text-base font-bold">Customer Activity</h2><p className="mt-1 text-xs text-muted-foreground">Live events from your workspace</p></div>{snapshot.activities.length === 0 ? <EmptyState message="Activity appears here as customers and orders are added." /> : <div className="relative mt-6"><motion.div className="absolute bottom-4 left-[15px] top-4 w-px origin-top bg-border" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />{snapshot.activities.map((activity, index) => { const Icon = activityIcons[activity.kind]; return <motion.div key={activity.id} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-3 pb-5 last:pb-0"><span className="z-10 grid size-8 place-items-center rounded-full border border-border bg-card text-primary"><Icon className="size-3.5" /></span><div className="min-w-0 pt-0.5"><p className="truncate text-sm font-semibold">{activity.title}</p><p className="truncate text-xs text-muted-foreground">{activity.detail}</p><p className="mt-1 text-[10px] text-muted-foreground">{activity.time}</p></div></motion.div>; })}</div>}</motion.section>;
}
