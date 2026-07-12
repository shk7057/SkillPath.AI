import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Login | SkillPath.AI",
  description: "Login UI for SkillPath.AI"
};

export default async function LoginPage() {
  const authConfigured = isSupabaseConfigured();

  if (authConfigured) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <AuthShell
      eyebrow="Login"
      title="Return to your career prep workspace"
      description="Pick up where you left off with your roadmap, resume feedback, and interview practice."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-semibold text-slate-900">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm authConfigured={authConfigured} />
    </AuthShell>
  );
}
