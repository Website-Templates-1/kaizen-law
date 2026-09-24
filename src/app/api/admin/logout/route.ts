import { NextResponse } from "next/server";
import { endSession } from "@/lib/auth";
import { sameOrigin, adminRedirect } from "@/lib/admin-guard";

export async function POST() {
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });
  await endSession();
  return adminRedirect("/admin/login");
}
