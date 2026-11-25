import { requireEmployeeSession } from "@/lib/auth";
import { listOvertimeForApprover } from "@/lib/overtime";
import { OvertimeManager } from "@/features/overtime/OvertimeManager";

export const dynamic = "force-dynamic";

export default async function EmployeeOvertimeApprovalsPage() {
  const emp = await requireEmployeeSession();
  const rows = await listOvertimeForApprover(emp.userId);
  return (
    <OvertimeManager
      rows={rows as never}
      canApprove
      apiBase="/api/employee/overtime-approvals"
      title="Approval Lembur"
      description="Pengajuan lembur dari tim yang ditujukan ke Anda."
    />
  );
}
