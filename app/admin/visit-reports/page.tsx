import { listVisitReports } from "@/lib/visit-reports";
import { VisitReportsAdmin } from "@/features/visit-reports/VisitReportsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminVisitReportsPage() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const startDate = `${y}-${m}-01`;
  const endDate = `${y}-${m}-${String(now.getDate()).padStart(2, "0")}`;
  const reports = await listVisitReports({ startDate, endDate });
  return <VisitReportsAdmin initialReports={reports} startDate={startDate} endDate={endDate} />;
}
