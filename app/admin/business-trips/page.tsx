import { listAdminBusinessTrips } from "@/lib/business-trips";
import { BusinessTripsManager } from "@/features/requests/BusinessTripsManager";

export const dynamic = "force-dynamic";

export default async function AdminBusinessTripsPage() {
  const rows = await listAdminBusinessTrips();
  return <BusinessTripsManager mode="admin" rows={rows} />;
}
