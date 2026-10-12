import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "./app-sidebar";
import { BackgroundOverlay } from "./background-overlay";
import { DashboardTour } from "@/features/tour/dashboard-tour";
import { TopNav } from "./top-nav";
import { CommandSearch } from "@/features/search/command-search";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useLiveUpdates } from "@/features/data/use-business-data";
import { useUIStore } from "@/store/ui-store";

export function AppShell({ children }: { children: ReactNode }) {
  const hydrateTheme = useUIStore((state) => state.hydrateTheme);
  useEffect(() => hydrateTheme(), [hydrateTheme]);
  useLiveUpdates();

  return (
    <SidebarProvider defaultOpen>
      <motion.div className="flex min-h-svh w-full bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        <BackgroundOverlay />
        <ResponsiveSidebarState />
        <AppSidebar />
        <SidebarInset className="relative z-10 min-w-0 overflow-hidden bg-transparent">
          <TopNav />
          <div className="min-w-0 flex-1">{children}</div>
        </SidebarInset>
        <CommandSearch />
        <DashboardTour />
        <Toaster position="top-right" />
      </motion.div>
    </SidebarProvider>
  );
}


function ResponsiveSidebarState() {
  const { setOpen } = useSidebar();
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const sync = () => setOpen(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [setOpen]);
  return null;
}