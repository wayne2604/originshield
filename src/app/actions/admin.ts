"use server";

import { createServerClient } from "@/lib/supabase/server";
import { dbRowToScanResult } from "@/lib/supabase/mappers";
import type { DetectionType } from "@/types";
import { cookies } from "next/headers";

/**
 * Internal helper to verify if the current requester is an admin.
 * Uses database-driven RBAC via the 'profiles' table.
 */
async function verifyAdmin() {
  const supabase = createServerClient();
  const cookieStore = await cookies();
  
  const token = cookieStore.get("sb-access-token")?.value;
  
  if (!token) throw new Error("Unauthorized: No session found.");

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) throw new Error("Unauthorized: Invalid session.");

  // Check role in the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    throw new Error("Forbidden: Admin access only.");
  }

  return user;
}

export async function getAdminStats() {
  await verifyAdmin();
  const supabase = createServerClient();
  
  // Total Scans
  const { count: totalScans } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true });

  // Total Users (Unique user_ids in scans table)
  const { data: userData } = await supabase
    .from("scans")
    .select("user_id")
    .not("user_id", "is", null);
  
  const uniqueUsers = new Set(userData?.map(u => u.user_id)).size;

  // Success Rate (High/Medium confidence scans vs total)
  const { count: highConfidence } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true })
    .in("confidence_level", ["high", "medium"]);

  const successRate = totalScans ? (highConfidence || 0) / totalScans : 0;

  return {
    totalScans: totalScans || 0,
    totalUsers: uniqueUsers || 0,
    successRate: Math.round(successRate * 100),
  };
}

export async function getGlobalRecentScans(limit = 20) {
  await verifyAdmin();
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from("scans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(dbRowToScanResult);
}

export async function getScanDistribution() {
  await verifyAdmin();
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from("scans")
    .select("type");

  const distribution: Record<DetectionType, number> = {
    text: 0,
    image: 0,
    url: 0,
  };

  data?.forEach((row) => {
    const type = row.type as DetectionType;
    if (distribution[type] !== undefined) {
      distribution[type]++;
    }
  });

  return distribution;
}
