import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface SectionMetric { label: string; value: string; detail: string }
interface SectionPageProps { eyebrow: string; title: string; description: string; icon: LucideIcon; metrics: SectionMetric[]; children?: React.ReactNode }

export function SectionPage({ eyebrow, title, description, icon: Icon, metrics, children }: SectionPageProps) {
  return <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9"><motion.header variants={fadeUp} initial="hidden" animate="visible"><div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-primary"><Icon className="size-4" />{eyebrow}</div><h1 className="mt-3 text-3xl font-extrabold">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></motion.header><motion.section variants={staggerContainer} initial="hidden" animate="visible" className="mt-8 grid gap-4 md:grid-cols-3">{metrics.map((metric) => <motion.article key={metric.label} variants={fadeUp} className="panel p-6"><div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">{metric.label}</p><TrendingUp className="size-4 text-success" /></div><p className="mt-3 text-2xl font-bold">{metric.value}</p><p className="mt-2 flex items-center gap-1 text-xs text-success"><ArrowUpRight className="size-3" />{metric.detail}</p></motion.article>)}</motion.section>{children}</main>;
}