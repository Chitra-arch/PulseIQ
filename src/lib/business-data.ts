import { activities, products as demoProducts, revenueData, salesData, transactions as demoTransactions, type ChartRange } from "@/lib/dashboard-data";

export interface CustomerRow { id: string; name: string; email: string | null; company: string | null; plan: string; status: string; created_at: string }
export interface ProductRow { id: string; name: string; category: string; price: number; active: boolean; created_at: string }
export interface TransactionRow { id: string; reference: string; customer_id: string | null; customer_name: string; product_id: string | null; product_name: string; amount: number; status: string; occurred_at: string }
export interface ReportRow { id: string; title: string; period_start: string | null; period_end: string | null; format: string; file_path: string | null; totals: Record<string, unknown>; created_at: string }

export interface RevenuePointView { label: string; revenue: number; expenses: number }
export interface SalesPointView { month: string; current: number; previous: number }
export interface TransactionView { id: string; reference: string; customer: string; initials: string; product: string; amount: number; status: string; date: string }
export interface ProductView { name: string; category: string; sales: number; revenue: number; progress: number }
export interface ActivityView { id: string; title: string; detail: string; time: string; kind: "customer" | "order" | "upgrade" | "payment" | "product" }

export interface BusinessSnapshot {
  kpis: { revenue: number; orders: number; customers: number; conversion: number };
  revenueSeries: Record<ChartRange, RevenuePointView[]>;
  salesSeries: SalesPointView[];
  salesLabels: { current: string; previous: string };
  transactions: TransactionView[];
  products: ProductView[];
  activities: ActivityView[];
  hasExpenses: boolean;
}

export const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}

const rangeDays: Record<ChartRange, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };

function bucketRevenue(rows: TransactionRow[], range: ChartRange): RevenuePointView[] {
  const days = rangeDays[range];
  const now = new Date();
  const buckets: { label: string; from: number; to: number }[] = [];
  if (range === "1y") {
    for (let index = 11; index >= 0; index -= 1) {
      const start = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - index + 1, 1);
      buckets.push({ label: start.toLocaleDateString("en-IN", { month: "short" }), from: start.getTime(), to: end.getTime() });
    }
  } else {
    const step = range === "90d" ? 7 : range === "30d" ? 3 : 1;
    for (let offset = days - step; offset >= 0; offset -= step) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
      const end = new Date(start.getTime() + step * 86400000);
      buckets.push({ label: shortDate(start.toISOString()), from: start.getTime(), to: end.getTime() });
    }
  }
  return buckets.map((bucket) => {
    const revenue = rows
      .filter((row) => { const time = new Date(row.occurred_at).getTime(); return time >= bucket.from && time < bucket.to && row.status !== "Failed" && row.status !== "Refunded"; })
      .reduce((total, row) => total + Number(row.amount), 0);
    return { label: bucket.label, revenue, expenses: 0 };
  });
}

function buildSales(rows: TransactionRow[]): SalesPointView[] {
  const year = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, month) => ({
    month: new Date(year, month, 1).toLocaleDateString("en-IN", { month: "short" }),
    current: rows.filter((row) => { const date = new Date(row.occurred_at); return date.getFullYear() === year && date.getMonth() === month; }).length,
    previous: rows.filter((row) => { const date = new Date(row.occurred_at); return date.getFullYear() === year - 1 && date.getMonth() === month; }).length,
  }));
}

export function buildLiveSnapshot(customers: CustomerRow[], productRows: ProductRow[], txns: TransactionRow[]): BusinessSnapshot {
  const settled = txns.filter((row) => row.status !== "Failed" && row.status !== "Refunded");
  const revenue = settled.reduce((total, row) => total + Number(row.amount), 0);
  const productTotals = productRows.map((product) => {
    const rows = settled.filter((row) => row.product_id === product.id || row.product_name === product.name);
    return { name: product.name, category: product.category, sales: rows.length, revenue: rows.reduce((total, row) => total + Number(row.amount), 0) };
  }).sort((a, b) => b.revenue - a.revenue);
  const topRevenue = productTotals[0]?.revenue ?? 0;

  const year = new Date().getFullYear();
  const activityFeed: ActivityView[] = [
    ...txns.slice(0, 4).map<ActivityView>((row) => ({ id: `t-${row.id}`, title: row.status === "Completed" ? "Payment received" : `Order ${row.status.toLowerCase()}`, detail: `${row.customer_name} · ${row.product_name}`, time: relativeTime(row.occurred_at), kind: row.status === "Completed" ? "payment" : "order" })),
    ...customers.slice(0, 3).map<ActivityView>((row) => ({ id: `c-${row.id}`, title: "New customer added", detail: `${row.name} · ${row.plan}`, time: relativeTime(row.created_at), kind: "customer" })),
  ].slice(0, 6);

  return {
    kpis: {
      revenue,
      orders: txns.length,
      customers: customers.length,
      conversion: customers.length ? Math.min((txns.length / customers.length) * 100, 100) : 0,
    },
    revenueSeries: { "7d": bucketRevenue(txns, "7d"), "30d": bucketRevenue(txns, "30d"), "90d": bucketRevenue(txns, "90d"), "1y": bucketRevenue(txns, "1y") },
    salesSeries: buildSales(txns),
    salesLabels: { current: String(year), previous: String(year - 1) },
    transactions: txns.slice(0, 12).map((row) => ({ id: row.id, reference: row.reference, customer: row.customer_name, initials: initials(row.customer_name), product: row.product_name, amount: Number(row.amount), status: row.status, date: shortDate(row.occurred_at) })),
    products: productTotals.map((product) => ({ ...product, progress: topRevenue ? Math.max(Math.round((product.revenue / topRevenue) * 100), 4) : 0 })),
    activities: activityFeed,
    hasExpenses: false,
  };
}

export const demoSnapshot: BusinessSnapshot = {
  kpis: { revenue: 2482400, orders: 12842, customers: 8492, conversion: 6.84 },
  revenueSeries: revenueData,
  salesSeries: salesData.map((point) => ({ month: point.month, current: point.y2026, previous: point.y2025 })),
  salesLabels: { current: "2026", previous: "2025" },
  transactions: demoTransactions.map((item) => ({ id: item.id, reference: item.id, customer: item.customer, initials: item.initials, product: item.product, amount: item.amount, status: item.status, date: item.date })),
  products: demoProducts,
  activities: activities,
  hasExpenses: true,
};
