import { getAdminStats, getGlobalRecentScans, getScanDistribution, getDailyStats } from "@/app/actions/admin";
import DashboardClient from "@/components/admin/DashboardClient";

export default async function AdminDashboard() {
  const [stats, recentScans, distribution, dailyActivity] = await Promise.all([
    getAdminStats(),
    getGlobalRecentScans(10),
    getScanDistribution(),
    getDailyStats()
  ]);

  return (
    <DashboardClient 
      stats={stats} 
      recentScans={recentScans} 
      distribution={distribution}
      dailyActivity={dailyActivity}
    />
  );
}
