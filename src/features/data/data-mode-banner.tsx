import { motion } from "framer-motion";
import { Database, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBusinessData } from "./use-business-data";
import { useUIStore } from "@/store/ui-store";
import { fadeUp } from "@/lib/motion";

export function DataModeBanner() {
  const { isDemo, isEmpty } = useBusinessData();
  const setDataMode = useUIStore((state) => state.setDataMode);

  if (!isDemo && !isEmpty) return null;

  return <motion.div variants={fadeUp} initial="hidden" animate="visible" className="panel mb-5 flex flex-wrap items-center gap-3 p-4">
    <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">{isDemo ? <Sparkles className="size-4" /> : <Database className="size-4" />}</span>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold">{isDemo ? "Showing sample figures" : "Your workspace is empty"}</p>
      <p className="text-xs text-muted-foreground">{isDemo ? "Switch to your own data once you've added customers, products and transactions." : "Add customers, products and transactions and the dashboard fills in automatically."}</p>
    </div>
    {isDemo
      ? <Button size="sm" variant="premium" onClick={() => setDataMode("live")}>Use my data</Button>
      : <Button size="sm" variant="outline" onClick={() => setDataMode("demo")}>Back to sample data</Button>}
  </motion.div>;
}
