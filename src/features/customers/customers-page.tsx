import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionPage } from "@/features/shared/section-page";
import { RecordsTable } from "@/features/shared/records-table";
import { CustomerDialog } from "@/features/data/record-dialogs";
import { useCustomers, useTransactions } from "@/features/data/use-business-data";
import { useDeleteRecord } from "@/features/data/mutations";
import { initials } from "@/lib/business-data";
import type { CustomerRow } from "@/lib/business-data";
import { formatINR } from "@/lib/dashboard-data";

export function CustomersPage() {
  const customers = useCustomers();
  const transactions = useTransactions();
  const remove = useDeleteRecord("customers");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CustomerRow | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => (customers.data ?? []).filter((row) => `${row.name} ${row.email ?? ""} ${row.company ?? ""}`.toLowerCase().includes(query.toLowerCase())), [customers.data, query]);
  const valueOf = (id: string) => (transactions.data ?? []).filter((row) => row.customer_id === id && row.status !== "Failed" && row.status !== "Refunded").reduce((total, row) => total + Number(row.amount), 0);
  const active = (customers.data ?? []).filter((row) => row.status === "Active").length;
  const lifetime = (transactions.data ?? []).reduce((total, row) => total + Number(row.amount), 0);

  return <SectionPage eyebrow="Customers" title="Customer momentum" description="Add, edit and track every account in your business, with live value from their transactions." icon={Users}
    metrics={[
      { label: "Total customers", value: (customers.data?.length ?? 0).toLocaleString("en-IN"), detail: `${active} active` },
      { label: "Lifetime value", value: formatINR(lifetime), detail: "All recorded payments" },
      { label: "Average value", value: formatINR(customers.data?.length ? lifetime / customers.data.length : 0), detail: "Per customer" },
    ]}>
    <section className="panel mt-5 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-5">
        <Input className="max-w-xs" placeholder="Search customers" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search customers" />
        <Button className="ml-auto" variant="premium" onClick={() => { setEditing(null); setOpen(true); }}><Plus />Add customer</Button>
      </div>
      <RecordsTable
        rows={rows}
        getKey={(row) => row.id}
        empty={customers.isLoading ? "Loading customers…" : "No customers yet. Add your first one."}
        columns={[
          { header: "Customer", cell: (row) => <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{initials(row.name)}</span><div><span className="block font-semibold">{row.name}</span><span className="text-[11px] text-muted-foreground">{row.email ?? "No email"}</span></div></div> },
          { header: "Company", cell: (row) => <span className="text-muted-foreground">{row.company ?? "—"}</span> },
          { header: "Plan", cell: (row) => <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold">{row.plan}</span> },
          { header: "Status", cell: (row) => <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.status === "Active" ? "bg-success/10 text-success" : row.status === "Trial" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{row.status}</span> },
          { header: "Value", align: "right", cell: (row) => <span className="font-semibold tabular-nums">{formatINR(valueOf(row.id))}</span> },
        ]}
        onEdit={(row) => { setEditing(row); setOpen(true); }}
        onDelete={(row) => remove.mutate(row.id)}
      />
    </section>
    <CustomerDialog open={open} onOpenChange={setOpen} record={editing} />
  </SectionPage>;
}
