import { useMemo, useState } from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionPage } from "@/features/shared/section-page";
import { RecordsTable } from "@/features/shared/records-table";
import { ProductDialog } from "@/features/data/record-dialogs";
import { useProducts, useTransactions } from "@/features/data/use-business-data";
import { useDeleteRecord } from "@/features/data/mutations";
import type { ProductRow } from "@/lib/business-data";
import { formatINR } from "@/lib/dashboard-data";

export function ProductsPage() {
  const products = useProducts();
  const transactions = useTransactions();
  const remove = useDeleteRecord("products");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => (products.data ?? []).filter((row) => `${row.name} ${row.category}`.toLowerCase().includes(query.toLowerCase())), [products.data, query]);
  const statsOf = (row: ProductRow) => {
    const sold = (transactions.data ?? []).filter((txn) => (txn.product_id === row.id || txn.product_name === row.name) && txn.status !== "Failed" && txn.status !== "Refunded");
    return { sales: sold.length, revenue: sold.reduce((total, txn) => total + Number(txn.amount), 0) };
  };
  const best = (products.data ?? []).map((row) => ({ name: row.name, ...statsOf(row) })).sort((a, b) => b.revenue - a.revenue)[0];
  const totalRevenue = (transactions.data ?? []).filter((row) => row.status !== "Failed" && row.status !== "Refunded").reduce((total, row) => total + Number(row.amount), 0);

  return <SectionPage eyebrow="Products" title="Product performance" description="Manage what you sell and see which offers are actually driving revenue." icon={Package}
    metrics={[
      { label: "Products", value: String(products.data?.length ?? 0), detail: `${(products.data ?? []).filter((row) => row.active).length} active` },
      { label: "Top performer", value: best?.name ?? "—", detail: best ? formatINR(best.revenue) : "No sales yet" },
      { label: "Product revenue", value: formatINR(totalRevenue), detail: "All time" },
    ]}>
    <section className="panel mt-5 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-5">
        <Input className="max-w-xs" placeholder="Search products" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" />
        <Button className="ml-auto" variant="premium" onClick={() => { setEditing(null); setOpen(true); }}><Plus />Add product</Button>
      </div>
      <RecordsTable
        rows={rows}
        getKey={(row) => row.id}
        empty={products.isLoading ? "Loading products…" : "No products yet. Add your first one."}
        columns={[
          { header: "Product", cell: (row) => <div><span className="block font-semibold">{row.name}</span><span className="text-[11px] text-muted-foreground">{row.category}</span></div> },
          { header: "Price", cell: (row) => <span className="tabular-nums text-muted-foreground">{formatINR(Number(row.price))}</span> },
          { header: "Sales", cell: (row) => <span className="tabular-nums">{statsOf(row).sales}</span> },
          { header: "Revenue", align: "right", cell: (row) => <span className="font-semibold tabular-nums">{formatINR(statsOf(row).revenue)}</span> },
        ]}
        onEdit={(row) => { setEditing(row); setOpen(true); }}
        onDelete={(row) => remove.mutate(row.id)}
      />
    </section>
    <ProductDialog open={open} onOpenChange={setOpen} record={editing} />
  </SectionPage>;
}
