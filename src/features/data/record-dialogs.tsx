import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveRecord } from "./mutations";
import { useCustomers, useProducts } from "./use-business-data";
import type { CustomerRow, ProductRow, TransactionRow } from "@/lib/business-data";

const selectClass = "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-primary";
const plans = ["Starter Plan", "Pro Plan", "Growth Plan", "Enterprise"];
const statuses = ["Active", "Trial", "Churned"];
const txnStatuses = ["Completed", "Pending", "Failed", "Refunded"];
const categories = ["Monthly plan", "Annual plan", "Add-on", "One-off"];

interface DialogProps { open: boolean; onOpenChange: (open: boolean) => void }

export function CustomerDialog({ open, onOpenChange, record }: DialogProps & { record?: CustomerRow | null }) {
  const save = useSaveRecord("customers");
  const [form, setForm] = useState({ name: "", email: "", company: "", plan: plans[0]!, status: statuses[0]! });
  useEffect(() => { if (open) setForm({ name: record?.name ?? "", email: record?.email ?? "", company: record?.company ?? "", plan: record?.plan ?? plans[0]!, status: record?.status ?? statuses[0]! }); }, [open, record]);

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-md">
    <DialogHeader><DialogTitle>{record ? "Edit customer" : "Add customer"}</DialogTitle><DialogDescription>Saved straight to your live business data.</DialogDescription></DialogHeader>
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); save.mutate({ id: record?.id, values: { ...form, email: form.email || null, company: form.company || null } }, { onSuccess: () => onOpenChange(false) }); }}>
      <div className="grid gap-2"><Label htmlFor="c-name">Name</Label><Input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Arjun Mehta" /></div>
      <div className="grid gap-2"><Label htmlFor="c-email">Email</Label><Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="arjun@company.in" /></div>
      <div className="grid gap-2"><Label htmlFor="c-company">Company</Label><Input id="c-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Zenith Labs" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2"><Label htmlFor="c-plan">Plan</Label><select id="c-plan" className={selectClass} value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>{plans.map((plan) => <option key={plan}>{plan}</option>)}</select></div>
        <div className="grid gap-2"><Label htmlFor="c-status">Status</Label><select id="c-status" className={selectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>
      </div>
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" variant="premium" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save customer"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}

export function ProductDialog({ open, onOpenChange, record }: DialogProps & { record?: ProductRow | null }) {
  const save = useSaveRecord("products");
  const [form, setForm] = useState({ name: "", category: categories[0]!, price: "0" });
  useEffect(() => { if (open) setForm({ name: record?.name ?? "", category: record?.category ?? categories[0]!, price: String(record?.price ?? 0) }); }, [open, record]);

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-md">
    <DialogHeader><DialogTitle>{record ? "Edit product" : "Add product"}</DialogTitle><DialogDescription>Products power your revenue and top-seller panels.</DialogDescription></DialogHeader>
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); save.mutate({ id: record?.id, values: { name: form.name, category: form.category, price: Number(form.price) || 0 } }, { onSuccess: () => onOpenChange(false) }); }}>
      <div className="grid gap-2"><Label htmlFor="p-name">Product name</Label><Input id="p-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Growth Plan" /></div>
      <div className="grid gap-2"><Label htmlFor="p-category">Category</Label><select id="p-category" className={selectClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
      <div className="grid gap-2"><Label htmlFor="p-price">Price (₹)</Label><Input id="p-price" type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" variant="premium" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save product"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}

export function TransactionDialog({ open, onOpenChange, record }: DialogProps & { record?: TransactionRow | null }) {
  const save = useSaveRecord("transactions");
  const customers = useCustomers();
  const products = useProducts();
  const [form, setForm] = useState({ customerId: "", customerName: "", productId: "", productName: "", amount: "0", status: txnStatuses[0]!, occurredAt: new Date().toISOString().slice(0, 10) });
  useEffect(() => {
    if (!open) return;
    setForm({
      customerId: record?.customer_id ?? "", customerName: record?.customer_name ?? "",
      productId: record?.product_id ?? "", productName: record?.product_name ?? "",
      amount: String(record?.amount ?? 0), status: record?.status ?? txnStatuses[0]!,
      occurredAt: (record?.occurred_at ?? new Date().toISOString()).slice(0, 10),
    });
  }, [open, record]);

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-md">
    <DialogHeader><DialogTitle>{record ? "Edit transaction" : "Record transaction"}</DialogTitle><DialogDescription>New transactions appear on the dashboard instantly.</DialogDescription></DialogHeader>
    <form className="grid gap-4" onSubmit={(event) => {
      event.preventDefault();
      save.mutate({ id: record?.id, values: {
        customer_id: form.customerId || null, customer_name: form.customerName,
        product_id: form.productId || null, product_name: form.productName,
        amount: Number(form.amount) || 0, status: form.status, occurred_at: new Date(form.occurredAt).toISOString(),
      } }, { onSuccess: () => onOpenChange(false) });
    }}>
      <div className="grid gap-2"><Label htmlFor="t-customer">Customer</Label><select id="t-customer" required className={selectClass} value={form.customerId} onChange={(e) => { const found = customers.data?.find((row) => row.id === e.target.value); setForm({ ...form, customerId: e.target.value, customerName: found?.name ?? "" }); }}><option value="">Select a customer</option>{customers.data?.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></div>
      <div className="grid gap-2"><Label htmlFor="t-product">Product</Label><select id="t-product" required className={selectClass} value={form.productId} onChange={(e) => { const found = products.data?.find((row) => row.id === e.target.value); setForm({ ...form, productId: e.target.value, productName: found?.name ?? "", amount: found ? String(found.price) : form.amount }); }}><option value="">Select a product</option>{products.data?.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2"><Label htmlFor="t-amount">Amount (₹)</Label><Input id="t-amount" type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
        <div className="grid gap-2"><Label htmlFor="t-date">Date</Label><Input id="t-date" type="date" value={form.occurredAt} onChange={(e) => setForm({ ...form, occurredAt: e.target.value })} /></div>
      </div>
      <div className="grid gap-2"><Label htmlFor="t-status">Status</Label><select id="t-status" className={selectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{txnStatuses.map((status) => <option key={status}>{status}</option>)}</select></div>
      {(!customers.data?.length || !products.data?.length) && <p className="text-xs text-warning">Add at least one customer and one product first.</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" variant="premium" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save transaction"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}
