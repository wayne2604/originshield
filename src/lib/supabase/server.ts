// Server-side Supabase client (uses service role key — NEVER expose to browser)
import { createClient, type User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createServerClient() {
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function getAuthenticatedUser(req: NextRequest): Promise<User | null> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;

  return data.user;
}
