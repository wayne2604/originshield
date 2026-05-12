import { NextRequest, NextResponse } from "next/server";
import { createServerClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { dbRowToScanResult } from "@/lib/supabase/mappers";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ scans: (data ?? []).map(dbRowToScanResult) });
}
