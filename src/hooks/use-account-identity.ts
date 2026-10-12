import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AccountIdentity = {
  name: string;
  email: string;
  initials: string;
};

const fallbackIdentity: AccountIdentity = { name: "You", email: "", initials: "?" };

function identityFromUser(user: { email?: string; user_metadata?: Record<string, unknown> } | null): AccountIdentity {
  if (!user) return fallbackIdentity;
  const savedName = typeof user.user_metadata?.["full_name"] === "string"
    ? user.user_metadata["full_name"].trim()
    : "";
  const email = user.email ?? "";
  const emailName = email.split("@")[0]?.replace(/[._-]+/g, " ").trim() ?? "";
  const rawName = savedName || emailName || "You";
  const name = rawName.replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase());
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";
  return { name, email, initials };
}

export function useAccountIdentity() {
  const [identity, setIdentity] = useState<AccountIdentity>(fallbackIdentity);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setIdentity(identityFromUser(data.user));
    });
    return () => { active = false; };
  }, []);

  return identity;
}
