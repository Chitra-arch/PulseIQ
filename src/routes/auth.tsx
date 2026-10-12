import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { BackgroundOverlay } from "@/components/layout/background-overlay";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — PulseIQ" },
    { name: "description", content: "Sign in or create your PulseIQ account to see your business analytics." },
    { property: "og:title", content: "Sign in — PulseIQ" },
    { property: "og:description", content: "Sign in or create your PulseIQ account to see your business analytics." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", localStorage.getItem("pulseiq-theme") !== "light");
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/dashboard", replace: true }); });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => { if (session) navigate({ to: "/dashboard", replace: true }); });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth`, data: { full_name: name.trim() } } });
        if (error) throw error;
        if (!data.session) toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setBusy(false); }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result?.error) toast.error(String(result.error.message ?? result.error));
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center bg-background px-4">
      <BackgroundOverlay />
      <div className="panel relative z-10 w-full max-w-sm p-7">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 text-muted-foreground"><Link to="/"><ArrowLeft />About PulseIQ</Link></Button>
        <div className="mb-6 flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground"><Activity className="size-4" /></span><span className="text-lg font-extrabold">PulseIQ</span></div>
        <h1 className="text-xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to see your business at a glance." : "Start tracking your business in minutes."}</p>
        <Button type="button" variant="outline" className="mt-6 w-full" onClick={google}>Continue with Google</Button>
        <div className="my-5 flex items-center gap-3 text-[11px] uppercase text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
        <form onSubmit={submit} className="grid gap-4">
          {mode === "signup" && <div className="grid gap-1.5"><Label htmlFor="name">Full name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>}
          <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="grid gap-1.5"><Label htmlFor="password">Password</Label><Input id="password" type="password" minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <Button type="submit" disabled={busy} className="w-full">{busy && <Loader2 className="animate-spin" />}{mode === "signin" ? "Sign in" : "Sign up"}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">{mode === "signin" ? "New to PulseIQ?" : "Already have an account?"}{" "}
          <button type="button" className="font-semibold text-primary hover:underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p>
      </div>
      <Toaster position="top-right" />
    </main>
  );
}
