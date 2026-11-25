import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId, getEmployeeTodayAttendance } from "@/lib/hris";
import { listEligibleApprovers } from "@/lib/overtime";
import { AttendanceCapture } from "@/features/employee/AttendanceCapture";

export const dynamic = "force-dynamic";

export default async function EmployeeCheckInPage() {
  const session = await requireEmployeeSession();
  const employee = await getEmployeeByUserId(session.userId);
  if (!employee) return <p className="text-sm text-ink-2">Data karyawan tidak ditemukan.</p>;

  const [todayAttendance, approversRaw] = await Promise.all([
    getEmployeeTodayAttendance(employee.id),
    listEligibleApprovers(employee.jabatan),
  ]);
  const approvers = approversRaw.map((a) => ({ userId: a.userId, name: a.name, role: a.role }));

  return (
    <AttendanceCapture
      mode="check-in"
      employeeName={employee.nama}
      employeeMeta={`${employee.no_karyawan ?? ""} • ${employee.jabatan ?? ""}`}
      todayAttendance={todayAttendance}
      approvers={approvers}
    />
  );
}
