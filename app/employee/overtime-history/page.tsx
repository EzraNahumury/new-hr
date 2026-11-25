import { listOvertimeRecords } from "@/lib/hris";
import { OvertimeManager } from "@/features/overtime/OvertimeManager";

export const dynamic = "force-dynamic";

export default async function EmployeeOvertimeHistoryPage() {
  const rows = await listOvertimeRecords();
  return (
    <OvertimeManager
      rows={rows as never}
      canApprove={false}
      title="History Lembur"
      description="Riwayat lembur seluruh karyawan (read-only)."
    />
  );
}
