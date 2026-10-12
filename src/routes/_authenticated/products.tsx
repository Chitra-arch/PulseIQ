import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/features/products/products-page";

export const Route = createFileRoute("/_authenticated/products")({ head:()=>({meta:[{title:"Products — PulseIQ"},{name:"description",content:"Compare product sales, revenue, and adoption."},{property:"og:title",content:"Products — PulseIQ"},{property:"og:description",content:"Compare product sales, revenue, and adoption."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component: ProductsPage });
