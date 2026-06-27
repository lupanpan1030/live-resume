import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/app/login/login-form";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner login",
};

export default async function LoginPage() {
  const session = await getSession();

  return (
    <main className="folio-page flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[1.5rem] border border-white/60 bg-white/82 p-6 shadow-[0_22px_56px_rgba(23,35,53,0.08)] backdrop-blur-md sm:p-8">
        <LoginForm isSignedIn={Boolean(session)} />

        <div className="mt-8 border-t border-[color:var(--folio-line)] pt-5">
          <Link
            className="text-sm font-medium text-[color:var(--folio-muted)] transition-colors hover:text-[color:var(--folio-accent-2)]"
            href="/"
          >
            Back to resume
          </Link>
        </div>
      </div>
    </main>
  );
}
