import { listAllAttendanceApprovals } from "@/lib/attendance-approval";
import { AttendanceApprovalManager } from "@/features/approvals/AttendanceApprovalManager";

export const dynamic = "force-dynamic";

export default async function AdminAttendanceApprovalsHistoryPage() {
  const rows = await listAllAttendanceApprovals();
  return (
    <AttendanceApprovalManager
      rows={rows}
      apiBase="/api/admin/attendance-approvals"
      canApprove
      title="History Approval Absensi"
      description="Seluruh riwayat pengajuan telat / pulang awal."
    />
  );
}
