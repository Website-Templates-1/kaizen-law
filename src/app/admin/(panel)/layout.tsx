import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { countUnansweredReviews } from "@/lib/review-api";
import { PanelNav } from "./PanelNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Independent re-check — never trust the proxy alone.
  if (!(await isAuthenticated())) redirect("/admin/login");

  let unansweredReviews = 0;
  try {
    unansweredReviews = await countUnansweredReviews();
  } catch {
    unansweredReviews = 0;
  }

  return (
    <div className="min-h-screen bg-ink-deep text-cream">
      <div className="mx-auto max-w-5xl px-6 py-8 pb-24">
        <PanelNav unansweredReviews={unansweredReviews} />
        {children}
      </div>
    </div>
  );
}
