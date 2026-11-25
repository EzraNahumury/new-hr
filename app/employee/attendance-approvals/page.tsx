import { requireEmployeeSession } from "@/lib/auth";
import { listAttendanceApprovalsForApprover } from "@/lib/attendance-approval";
import { AttendanceApprovalManager } from "@/features/approvals/AttendanceApprovalManager";

export const dynamic = "force-dynamic";

export default async function EmployeeAttendanceApprovalsPage() {
  const emp = await requireEmployeeSession();
  const rows = await listAttendanceApprovalsForApprover(emp.userId);
  return (
    <AttendanceApprovalManager
      rows={rows}
      apiBase="/api/employee/attendance-approvals"
      canApprove
      description="Pengajuan telat / pulang awal dari tim yang ditujukan ke Anda."
    />
  );
}
