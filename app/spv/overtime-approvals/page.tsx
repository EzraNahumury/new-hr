import { requireSpvSession } from "@/lib/auth";
import { listOvertimeForApprover } from "@/lib/overtime";
import { OvertimeManager } from "@/features/overtime/OvertimeManager";

export const dynamic = "force-dynamic";

export default async function SpvOvertimeApprovalsPage() {
  const spv = await requireSpvSession();
  const rows = await listOvertimeForApprover(spv.id);
  return (
    <OvertimeManager
      rows={rows as never}
      canApprove
      apiBase="/api/spv/overtime-approvals"
      title="Approval Lembur"
      description="Pengajuan lembur dari tim yang ditujukan ke Anda."
    />
  );
}
