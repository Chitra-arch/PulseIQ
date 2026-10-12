import { Bell, ChevronDown, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { notifications } from "@/lib/dashboard-data";
import { useUIStore } from "@/store/ui-store";
import { DateRangePicker } from "@/features/dashboard/date-range-picker";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAccountIdentity } from "@/hooks/use-account-identity";

export function TopNav() {
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAccountIdentity();
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }
  return (
    <header className="sticky top-0 z-30 grid h-[73px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6">
      <SidebarTrigger className="size-9" aria-label="Toggle navigation" />
      <div className="flex min-w-0 items-center md:max-w-sm">
        <Button variant="outline" onClick={() => setSearchOpen(true)} className="h-10 w-full min-w-0 justify-start border-border bg-card px-3 text-muted-foreground shadow-none">
          <Search className="shrink-0" /><span className="truncate">Search anything...</span><kbd className="ml-auto hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] sm:inline">⌘ K</kbd>
        </Button>
      </div>
      <nav className="flex shrink-0 items-center gap-1.5" aria-label="Account controls">
        <DateRangePicker />
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}><Sun className="hidden dark:block" /><Moon className="dark:hidden" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="relative" aria-label="Notifications"><Bell /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] rounded-xl p-2">
            <DropdownMenuLabel className="flex items-center justify-between px-2 py-2">Notifications <span className="text-xs font-normal text-muted-foreground">2 unread</span></DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((item) => <DropdownMenuItem key={item.id} className="items-start rounded-lg p-3"><span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.unread ? "bg-primary" : "bg-muted-foreground/30"}`} /><span className="grid gap-0.5"><span className="font-semibold">{item.title}</span><span className="text-xs text-muted-foreground">{item.detail}</span><span className="text-[10px] text-muted-foreground">{item.time}</span></span></DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-10 gap-2 px-1.5"><Avatar className="size-8"><AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">{user.initials}</AvatarFallback></Avatar><span className="hidden text-left lg:block"><span className="block text-xs font-semibold">{user.name}</span><span className="block max-w-32 truncate text-[10px] text-muted-foreground">{user.email}</span></span><ChevronDown className="hidden size-3 lg:block" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl p-2"><DropdownMenuLabel>My account</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem><User />Profile</DropdownMenuItem><DropdownMenuItem><Settings />Account Settings</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive" onSelect={signOut}><LogOut />Logout</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}