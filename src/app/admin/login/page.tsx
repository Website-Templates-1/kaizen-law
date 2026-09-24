import type { Metadata } from "next";
import Image from "next/image";
import { PasswordField } from "./PasswordField";
import { fieldInput, fieldLabel } from "../(panel)/ui";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const error =
    sp.error === "rate"
      ? "Too many attempts. Wait a minute and try again."
      : sp.error
        ? "Incorrect username or password."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-deep px-6 py-16 text-cream">
      <div className="w-full max-w-sm">
        <Image
          src="/brand/logo-on-dark-wordmark.png"
          alt="Kaizen Law"
          width={660}
          height={180}
          priority
          unoptimized
          className="mx-auto h-14 w-auto"
        />
        <p className="mt-6 text-center text-sm text-cream/55">
          Owner sign-in for reviewing and publishing Insights.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <form method="post" action="/api/admin/login" className="mt-7 space-y-4">
          <div>
            <label htmlFor="username" className={fieldLabel}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className={fieldInput}
            />
          </div>
          <PasswordField />
          <button
            type="submit"
            className="button button-gold mt-2 w-full justify-center"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
