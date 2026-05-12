import { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createServerClient, getAuthenticatedUser } from "@/lib/supabase/server";

type UsageAllowed = {
  status: "allow";
  user: User | null;
  ipAddress: string;
};

type UsageForbidden = {
  status: "forbidden";
  user: null;
  ipAddress: string;
};

export type UsageLimitResult = UsageAllowed | UsageForbidden;

const GUEST_SCAN_LIMIT = 3;

export function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwarded ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function checkUsageLimit(req: NextRequest): Promise<UsageLimitResult> {
  const user = await getAuthenticatedUser(req);
  const ipAddress = getClientIp(req);

  if (user) {
    return { status: "allow", user, ipAddress };
  }

  const supabase = createServerClient();
  const { count, error } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ipAddress)
    .is("user_id", null);

  if (error) {
    console.warn("[usage-limit/check]", error.message);
    return { status: "allow", user: null, ipAddress };
  }

  if ((count ?? 0) >= GUEST_SCAN_LIMIT) {
    return { status: "forbidden", user: null, ipAddress };
  }

  return { status: "allow", user: null, ipAddress };
}
