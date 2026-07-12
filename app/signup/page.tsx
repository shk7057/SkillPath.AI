import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign Up | SkillPath.AI",
  description: "Signup UI for SkillPath.AI"
};

export default async function SignupPage() {
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
      eyebrow="Sign Up"
      title="Create your SkillPath.AI account"
      description="Start with a focused setup designed for students and freshers preparing for jobs, skills, and interviews."
      footer={
        <>
          Already signed up?{" "}
          <Link href="/login" className="font-semibold text-slate-900">
            Go to login
          </Link>
        </>
      }
    >
      <SignupForm authConfigured={authConfigured} />
    </AuthShell>
  );
}
