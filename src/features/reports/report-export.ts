import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessSnapshot, TransactionRow } from "@/lib/business-data";

const inr = (v: number) => `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v)}`;

export function buildCsv(rows: TransactionRow[]) {
  const header = ["Reference", "Customer", "Product", "Amount", "Status", "Date"];
  const body = rows.map((r) => [r.reference, r.customer_name, r.product_name, String(r.amount), r.status, r.occurred_at.slice(0, 10)]);
  return [header, ...body].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function buildPdf(snapshot: BusinessSnapshot, title: string) {
  const doc = new jsPDF();
  doc.setFontSize(18); doc.text(title, 14, 20);
  doc.setFontSize(10); doc.text(`Generated ${new Date().toLocaleString("en-IN")}`, 14, 27);
  doc.setFontSize(12);
  const k = snapshot.kpis;
  [["Revenue", inr(k.revenue)], ["Orders", String(k.orders)], ["Customers", String(k.customers)], ["Conversion", `${k.conversion.toFixed(2)}%`]]
    .forEach(([l, v], i) => doc.text(`${l}: ${v}`, 14, 40 + i * 7));
  doc.setFontSize(14); doc.text("Top products", 14, 76); doc.setFontSize(10);
  let y = 84;
  snapshot.products.slice(0, 8).forEach((p) => { doc.text(`${p.name} — ${p.sales} sales — ${inr(p.revenue)}`, 14, y); y += 6; });
  doc.setFontSize(14); doc.text("Recent transactions", 14, y + 6); doc.setFontSize(10); y += 14;
  snapshot.transactions.slice(0, 12).forEach((t) => { doc.text(`${t.date}  ${t.customer} · ${t.product} · ${inr(t.amount)} · ${t.status}`, 14, y); y += 6; });
  return doc.output("blob");
}

/** Uploads a file to storage, records it in the reports history and returns a download link. */
export async function saveReport(blob: Blob, ext: "pdf" | "csv", title: string, totals: Record<string, unknown>) {
  const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${ext === "pdf" ? "report" : "transactions"}.${ext}`;
  const { error: upErr } = await supabase.storage.from("reports").upload(path, blob, { contentType: ext === "pdf" ? "application/pdf" : "text/csv" });
  if (upErr) throw upErr;
  const { error } = await supabase.from("reports").insert({ title, format: ext, file_path: path, totals } as never);
  if (error) throw error;
  return path;
}

export async function downloadStored(path: string) {
  const { data, error } = await supabase.storage.from("reports").createSignedUrl(path, 300, { download: true });
  if (error) throw error;
  window.open(data.signedUrl, "_blank");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
