import { PasswordField } from "../../login/PasswordField";
import { SubmitAction } from "../SubmitAction";
import { hasCustomPassword, loadOwnerRecord } from "@/lib/credentials";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth";
import { cardPanel, chipPrimary } from "../ui";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  rate: "Too many attempts. Wait a few minutes and try again.",
  current: "Current password is incorrect.",
  mismatch: "New password and confirmation don't match.",
  same: "Pick a password that's different from the current one.",
  config:
    "Admin login is not configured. Set OWNER_USERNAME and OWNER_PASSWORD_HASH.",
  save: "Couldn't save the new password. Try again.",
};

export default async function AccountPage({
  searchParams,
}: PageProps<"/admin/account">) {
  const sp = await searchParams;
  const custom = await hasCustomPassword();
  const username = (await loadOwnerRecord())?.username ?? "admin";
  const errorParam = typeof sp.error === "string" ? sp.error : null;
  const error =
    errorParam &&
    (ERRORS[errorParam] ?? (errorParam.length > 3 ? errorParam : null));

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="display text-[2rem] text-cream">Account</h1>
        <p className="mt-1 text-sm text-cream/55">
          Set the password you&apos;ll use to sign in. Username stays{" "}
          <span className="font-medium text-cream">{username}</span>.
        </p>
      </div>

      {!custom && (
        <p className="rounded-[10px] border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-bright">
          You&apos;re still on the studio-issued password. Set your own so only
          you can sign in.
        </p>
      )}

      {sp.saved && (
        <p
          role="status"
          className="rounded-[10px] border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
        >
          Password updated. Use it the next time you sign in.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <div className={cardPanel}>
        <SubmitAction
          action="/api/admin/password"
          label="Update password"
          pendingLabel="Saving…"
          className={`${chipPrimary} mt-5`}
        >
          <div className="space-y-4">
            <PasswordField
              id="current"
              name="current"
              label="Current password"
              autoComplete="current-password"
            />
            <PasswordField
              id="next"
              name="next"
              label="New password"
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
            />
            <PasswordField
              id="confirm"
              name="confirm"
              label="Confirm new password"
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
            />
            <p className="text-xs text-cream/45">
              At least {MIN_PASSWORD_LENGTH} characters, no spaces.
            </p>
          </div>
        </SubmitAction>
      </div>
    </div>
  );
}
