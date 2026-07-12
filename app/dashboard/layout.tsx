import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function getUserDisplayName(
  fullName: unknown,
  email: string | undefined
) {
  if (typeof fullName === "string" && fullName.trim().length > 0) {
    return fullName.trim();
  }

  if (email) {
    return email.split("@")[0];
  }

  return "SkillPath User";
}

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = getUserDisplayName(
    user.user_metadata.full_name,
    user.email
  );

  return (
    <DashboardShell
      userEmail={user.email ?? ""}
      userName={displayName}
    >
      {children}
    </DashboardShell>
  );
}
