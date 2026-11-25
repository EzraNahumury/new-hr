import { requireAdminSession, isOvertimeApprover } from "@/lib/auth";
import { listOvertimeRecords } from "@/lib/hris";
import { OvertimeManager } from "@/features/overtime/OvertimeManager";

export default async function AdminOvertimePage() {
  const admin = await requireAdminSession();
  const rows = await listOvertimeRecords();
  const canApprove = isOvertimeApprover(admin.email);
  return <OvertimeManager rows={rows as never} canApprove={canApprove} />;
}
