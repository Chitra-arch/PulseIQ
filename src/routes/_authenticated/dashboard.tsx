import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard/dashboard-page";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — PulseIQ" },
    { name: "description", content: "Track revenue, sales, customers, and growth from your PulseIQ dashboard." },
    { property: "og:title", content: "Dashboard — PulseIQ" },
    { property: "og:description", content: "Track revenue, sales, customers, and growth from your PulseIQ dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: DashboardPage,
});
