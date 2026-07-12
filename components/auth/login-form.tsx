"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnvError } from "@/lib/supabase/env";

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

const initialValues: LoginValues = {
  email: "",
  password: ""
};

type LoginFormProps = {
  authConfigured: boolean;
};

export function LoginForm({ authConfigured }: LoginFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const isValid = useMemo(
    () =>
      values.email.trim().length > 0 &&
      values.password.trim().length > 0 &&
      Object.values(errors).every((value) => !value),
    [errors, values.email, values.password]
  );

  const validateField = (field: keyof LoginValues, value: string) => {
    if (field === "email") {
      if (!value.trim()) return "Enter your email address.";
      if (!/\S+@\S+\.\S+/.test(value)) return "Use a valid email format.";
    }

    if (field === "password") {
      if (!value.trim()) return "Enter your password.";
      if (value.trim().length < 8) return "Password should be at least 8 characters.";
    }

    return "";
  };

  const updateField = (field: keyof LoginValues, value: string) => {
    setAuthError("");
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: submitted ? validateField(field, value) : current[field]
    }));
  };

  const handleBlur = (field: keyof LoginValues) => {
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, values[field])
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setAuthError("");

    const nextErrors: LoginErrors = {
      email: validateField("email", values.email),
      password: validateField("password", values.password)
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    try {
      if (!authConfigured) {
        setAuthError(getSupabaseEnvError());
        return;
      }

      const supabase = createClient();
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to log in right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to continue tracking your skills, resume progress, and interview preparation."
    >
      <form className="space-y-1" onSubmit={handleSubmit} noValidate>
        <AuthInput
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(value) => updateField("email", value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          hint="Use the same email you signed up with."
        />

        <AuthInput
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={(value) => updateField("password", value)}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          hint="Password validation is shown for UI preview only."
        />

        <button
          type="submit"
          disabled={loading || !authConfigured}
          className="btn-primary mt-4 w-full"
        >
          {loading ? "Logging in..." : authConfigured ? "Login" : "Login unavailable"}
        </button>

        <div
          role={authError ? "alert" : "status"}
          aria-live="polite"
          className={`mt-4 ${authError ? "state-note-error" : "state-note"}`}
        >
          {authError
            ? authError
            : !authConfigured
              ? "Supabase auth is not configured yet. Add the required environment variables in .env.local to enable login."
            : submitted && isValid
              ? "Login successful. Redirecting to your dashboard..."
              : "Use your SkillPath.AI email and password to continue."}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-slate-900">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
