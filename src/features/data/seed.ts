import { supabase } from "@/integrations/supabase/client";

const starterCustomers = [
  { name: "Arjun Mehta", email: "arjun@zenithlabs.in", company: "Zenith Labs", plan: "Growth Plan", status: "Active" },
  { name: "Priya Sharma", email: "priya@nimbusretail.in", company: "Nimbus Retail", plan: "Enterprise", status: "Active" },
  { name: "Rohan Kapoor", email: "rohan@arkastudio.in", company: "Arka Studio", plan: "Pro Plan", status: "Active" },
  { name: "Kavya Iyer", email: "kavya@meridianfoods.in", company: "Meridian Foods", plan: "Starter Plan", status: "Trial" },
  { name: "Neha Bansal", email: "neha@vertexhealth.in", company: "Vertex Health", plan: "Enterprise", status: "Active" },
];

const starterProducts = [
  { name: "Enterprise Suite", category: "Annual plan", price: 48000 },
  { name: "Growth Plan", category: "Monthly plan", price: 18500 },
  { name: "Pro Analytics", category: "Add-on", price: 12500 },
  { name: "Starter Plan", category: "Monthly plan", price: 6500 },
];

const statuses = ["Completed", "Completed", "Completed", "Pending", "Refunded"];

/** Copies a realistic starter set into the live workspace so the dashboard has something to show. */
export async function seedStarterData() {
  const { data: customers, error: customerError } = await supabase.from("customers").insert(starterCustomers as never).select("id, name");
  if (customerError) throw customerError;
  const { data: products, error: productError } = await supabase.from("products").insert(starterProducts as never).select("id, name, price");
  if (productError) throw productError;

  const rows = Array.from({ length: 48 }, (_, index) => {
    const customer = customers![index % customers!.length]!;
    const product = products![index % products!.length]! as { id: string; name: string; price: number };
    const daysAgo = Math.floor((index / 48) * 120);
    return {
      customer_id: customer.id, customer_name: customer.name,
      product_id: product.id, product_name: product.name,
      amount: Number(product.price),
      status: statuses[index % statuses.length]!,
      occurred_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    };
  });

  const { error: txnError } = await supabase.from("transactions").insert(rows as never);
  if (txnError) throw txnError;
  return { customers: customers!.length, products: products!.length, transactions: rows.length };
}
