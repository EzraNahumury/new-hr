import { listAttendanceApprovalsForAdmin } from "@/lib/attendance-approval";
import { AttendanceApprovalManager } from "@/features/approvals/AttendanceApprovalManager";

export const dynamic = "force-dynamic";

export default async function AdminAttendanceApprovalsPage() {
  const rows = await listAttendanceApprovalsForAdmin();
  return (
    <AttendanceApprovalManager
      rows={rows}
      apiBase="/api/admin/attendance-approvals"
      canApprove
      description="Pengajuan telat / pulang awal yang ditujukan ke admin."
    />
  );
}
