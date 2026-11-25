import { requireSpvSession } from "@/lib/auth";
import { listAttendanceApprovalsForApprover } from "@/lib/attendance-approval";
import { AttendanceApprovalManager } from "@/features/approvals/AttendanceApprovalManager";

export const dynamic = "force-dynamic";

export default async function SpvAttendanceApprovalsPage() {
  const spv = await requireSpvSession();
  const rows = await listAttendanceApprovalsForApprover(spv.id);
  return (
    <AttendanceApprovalManager
      rows={rows}
      apiBase="/api/spv/attendance-approvals"
      canApprove
      description="Pengajuan telat / pulang awal dari tim yang ditujukan ke Anda."
    />
  );
}
