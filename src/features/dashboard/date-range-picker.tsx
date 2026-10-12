import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUIStore } from "@/store/ui-store";
import type { ChartRange } from "@/lib/dashboard-data";

const presets: { label: string; range: ChartRange; days: number }[] = [{ label: "7 days", range: "7d", days: 7 }, { label: "30 days", range: "30d", days: 30 }, { label: "90 days", range: "90d", days: 90 }, { label: "1 year", range: "1y", days: 365 }];

export function DateRangePicker() {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2026, 7, 1), to: new Date(2026, 7, 31) });
  const setRange = useUIStore((state) => state.setRange);
  const selectPreset = (preset: typeof presets[number]) => {
    const to = new Date(2026, 7, 31); const from = new Date(to); from.setDate(to.getDate() - preset.days + 1);
    setDate({ from, to }); setRange(preset.range);
  };
  return <Popover><PopoverTrigger asChild><Button variant="outline" className="hidden h-10 bg-card shadow-none md:flex"><CalendarDays /><span>{date?.from && date?.to ? `${format(date.from, "MMM d")} – ${format(date.to, "MMM d, yyyy")}` : "Select dates"}</span></Button></PopoverTrigger><PopoverContent align="end" className="w-auto rounded-xl p-0"><div className="flex border-b border-border p-2">{presets.map((preset) => <Button key={preset.range} variant="ghost" size="sm" onClick={() => selectPreset(preset)}>{preset.label}</Button>)}</div><Calendar mode="range" selected={date} onSelect={setDate} numberOfMonths={2} className="pointer-events-auto p-3 max-md:[--cell-size:1.75rem]" /></PopoverContent></Popover>;
}