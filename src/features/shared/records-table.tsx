import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";

export interface Column<T> { header: string; cell: (row: T) => React.ReactNode; align?: "right" }

interface RecordsTableProps<T> { rows: T[]; columns: Column<T>[]; getKey: (row: T) => string; onEdit?: (row: T) => void; onDelete?: (row: T) => void; empty: string; minWidth?: number }

export function RecordsTable<T>({ rows, columns, getKey, onEdit, onDelete, empty, minWidth = 720 }: RecordsTableProps<T>) {
  if (rows.length === 0) return <p className="px-6 py-12 text-center text-sm text-muted-foreground">{empty}</p>;
  return <div className="overflow-x-auto">
    <table className="w-full text-left text-sm" style={{ minWidth }}>
      <thead className="border-y border-border bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr>
        {columns.map((column) => <th key={column.header} className={`px-5 py-3 font-semibold ${column.align === "right" ? "text-right" : ""}`}>{column.header}</th>)}
        {(onEdit || onDelete) && <th className="px-5 py-3 text-right font-semibold">Actions</th>}
      </tr></thead>
      <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
        {rows.map((row) => <motion.tr key={getKey(row)} variants={fadeUp} className="border-b border-border/70 transition-colors last:border-0 hover:bg-muted/35">
          {columns.map((column) => <td key={column.header} className={`px-5 py-4 ${column.align === "right" ? "text-right" : ""}`}>{column.cell(row)}</td>)}
          {(onEdit || onDelete) && <td className="px-5 py-4"><div className="flex justify-end gap-1">
            {onEdit && <Button variant="ghost" size="icon" aria-label="Edit record" onClick={() => onEdit(row)}><Pencil /></Button>}
            {onDelete && <Button variant="ghost" size="icon" aria-label="Delete record" onClick={() => onDelete(row)}><Trash2 /></Button>}
          </div></td>}
        </motion.tr>)}
      </motion.tbody>
    </table>
  </div>;
}
