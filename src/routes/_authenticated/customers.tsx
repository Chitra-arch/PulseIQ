import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/features/customers/customers-page";

export const Route = createFileRoute("/_authenticated/customers")({ head:()=>({meta:[{title:"Customers — PulseIQ"},{name:"description",content:"Track customer growth, value, and account activity."},{property:"og:title",content:"Customers — PulseIQ"},{property:"og:description",content:"Track customer growth, value, and account activity."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component: CustomersPage });
