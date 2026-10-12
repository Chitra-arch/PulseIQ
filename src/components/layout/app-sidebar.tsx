import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, Boxes, ChartNoAxesCombined, LayoutDashboard, LogOut, Package, ReceiptText, Settings, Users, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { staggerContainer, slideIn } from "@/lib/motion";
import { useAccountIdentity } from "@/hooks/use-account-identity";
import { useQueryClient } from "@tanstack/react-query";

const items = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", to: "/analytics", icon: ChartNoAxesCombined },
  { label: "Sales", to: "/sales", icon: BarChart3 },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Products", to: "/products", icon: Package },
  { label: "Reports", to: "/reports", icon: ReceiptText },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { setOpenMobile } = useSidebar();
  const user = useAccountIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }
  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="h-[73px] justify-center border-b border-sidebar-border px-4">
        <motion.div variants={slideIn} initial="hidden" animate="visible" className="flex items-center gap-3 overflow-hidden">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-brand"><Zap className="size-4 text-primary-foreground" fill="currentColor" /></span>
          <span className="text-xl font-extrabold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Pulse<span className="text-gradient-brand">IQ</span></span>
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-5">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-3 uppercase text-[10px] font-bold tracking-[0.16em]">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                  const active = pathname === item.to;
                  return <motion.div key={item.to} variants={slideIn}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={item.label} isActive={active} className="h-10 rounded-xl px-3 data-[active=true]:shadow-sm">
                        <Link to={item.to} onClick={() => setOpenMobile(false)}><item.icon /><span>{item.label}</span>{active && <motion.span layoutId="active-nav" className="ml-auto h-4 w-0.5 rounded-full bg-primary" />}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>;
                })}
              </SidebarMenu>
            </motion.div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={user.name} className="h-12 rounded-xl">
              <Avatar className="size-8"><AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">{user.initials}</AvatarFallback></Avatar>
              <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{user.name}</span><span className="block truncate text-[11px] text-muted-foreground">{user.email}</span></span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem><SidebarMenuButton tooltip="Logout" className="h-10 text-muted-foreground" onClick={signOut}><LogOut /><span>Logout</span></SidebarMenuButton></SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}