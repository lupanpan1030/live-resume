"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginFormProps = {
  isSignedIn: boolean;
};

export function LoginForm({ isSignedIn }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");

    if (typeof password !== "string" || !password) {
      setError("Enter the admin password.");
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ password }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        setError("Invalid credentials.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Sign in failed.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleLogout() {
    setError(null);
    setIsPending(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
    } catch {
      setError("Sign out failed.");
    } finally {
      setIsPending(false);
    }
  }

  if (isSignedIn) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--folio-soft)]">
            Owner session
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--folio-ink)]">
            You are signed in.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--folio-muted)]">
            Use the site normally, or sign out from this browser.
          </p>
        </div>

        <button
          type="button"
          className="folio-button-secondary"
          disabled={isPending}
          onClick={handleLogout}
        >
          <span>{isPending ? "Signing out" : "Sign out"}</span>
        </button>

        {error ? (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--folio-soft)]">
          Owner access
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--folio-ink)]">
          Sign in
        </h1>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-[color:var(--folio-ink)]">
          Password
        </span>
        <input
          autoComplete="current-password"
          className="mt-2 block w-full rounded-2xl border border-[color:var(--folio-line)] bg-white/80 px-4 py-3 text-base text-[color:var(--folio-ink)] outline-none transition focus:border-[color:var(--folio-accent)] focus:ring-4 focus:ring-[color:var(--folio-accent-soft)]"
          name="password"
          required
          type="password"
        />
      </label>

      <button className="folio-button w-full justify-center" disabled={isPending}>
        <span>{isPending ? "Signing in" : "Sign in"}</span>
      </button>

      {error ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
