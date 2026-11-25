import { listAdminReimbursements } from "@/lib/reimbursements";
import { ReimbursementsManager } from "@/features/requests/ReimbursementsManager";

export const dynamic = "force-dynamic";

export default async function AdminReimbursementsPage() {
  const rows = await listAdminReimbursements();
  return <ReimbursementsManager mode="admin" rows={rows} />;
}
