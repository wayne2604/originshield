"use server";

import { createServerClient } from "@/lib/supabase/server";
import { dbRowToScanResult } from "@/lib/supabase/mappers";
import type { DetectionType } from "@/types";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const supabase = createServerClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;
  
  if (!token) {
    console.error("verifyAdmin: Missing 'sb-access-token' cookie. Access denied.");
    throw new Error("Unauthorized: No session found. Please log in again.");
  }

  // Use the service client to verify the user's JWT token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    console.error("verifyAdmin: Token verification failed", authError?.message);
    throw new Error("Unauthorized: Invalid session. Please log in again.");
  }

  // Check the 'profiles' table for the admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    console.error("verifyAdmin: Insufficient permissions", { 
      userId: user.id, 
      role: profile?.role, 
      error: profileError?.message 
    });
    throw new Error("Forbidden: Admin access only.");
  }
  
  return user;
}

export async function getAdminStats() {
  await verifyAdmin();
  const supabase = createServerClient();

  // Total Scans
  const { count: totalScans } = await supabase.from("scans").select("*", { count: "exact", head: true });

  // Total Users (Unique user_ids in scans table)
  const { data: userData } = await supabase.from("scans").select("user_id").not("user_id", "is", null);
  const uniqueUsers = new Set(userData?.map(u => u.user_id)).size;

  // Detection Accuracy (High/Medium confidence scans vs total)
  const { count: highConfidence } = await supabase.from("scans").select("*", { count: "exact", head: true }).in("confidence_level", ["high", "medium"]);
  const successRate = totalScans ? (highConfidence || 0) / totalScans : 0;

  // Calculate real trends by comparing last 7 days vs previous 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 14);

  // Current period scans (last 7 days)
  const { count: currentPeriodScans } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  // Previous period scans (7-14 days ago)
  const { count: prevPeriodScans } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true })
    .gte("created_at", fourteenDaysAgo.toISOString())
    .lt("created_at", sevenDaysAgo.toISOString());

  // Current period users
  const { data: currentUsers } = await supabase
    .from("scans")
    .select("user_id")
    .not("user_id", "is", null)
    .gte("created_at", sevenDaysAgo.toISOString());
  const currentUniqueUsers = new Set(currentUsers?.map(u => u.user_id)).size;

  // Previous period users
  const { data: prevUsers } = await supabase
    .from("scans")
    .select("user_id")
    .not("user_id", "is", null)
    .gte("created_at", fourteenDaysAgo.toISOString())
    .lt("created_at", sevenDaysAgo.toISOString());
  const prevUniqueUsers = new Set(prevUsers?.map(u => u.user_id)).size;

  // Calculate trend percentages
  const calcTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  };

  const scansTrend = calcTrend(currentPeriodScans || 0, prevPeriodScans || 0);
  const usersTrend = calcTrend(currentUniqueUsers, prevUniqueUsers);

  return {
    totalScans: totalScans || 0,
    totalUsers: uniqueUsers || 0,
    successRate: Math.round(successRate * 100),
    scansTrend,
    usersTrend,
  };
}

export async function getGlobalRecentScans(limit = 20) {
  await verifyAdmin();
  const supabase = createServerClient();
  const { data } = await supabase.from("scans").select("*").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []).map(dbRowToScanResult);
}

export async function getScanDistribution() {
  await verifyAdmin();
  const supabase = createServerClient();
  const { data } = await supabase.from("scans").select("type");
  const distribution: Record<DetectionType, number> = { text: 0, image: 0, url: 0 };
  data?.forEach((row) => {
    const type = row.type as DetectionType;
    if (distribution[type] !== undefined) distribution[type]++;
  });
  return distribution;
}

export async function getDailyStats() {
  await verifyAdmin();
  const supabase = createServerClient();
  
  // Get last 7 days of scans
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data } = await supabase
    .from("scans")
    .select("created_at, user_id")
    .gte("created_at", sevenDaysAgo.toISOString());

  const dailyStats: Record<string, { scans: number; users: Set<string> }> = {};
  
  // Initialize last 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dailyStats[dateStr] = { scans: 0, users: new Set() };
  }

  data?.forEach(scan => {
    const dateStr = scan.created_at.split('T')[0];
    if (dailyStats[dateStr]) {
      dailyStats[dateStr].scans++;
      if (scan.user_id) dailyStats[dateStr].users.add(scan.user_id);
    }
  });

  return Object.entries(dailyStats)
    .map(([date, stats]) => ({
      name: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
      scans: stats.scans,
      users: stats.users.size,
      fullDate: date
    }))
    .sort((a, b) => a.fullDate.localeCompare(b.fullDate));
}

/**
 * Fetches all scans from the database for the admin scans page.
 */
export async function getAllScans(limit = 50) {
  await verifyAdmin();
  const supabase = createServerClient();

  const { data, count } = await supabase
    .from("scans")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(limit);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scans = (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id || "anonymous",
    type: row.type as string,
    result: row.verdict as string,
    confidence: row.truth_score as number,
    confidenceLevel: row.confidence_level as string,
    createdAt: row.created_at as string,
  }));

  return { scans, totalCount: count || 0 };
}

/**
 * Fetches all users with profiles from the database for the admin users page.
 */
export async function getAllUsers() {
  try {
    await verifyAdmin();
  } catch (error) {
    console.error("getAllUsers: Permission check failed", error);
    return [];
  }
  
  const supabase = createServerClient();

  console.log("Fetching profiles from 'profiles' table...");
  // Use * to get all available columns to avoid "column does not exist" errors
  let { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*");

  // Fallback: Check if the table is named 'profile' instead of 'profiles'
  if (profilesError && (profilesError.code === '42P01' || profilesError.message?.includes('not found'))) {
    console.log("Table 'profiles' not found, trying 'profile'...");
    const { data: altData, error: altError } = await supabase
      .from("profile")
      .select("*");
    
    profiles = altData;
    profilesError = altError;
  }

  if (profilesError) {
    console.error("Error fetching profiles (Full Details):", JSON.stringify(profilesError, null, 2));
    return [];
  }

  if (!profiles || profiles.length === 0) {
    console.log("No profiles found in the 'profiles' table.");
    return [];
  }

  console.log(`Successfully fetched ${profiles.length} profiles.`);

  // Get scan counts in bulk
  const { data: scanData } = await supabase
    .from("scans")
    .select("user_id");

  const scanCounts: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scanData?.forEach((scan: any) => {
    if (scan.user_id) {
      scanCounts[scan.user_id] = (scanCounts[scan.user_id] || 0) + 1;
    }
  });

  // Try to get user emails from auth admin API
  let emailMap: Record<string, { email: string; lastSignIn: string | null }> = {};
  try {
    console.log("Fetching auth users via Admin API...");
    const { data: { users: authUsers }, error: adminError } = await supabase.auth.admin.listUsers();
    
    if (adminError) {
      console.warn("auth.admin.listUsers error:", adminError.message);
    } else {
      console.log(`Found ${authUsers?.length || 0} auth users.`);
      authUsers?.forEach((u) => {
        emailMap[u.id] = {
          email: u.email || "Unknown",
          lastSignIn: u.last_sign_in_at || null,
        };
      });
    }
  } catch (err) {
    console.warn("auth.admin.listUsers catch error:", err);
  }

  return profiles.map((profile: any) => ({
    id: profile.id,
    email: emailMap[profile.id]?.email || profile.id.slice(0, 8) + "...",
    role: profile.role || "user",
    scanCount: scanCounts[profile.id] || 0,
    // Safely handle missing dates
    joinedAt: profile.created_at || new Date().toISOString(),
    lastSignIn: emailMap[profile.id]?.lastSignIn || null,
  }));
}

