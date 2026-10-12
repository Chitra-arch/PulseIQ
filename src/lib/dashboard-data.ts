export type TransactionStatus = "Completed" | "Pending" | "Failed" | "Refunded";
export type ChartRange = "7d" | "30d" | "90d" | "1y";

export interface RevenuePoint { label: string; revenue: number; expenses: number }
export interface Transaction { id: string; customer: string; initials: string; product: string; amount: number; status: TransactionStatus; date: string }
export interface Product { name: string; category: string; sales: number; revenue: number; progress: number }
export interface Activity { id: string; title: string; detail: string; time: string; kind: "customer" | "order" | "upgrade" | "payment" | "product" }
export interface NotificationItem { id: string; title: string; detail: string; time: string; unread: boolean }

export const revenueData: Record<ChartRange, RevenuePoint[]> = {
  "7d": [
    { label: "25 Aug", revenue: 285000, expenses: 148000 }, { label: "26 Aug", revenue: 332000, expenses: 161000 },
    { label: "27 Aug", revenue: 310000, expenses: 152000 }, { label: "28 Aug", revenue: 385000, expenses: 174000 },
    { label: "29 Aug", revenue: 418000, expenses: 188000 }, { label: "30 Aug", revenue: 397000, expenses: 181000 },
    { label: "31 Aug", revenue: 462000, expenses: 196000 },
  ],
  "30d": Array.from({ length: 10 }, (_, index) => ({ label: `${index * 3 + 1} Aug`, revenue: 180000 + index * 23000 + (index % 3) * 31000, expenses: 105000 + index * 9000 + (index % 2) * 18000 })),
  "90d": ["Jun 1", "Jun 15", "Jul 1", "Jul 15", "Aug 1", "Aug 15", "Aug 31"].map((label, index) => ({ label, revenue: 820000 + index * 112000 + (index % 2) * 90000, expenses: 490000 + index * 48000 })),
  "1y": ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((label, index) => ({ label, revenue: 1420000 + index * 97000 + (index % 3) * 150000, expenses: 780000 + index * 52000 + (index % 2) * 75000 })),
};

export const salesData = [
  { month: "Jan", y2025: 1180, y2026: 1530 }, { month: "Feb", y2025: 1340, y2026: 1690 },
  { month: "Mar", y2025: 1290, y2026: 1880 }, { month: "Apr", y2025: 1510, y2026: 2010 },
  { month: "May", y2025: 1640, y2026: 2180 }, { month: "Jun", y2025: 1720, y2026: 2310 },
  { month: "Jul", y2025: 1880, y2026: 2490 }, { month: "Aug", y2025: 2010, y2026: 2742 },
];

export const transactions: Transaction[] = [
  { id: "TXN-8421", customer: "Arjun Mehta", initials: "AM", product: "Growth Plan", amount: 18500, status: "Completed", date: "Aug 31" },
  { id: "TXN-8418", customer: "Priya Sharma", initials: "PS", product: "Enterprise", amount: 48000, status: "Completed", date: "Aug 30" },
  { id: "TXN-8412", customer: "John Smith", initials: "JS", product: "Pro Plan", amount: 12500, status: "Completed", date: "Aug 30" },
  { id: "TXN-8407", customer: "Sarah Lee", initials: "SL", product: "Enterprise", amount: 28000, status: "Pending", date: "Aug 29" },
  { id: "TXN-8399", customer: "Kavya Iyer", initials: "KI", product: "Starter Plan", amount: 6500, status: "Refunded", date: "Aug 28" },
  { id: "TXN-8394", customer: "Rohan Kapoor", initials: "RK", product: "Growth Plan", amount: 18500, status: "Failed", date: "Aug 28" },
];

export const products: Product[] = [
  { name: "Enterprise Suite", category: "Annual plan", sales: 3842, revenue: 864000, progress: 92 },
  { name: "Growth Plan", category: "Monthly plan", sales: 2918, revenue: 612000, progress: 78 },
  { name: "Pro Analytics", category: "Add-on", sales: 2341, revenue: 448000, progress: 64 },
  { name: "Starter Plan", category: "Monthly plan", sales: 1876, revenue: 284000, progress: 51 },
];

export const activities: Activity[] = [
  { id: "a1", title: "New customer registered", detail: "Neha Bansal joined Enterprise", time: "8 min ago", kind: "customer" },
  { id: "a2", title: "Order completed", detail: "Order #PI-8421 · ₹18,500", time: "24 min ago", kind: "order" },
  { id: "a3", title: "Subscription upgraded", detail: "Zenith Labs moved to Growth", time: "1 hr ago", kind: "upgrade" },
  { id: "a4", title: "Payment received", detail: "Nimbus Retail · ₹48,000", time: "2 hrs ago", kind: "payment" },
  { id: "a5", title: "Product purchased", detail: "Pro Analytics by Arka Studio", time: "3 hrs ago", kind: "product" },
];

export const notifications: NotificationItem[] = [
  { id: "n1", title: "Revenue milestone reached", detail: "August revenue crossed ₹24 lakh.", time: "12 min", unread: true },
  { id: "n2", title: "New enterprise customer", detail: "Neha Bansal started an Enterprise plan.", time: "1 hr", unread: true },
  { id: "n3", title: "Weekly report ready", detail: "Your performance digest is ready to view.", time: "Yesterday", unread: false },
];

export const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);