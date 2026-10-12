import { create } from "zustand";
import type { ChartRange } from "@/lib/dashboard-data";

type Theme = "dark" | "light";
export type DataMode = "demo" | "live";
interface UIState {
  theme: Theme;
  dataMode: DataMode;
  range: ChartRange;
  searchOpen: boolean;
  hydrated: boolean;
  setRange: (range: ChartRange) => void;
  setSearchOpen: (open: boolean) => void;
  setDataMode: (mode: DataMode) => void;
  toggleTheme: () => void;
  hydrateTheme: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: "dark",
  dataMode: "demo",
  range: "30d",
  searchOpen: false,
  hydrated: false,
  setRange: (range) => set({ range }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setDataMode: (dataMode) => { localStorage.setItem("pulseiq-data-mode", dataMode); set({ dataMode }); },
  toggleTheme: () => {
    const theme = get().theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pulseiq-theme", theme);
    set({ theme });
  },
  hydrateTheme: () => {
    const saved = localStorage.getItem("pulseiq-theme") as Theme | null;
    const theme = saved === "light" ? "light" : "dark";
    const savedMode = localStorage.getItem("pulseiq-data-mode") as DataMode | null;
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme, dataMode: savedMode === "live" ? "live" : "demo", hydrated: true });
  },
}));
