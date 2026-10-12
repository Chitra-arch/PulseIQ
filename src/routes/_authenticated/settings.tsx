import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database, Settings } from "lucide-react";
import { SectionPage } from "@/features/shared/section-page";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUIStore } from "@/store/ui-store";
import { seedStarterData } from "@/features/data/seed";
import { useBusinessData } from "@/features/data/use-business-data";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — PulseIQ" }, { name: "description", content: "Manage your PulseIQ workspace preferences." }, { property: "og:title", content: "Settings — PulseIQ" }, { property: "og:description", content: "Manage your PulseIQ workspace preferences." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const theme = useUIStore((s) => s.theme);
  const toggle = useUIStore((s) => s.toggleTheme);
  const mode = useUIStore((s) => s.dataMode);
  const setMode = useUIStore((s) => s.setDataMode);
  const { isEmpty } = useBusinessData();
  const queryClient = useQueryClient();
  const [seeding, setSeeding] = useState(false);

  const seed = async () => {
    setSeeding(true);
    try { const r = await seedStarterData(); await queryClient.invalidateQueries(); setMode("live"); toast.success(`Added ${r.customers} customers, ${r.products} products, ${r.transactions} transactions`); }
    catch (e) { toast.error((e as Error).message); } finally { setSeeding(false); }
  };

  return <SectionPage eyebrow="Settings" title="Workspace settings" description="Choose your data source and how PulseIQ looks." icon={Settings} metrics={[{ label: "Data source", value: mode === "live" ? "Your data" : "Sample", detail: "Switch below" }, { label: "Theme", value: theme === "dark" ? "Dark" : "Light", detail: "Saved on this device" }, { label: "Live updates", value: "On", detail: "Refreshes automatically" }]}>
    <section className="panel mt-5 p-6">
      <div className="flex items-start gap-4"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Database className="size-4" /></span>
        <div className="flex-1"><h2 className="text-lg font-bold">Use my business data</h2><p className="mt-1 text-sm text-muted-foreground">When on, every page shows your real customers, products and transactions. Off shows sample figures.</p></div>
        <Switch aria-label="Use my business data" checked={mode === "live"} onCheckedChange={(v) => setMode(v ? "live" : "demo")} />
      </div>
      {isEmpty && <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/35 p-4"><p className="flex-1 text-sm text-muted-foreground">Your workspace is empty. Load a starter set of records to try things out.</p><Button variant="premium" size="sm" disabled={seeding} onClick={seed}>{seeding ? "Loading..." : "Load starter data"}</Button></div>}
    </section>
    <section className="panel mt-4 p-6"><h2 className="text-lg font-bold">Appearance</h2><p className="mt-2 text-sm text-muted-foreground">PulseIQ is currently using the {theme} theme.</p><Button className="mt-5" variant="outline" onClick={toggle}>Switch to {theme === "dark" ? "light" : "dark"} mode</Button></section>
  </SectionPage>;
}
