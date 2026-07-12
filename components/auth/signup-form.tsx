"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnvError } from "@/lib/supabase/env";

type SignupValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupErrors = Partial<Record<keyof SignupValues, string>>;

const initialValues: SignupValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

type SignupFormProps = {
  authConfigured: boolean;
};

export function SignupForm({ authConfigured }: SignupFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<SignupValues>(initialValues);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const validateField = (
    field: keyof SignupValues,
    value: string,
    allValues: SignupValues
  ) => {
    if (field === "fullName") {
      if (!value.trim()) return "Enter your full name.";
      if (value.trim().length < 3) return "Name should be at least 3 characters.";
    }

    if (field === "email") {
      if (!value.trim()) return "Enter your email address.";
      if (!/\S+@\S+\.\S+/.test(value)) return "Use a valid email format.";
    }

    if (field === "password") {
      if (!value.trim()) return "Create a password.";
      if (value.trim().length < 8) return "Password should be at least 8 characters.";
    }

    if (field === "confirmPassword") {
      if (!value.trim()) return "Confirm your password.";
      if (value !== allValues.password) return "Passwords do not match yet.";
    }

    return "";
  };

  const isValid = useMemo(() => {
    const requiredFieldsFilled = Object.values(values).every(
      (value) => value.trim().length > 0
    );

    return requiredFieldsFilled && Object.values(errors).every((value) => !value);
  }, [errors, values]);

  const updateField = (field: keyof SignupValues, value: string) => {
    setAuthError("");
    setAuthSuccess("");
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    setErrors((current) => ({
      ...current,
      [field]: submitted ? validateField(field, value, nextValues) : current[field],
      ...(field === "password" || field === "confirmPassword"
        ? {
            confirmPassword: submitted
              ? validateField(
                  "confirmPassword",
                  nextValues.confirmPassword,
                  nextValues
                )
              : current.confirmPassword
          }
        : {})
    }));
  };

  const handleBlur = (field: keyof SignupValues) => {
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, values[field], values),
      ...(field === "password"
        ? {
            confirmPassword: values.confirmPassword
              ? validateField(
                  "confirmPassword",
                  values.confirmPassword,
                  values
                )
              : current.confirmPassword
          }
        : {})
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setAuthError("");
    setAuthSuccess("");

    const nextErrors: SignupErrors = {
      fullName: validateField("fullName", values.fullName, values),
      email: validateField("email", values.email, values),
      password: validateField("password", values.password, values),
      confirmPassword: validateField(
        "confirmPassword",
        values.confirmPassword,
        values
      )
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

      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: {
            full_name: values.fullName.trim()
          },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/dashboard`
              : undefined
        }
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setAuthSuccess(
        "Account created. Check your email to confirm your signup before logging in."
      );
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to create your account right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      description="Set up your SkillPath.AI profile and start building a calmer, more focused job-prep routine."
    >
      <form className="space-y-1" onSubmit={handleSubmit} noValidate>
        <AuthInput
          id="signup-name"
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          value={values.fullName}
          onChange={(value) => updateField("fullName", value)}
          onBlur={() => handleBlur("fullName")}
          error={errors.fullName}
          hint="This can be updated later when real account settings exist."
        />

        <AuthInput
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(value) => updateField("email", value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          hint="We will use this for your account and future updates."
        />

        <AuthInput
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={values.password}
          onChange={(value) => updateField("password", value)}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          hint="Use 8 or more characters for the preview state."
        />

        <AuthInput
          id="signup-confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChange={(value) => updateField("confirmPassword", value)}
          onBlur={() => handleBlur("confirmPassword")}
          error={errors.confirmPassword}
          hint="Repeat the same password to clear the validation state."
        />

        <button
          type="submit"
          disabled={loading || !authConfigured}
          className="btn-primary mt-4 w-full"
        >
          {loading
            ? "Creating account..."
            : authConfigured
              ? "Sign up"
              : "Signup unavailable"}
        </button>

        <div
          role={authError ? "alert" : "status"}
          aria-live="polite"
          className={`mt-4 ${authError ? "state-note-error" : "state-note"}`}
        >
          {authError
            ? authError
            : authSuccess
              ? authSuccess
              : !authConfigured
                ? "Supabase auth is not configured yet. Add the required environment variables in .env.local to enable signup."
              : submitted && isValid
                ? "Account details look good. Submit to create your SkillPath.AI account."
                : "Create your account with email and password to unlock the dashboard."}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-slate-900">
            Log in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
