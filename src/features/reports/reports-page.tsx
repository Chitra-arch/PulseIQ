import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Download, FileSpreadsheet, FileText, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionPage } from "@/features/shared/section-page";
import { DataModeBanner } from "@/features/data/data-mode-banner";
import { useBusinessData, useReports, useTransactions } from "@/features/data/use-business-data";
import { buildCsv, buildPdf, downloadBlob, downloadStored, saveReport } from "./report-export";
import { relativeTime } from "@/lib/business-data";
import { fadeUp } from "@/lib/motion";

type ReportState = "idle" | "generating" | "ready";

export function ReportsPage() {
  const { snapshot, isDemo } = useBusinessData();
  const transactions = useTransactions();
  const reports = useReports();
  const queryClient = useQueryClient();
  const [state, setState] = useState<ReportState>("idle");
  const [progress, setProgress] = useState(0);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const title = `PulseIQ Business Report — ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`;

  const generate = async () => {
    setState("generating"); setProgress(15);
    try {
      const blob = buildPdf(snapshot, title); setProgress(55);
      if (isDemo) { downloadBlob(blob, "pulseiq-sample-report.pdf"); setLastPath(null); }
      else { const path = await saveReport(blob, "pdf", title, snapshot.kpis as unknown as Record<string, unknown>); setLastPath(path); void queryClient.invalidateQueries({ queryKey: ["reports"] }); }
      setProgress(100); setState("ready"); toast.success(isDemo ? "Sample report downloaded" : "Report saved to history");
    } catch (e) { setState("idle"); toast.error((e as Error).message); }
  };

  const downloadPdf = async () => {
    try { if (lastPath) await downloadStored(lastPath); else downloadBlob(buildPdf(snapshot, title), "pulseiq-report.pdf"); } catch (e) { toast.error((e as Error).message); }
  };

  const exportCsv = async () => {
    const rows = transactions.data ?? [];
    if (isDemo || !rows.length) { toast.error("Switch to your data and add transactions to export them."); return; }
    try {
      const blob = new Blob([buildCsv(rows)], { type: "text/csv" });
      downloadBlob(blob, "pulseiq-transactions.csv");
      await saveReport(blob, "csv", "Transaction export", { rows: rows.length });
      void queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success(`Exported ${rows.length} transactions`);
    } catch (e) { toast.error((e as Error).message); }
  };

  const history = reports.data ?? [];
  return <SectionPage eyebrow="Reports" title="Decision-ready reporting" description="Build PDF reports and spreadsheet exports from your figures, saved for later download." icon={FileText} metrics={[{ label: "Reports saved", value: String(history.length), detail: "In your history" }, { label: "Transactions", value: String(transactions.data?.length ?? 0), detail: "Available to export" }, { label: "Data source", value: isDemo ? "Sample" : "Live", detail: isDemo ? "Switch in Settings" : "Updates automatically" }]}>
    <div className="mt-5"><DataModeBanner /></div>
    <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div className="panel p-6">
        <h2 className="text-lg font-bold">Performance report</h2>
        <p className="mt-2 text-sm text-muted-foreground">Revenue, orders, customers, top products and recent transactions.</p>
        <div className="mt-8 rounded-xl border border-border bg-muted/35 p-5">
          {state === "idle" && <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><FileText /></span><div><p className="font-semibold">Ready to generate</p><p className="text-xs text-muted-foreground">{isDemo ? "Uses sample figures" : "Uses your current figures"}</p></div></div>}
          {state === "generating" && <div><div className="flex items-center gap-3"><LoaderCircle className="animate-spin text-primary" /><p className="font-semibold">Generating report...</p><span className="ml-auto text-sm font-bold">{progress}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><motion.div className="h-full bg-gradient-brand" animate={{ width: `${progress}%` }} /></div></div>}
          {state === "ready" && <div className="flex items-center gap-3"><CheckCircle2 className="text-success" /><div><p className="font-semibold">Report ready</p><p className="text-xs text-muted-foreground">{lastPath ? "Saved to your history" : "Downloaded to your device"}</p></div></div>}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="premium" disabled={state === "generating"} onClick={generate}><FileText />Generate Report</Button>
          <Button variant="outline" onClick={downloadPdf}><Download />Download PDF</Button>
        </div>
      </div>
      <div className="panel p-6">
        <span className="grid size-11 place-items-center rounded-xl bg-success/10 text-success"><FileSpreadsheet /></span>
        <h2 className="mt-5 text-lg font-bold">Raw transaction data</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Export every transaction as a spreadsheet. A copy is kept in your history.</p>
        <Button variant="outline" className="mt-7 w-full" onClick={exportCsv}><FileSpreadsheet />Export CSV</Button>
      </div>
    </section>
    <motion.section variants={fadeUp} initial="hidden" animate="visible" className="panel mt-4 p-6">
      <h2 className="text-lg font-bold">Report history</h2>
      {history.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No saved reports yet.</p> :
        <ul className="mt-4 divide-y divide-border">{history.map((r) => <li key={r.id} className="flex items-center gap-3 py-3"><span className="rounded-md bg-muted px-2 py-1 text-[11px] font-bold uppercase">{r.format}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{r.title}</p><p className="text-xs text-muted-foreground">{relativeTime(r.created_at)}</p></div>{r.file_path && <Button size="sm" variant="ghost" aria-label={`Download ${r.title}`} onClick={() => downloadStored(r.file_path!).catch((e: Error) => toast.error(e.message))}><Download /></Button>}</li>)}</ul>}
    </motion.section>
  </SectionPage>;
}
