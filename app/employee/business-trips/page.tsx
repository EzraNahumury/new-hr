import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId } from "@/lib/hris";
import { listEmployeeBusinessTrips } from "@/lib/business-trips";
import { BusinessTripsManager } from "@/features/requests/BusinessTripsManager";

export const dynamic = "force-dynamic";

export default async function EmployeeBusinessTripsPage() {
  const session = await requireEmployeeSession();
  const profile = await getEmployeeByUserId(session.userId);
  const rows = profile ? await listEmployeeBusinessTrips(profile.id) : [];
  return <BusinessTripsManager mode="employee" rows={rows} />;
}
