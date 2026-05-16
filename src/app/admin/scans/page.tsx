import { getAllScans } from "@/app/actions/admin";
import ScansClient from "./ScansClient";

export default async function ScansPage() {
  const { scans, totalCount } = await getAllScans(50);

  return <ScansClient scans={scans} totalCount={totalCount} />;
}
