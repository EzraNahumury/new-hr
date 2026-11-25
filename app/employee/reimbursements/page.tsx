import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId } from "@/lib/hris";
import { listEmployeeReimbursements } from "@/lib/reimbursements";
import { ReimbursementsManager } from "@/features/requests/ReimbursementsManager";

export const dynamic = "force-dynamic";

export default async function EmployeeReimbursementsPage() {
  const session = await requireEmployeeSession();
  const profile = await getEmployeeByUserId(session.userId);
  const rows = profile ? await listEmployeeReimbursements(profile.id) : [];
  return <ReimbursementsManager mode="employee" rows={rows} />;
}
