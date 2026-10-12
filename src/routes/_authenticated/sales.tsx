import { createFileRoute } from "@tanstack/react-router";
import { SalesPage } from "@/features/sales/sales-page";

export const Route = createFileRoute("/_authenticated/sales")({ head:()=>({meta:[{title:"Sales — PulseIQ"},{name:"description",content:"Review orders, transaction status, and sales performance."},{property:"og:title",content:"Sales — PulseIQ"},{property:"og:description",content:"Review orders, transaction status, and sales performance."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component: SalesPage });
