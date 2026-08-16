"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, FileText } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Reveal } from "@/components/motion/reveal";

type Mode = "sign-in" | "sign-up" | "forgot";

const COPY: Record<Mode, { title: string; description: string; submit: string }> = {
  "sign-in": {
    title: "Sign in",
    description:
      "Staff: use the email your admin set up for you. Admins: your usual login.",
    submit: "Sign in",
  },
  "sign-up": {
    title: "Create your account",
    description:
      "You'll be set up as the admin for a new organization in the next step.",
    submit: "Create account",
  },
  forgot: {
    title: "Reset your password",
    description: "We'll email you a link to set a new one.",
    submit: "Send reset link",
  },
};

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginForm />
    </React.Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const initialMode: Mode =
    searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";

  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [info, setInfo] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  function switchTo(nextMode: Mode) {
    setError(null);
    setInfo(null);
    setMode(nextMode);
  }

  async function routeSignedInUser(supabase: ReturnType<typeof createClient>) {
    if (next) {
      router.push(next);
      router.refresh();
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: employee } = await supabase
      .from("employees")
      .select("role")
      .eq("id", user?.id ?? "")
      .maybeSingle();

    if (!employee) {
      router.push("/onboarding");
    } else if (employee.role === "staff") {
      router.push("/dashboard");
    } else {
      router.push("/admin");
    }
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setInfo(
        "Check your inbox for a reset link. It expires in an hour — request another if it lapses."
      );
      return;
    }

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      await routeSignedInUser(supabase);
      return;
    }

    // sign-up
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setInfo(
        "Check your inbox to confirm your email, then sign in — we'll walk you through setting up your organization next."
      );
      setMode("sign-in");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  const copy = COPY[mode];

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <Reveal className="w-full max-w-sm" distance={14} duration={0.45}>
        <div className="glitch-card">
          <div className="glitch-card__header flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2 text-primary">
              <FileText className="size-4" strokeWidth={1.75} />
              <span className="font-label" style={{ color: "var(--primary)" }}>
                Activ_HR_Auth
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-white/10" />
              <span className="size-2 rounded-full bg-white/10" />
              <span className="size-2 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="p-6">
            <h1 className="mb-1 font-serif text-xl text-white">{copy.title}</h1>
            <p className="mb-6 text-sm" style={{ color: "var(--pac-paper)", opacity: 0.6 }}>
              {copy.description}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="glitch-field">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                />
                <label htmlFor="email" data-text="EMAIL">EMAIL</label>
              </div>

              {mode !== "forgot" && (
                <div className="glitch-field">
                  <input
                    id="password"
                    type="password"
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="password" data-text="PASSWORD">PASSWORD</label>
                </div>
              )}

              {mode === "sign-in" && (
                <button
                  type="button"
                  onClick={() => switchTo("forgot")}
                  className="-mt-3 self-end font-label text-white/40 hover:text-primary"
                >
                  Forgot password?
                </button>
              )}

              {info && (
                <p className="text-sm" style={{ color: "var(--pac-orange-light)" }}>
                  {info}
                </p>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                data-text={copy.submit}
                className="glitch-submit"
              >
                <span className="glitch-submit__text">
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  {copy.submit}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  switchTo(
                    mode === "sign-in"
                      ? "sign-up"
                      : mode === "sign-up"
                        ? "sign-in"
                        : "sign-in"
                  )
                }
                className="text-center font-label text-white/40 hover:text-white/70"
              >
                {mode === "sign-in" && "New here? Create an organization"}
                {mode === "sign-up" && "Already have an account? Sign in"}
                {mode === "forgot" && "Back to sign in"}
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </div>
  );
}