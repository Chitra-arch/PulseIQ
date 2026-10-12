import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { buildLiveSnapshot, demoSnapshot, type BusinessSnapshot, type CustomerRow, type ProductRow, type ReportRow, type TransactionRow } from "@/lib/business-data";
import { useUIStore } from "@/store/ui-store";

async function fetchCustomers() {
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as CustomerRow[];
}
async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ProductRow[];
}
async function fetchTransactions() {
  const { data, error } = await supabase.from("transactions").select("*").order("occurred_at", { ascending: false }).limit(1000);
  if (error) throw error;
  return (data ?? []) as unknown as TransactionRow[];
}
async function fetchReports() {
  const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(20);
  if (error) throw error;
  return (data ?? []) as unknown as ReportRow[];
}

export function useCustomers() { return useQuery({ queryKey: ["customers"], queryFn: fetchCustomers }); }
export function useProducts() { return useQuery({ queryKey: ["products"], queryFn: fetchProducts }); }
export function useTransactions() { return useQuery({ queryKey: ["transactions"], queryFn: fetchTransactions }); }
export function useReports() { return useQuery({ queryKey: ["reports"], queryFn: fetchReports }); }

/** Subscribes to live database changes so the dashboard refreshes on its own. */
export function useLiveUpdates() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("pulseiq-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => queryClient.invalidateQueries({ queryKey: ["transactions"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, () => queryClient.invalidateQueries({ queryKey: ["customers"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => queryClient.invalidateQueries({ queryKey: ["products"] }))
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [queryClient]);
}

export interface BusinessData { snapshot: BusinessSnapshot; isDemo: boolean; isLoading: boolean; isEmpty: boolean }

export function useBusinessData(): BusinessData {
  const mode = useUIStore((state) => state.dataMode);
  const customers = useCustomers();
  const products = useProducts();
  const transactions = useTransactions();


  const isEmpty = !customers.data?.length && !products.data?.length && !transactions.data?.length;
  const isLoading = customers.isLoading || products.isLoading || transactions.isLoading;
  if (mode === "demo") return { snapshot: demoSnapshot, isDemo: true, isLoading: false, isEmpty };
  return {
    snapshot: buildLiveSnapshot(customers.data ?? [], products.data ?? [], transactions.data ?? []),
    isDemo: false,
    isLoading,
    isEmpty,
  };
}
