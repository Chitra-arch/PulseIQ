import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, FileDown, Radio, ShieldCheck, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { BackgroundOverlay } from "@/components/layout/background-overlay";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PulseIQ — Live Business Analytics" },
    { name: "description", content: "See revenue, customers, products, and transactions in one live business analytics workspace." },
    { property: "og:title", content: "PulseIQ — Live Business Analytics" },
    { property: "og:description", content: "See revenue, customers, products, and transactions in one live business analytics workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: IntroductionPage,
});

const capabilities = [
  { icon: BarChart3, title: "One clear view", copy: "Revenue, orders, customers, and conversion trends stay together and easy to compare." },
  { icon: Radio, title: "Live by default", copy: "Fresh transactions flow into your numbers automatically, without waiting for a reload." },
  { icon: FileDown, title: "Reports that travel", copy: "Generate polished PDF summaries and export clean CSV records whenever you need them." },
];

const chartBars = ["h-[28%]", "h-[42%]", "h-[35%]", "h-[54%]", "h-[48%]", "h-[63%]", "h-[72%]", "h-[66%]", "h-[82%]", "h-[92%]", "h-[86%]", "h-full"];

function IntroductionPage() {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", localStorage.getItem("pulseiq-theme") !== "light");
  }, []);

  return (
    <main className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <BackgroundOverlay />
      <nav className="relative z-20 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-brand shadow-brand"><Zap className="size-4 text-primary-foreground" fill="currentColor" /></span>
          <span className="text-lg">Pulse<span className="text-gradient-brand">IQ</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
          <Button asChild variant="premium" size="sm"><Link to="/auth">Get started <ArrowRight /></Link></Button>
        </div>
      </nav>

      <section className="relative z-10 mx-auto flex min-h-[calc(88svh-4rem)] max-w-7xl flex-col items-center px-4 pb-10 pt-12 text-center sm:px-6 sm:pt-20 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex w-full flex-col items-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" /> Your business, in focus
          </motion.div>
          <motion.h1 variants={fadeUp} className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.08] sm:text-6xl lg:text-7xl">
            Business intelligence that <span className="text-gradient-brand">moves with you.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            PulseIQ turns customers, products, and transactions into a live view of what is growing—and what needs your attention next.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="premium" size="lg"><Link to="/auth">Open your workspace <ArrowRight /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/auth">I already have an account</Link></Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card/90 p-2 shadow-2xl backdrop-blur-sm sm:p-3">
            <div className="flex items-center justify-between border-b border-border px-3 py-2 text-left">
              <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-success" /><span className="text-xs font-semibold">Live overview</span></div>
              <span className="text-[10px] text-muted-foreground">Updated now</span>
            </div>
            <div className="grid gap-2 p-2 sm:grid-cols-4">
              {[
                ["Revenue", "₹24.8L", "+18.4%"],
                ["Orders", "12,842", "+12.6%"],
                ["Customers", "8,492", "+8.2%"],
                ["Conversion", "6.84%", "+2.4%"],
              ].map(([label, value, change]) => (
                <div key={label} className="rounded-xl border border-border bg-background/70 p-3 text-left">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  <div className="mt-1 flex items-end justify-between gap-2"><strong className="text-base sm:text-lg">{value}</strong><span className="text-[10px] font-semibold text-success">{change}</span></div>
                </div>
              ))}
            </div>
            <div className="grid gap-2 p-2 pt-0 md:grid-cols-[1.7fr_1fr]">
              <div className="relative h-32 overflow-hidden rounded-xl border border-border bg-background/70 p-3 text-left sm:h-40">
                <div className="flex items-center justify-between"><span className="text-xs font-semibold">Revenue velocity</span><TrendingUp className="size-4 text-success" /></div>
                <div className="absolute inset-x-3 bottom-3 flex h-20 items-end gap-2 sm:h-24">
                  {chartBars.map((height, index) => <span key={height} className={`min-w-0 flex-1 rounded-t-sm bg-primary/70 ${height} ${index < 4 ? "opacity-50" : index < 8 ? "opacity-70" : "opacity-90"}`} />)}
                </div>
              </div>
              <div className="hidden rounded-xl border border-border bg-background/70 p-3 text-left md:block">
                <div className="flex items-center justify-between"><span className="text-xs font-semibold">Customer pulse</span><Users className="size-4 text-primary" /></div>
                <div className="mt-5 grid gap-3">
                  {["New customer registered", "Enterprise plan upgraded", "Payment completed"].map((item, index) => <div key={item} className="flex items-center gap-2 text-[11px] text-muted-foreground"><span className={`size-2 rounded-full ${index === 2 ? "bg-success" : "bg-primary"}`} />{item}</div>)}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-10 border-y border-border bg-card/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase text-primary">Built for daily decisions</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Less hunting. More knowing.</h2><p className="mt-4 leading-7 text-muted-foreground">From the first sale of the day to the month-end report, PulseIQ keeps the whole story connected.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-2xl border border-border bg-background/70 p-6"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div><div className="flex items-center gap-2 text-sm font-semibold text-success"><ShieldCheck className="size-4" /> Your workspace stays account-protected</div><h2 className="mt-4 max-w-2xl text-3xl font-extrabold sm:text-4xl">Ready to see your business clearly?</h2><p className="mt-3 text-muted-foreground">Create your account, add your records, and let PulseIQ turn the details into direction.</p></div>
        <Button asChild variant="premium" size="lg"><Link to="/auth">Get started with PulseIQ <ArrowRight /></Link></Button>
      </section>

      <footer className="relative z-10 border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">© 2026 PulseIQ. Business intelligence, without the noise.</footer>
    </main>
  );
}