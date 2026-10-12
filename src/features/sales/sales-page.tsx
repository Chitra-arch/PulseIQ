import { useMemo, useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionPage } from "@/features/shared/section-page";
import { RecordsTable } from "@/features/shared/records-table";
import { TransactionDialog } from "@/features/data/record-dialogs";
import { statusClass } from "@/features/dashboard/data-panels";
import { RevenueChart, SalesChart } from "@/features/dashboard/analytics-charts";
import { useTransactions } from "@/features/data/use-business-data";
import { useDeleteRecord } from "@/features/data/mutations";
import { initials, type TransactionRow } from "@/lib/business-data";
import { formatINR } from "@/lib/dashboard-data";

export function SalesPage() {
  const transactions = useTransactions();
  const remove = useDeleteRecord("transactions");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<TransactionRow | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => (transactions.data ?? []).filter((row) => `${row.customer_name} ${row.product_name} ${row.reference} ${row.status}`.toLowerCase().includes(query.toLowerCase())), [transactions.data, query]);
  const settled = (transactions.data ?? []).filter((row) => row.status !== "Failed" && row.status !== "Refunded");
  const revenue = settled.reduce((total, row) => total + Number(row.amount), 0);
  const pending = (transactions.data ?? []).filter((row) => row.status === "Pending").length;

  return <SectionPage eyebrow="Sales" title="Sales and transactions" description="Record every payment as it happens — the dashboard and reports update instantly." icon={TrendingUp}
    metrics={[
      { label: "Transactions", value: (transactions.data?.length ?? 0).toLocaleString("en-IN"), detail: `${pending} pending` },
      { label: "Settled revenue", value: formatINR(revenue), detail: "Excludes failed and refunded" },
      { label: "Average order", value: formatINR(settled.length ? revenue / settled.length : 0), detail: "Per transaction" },
    ]}>
    <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3"><RevenueChart /><SalesChart /></div>
    <section className="panel mt-4 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-5">
        <Input className="max-w-xs" placeholder="Search transactions" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search transactions" />
        <Button className="ml-auto" variant="premium" onClick={() => { setEditing(null); setOpen(true); }}><Plus />Record transaction</Button>
      </div>
      <RecordsTable
        rows={rows}
        getKey={(row) => row.id}
        empty={transactions.isLoading ? "Loading transactions…" : "No transactions yet. Record your first payment."}
        columns={[
          { header: "Customer", cell: (row) => <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{initials(row.customer_name)}</span><div><span className="block font-semibold">{row.customer_name}</span><span className="text-[11px] text-muted-foreground">{row.reference}</span></div></div> },
          { header: "Product", cell: (row) => <span className="text-muted-foreground">{row.product_name}</span> },
          { header: "Amount", cell: (row) => <span className="font-semibold tabular-nums">{formatINR(Number(row.amount))}</span> },
          { header: "Status", cell: (row) => <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(row.status)}`}><span className="size-1.5 rounded-full bg-current" />{row.status}</span> },
          { header: "Date", align: "right", cell: (row) => <span className="text-muted-foreground">{new Date(row.occurred_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span> },
        ]}
        onEdit={(row) => { setEditing(row); setOpen(true); }}
        onDelete={(row) => remove.mutate(row.id)}
      />
    </section>
    <TransactionDialog open={open} onOpenChange={setOpen} record={editing} />
  </SectionPage>;
}
