import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Table = "customers" | "products" | "transactions";
type Row = Record<string, unknown>;

function useInvalidate(table: Table) {
  const queryClient = useQueryClient();
  return () => { void queryClient.invalidateQueries({ queryKey: [table] }); };
}

export function useSaveRecord(table: Table) {
  const invalidate = useInvalidate(table);
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string | undefined; values: Row }) => {
      const query = id
        ? supabase.from(table).update(values as never).eq("id", id)
        : supabase.from(table).insert(values as never);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: (_result, variables) => { invalidate(); toast.success(variables.id ? "Changes saved" : "Record added"); },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteRecord(table: Table) {
  const invalidate = useInvalidate(table);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Record removed"); },
    onError: (error: Error) => toast.error(error.message),
  });
}
