// Server-side Supabase client (uses service role key — NEVER expose to browser)
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createServerClient() {
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
