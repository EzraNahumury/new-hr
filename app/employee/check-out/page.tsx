import { requireEmployeeSession } from "@/lib/auth";
import { getJakartaDate } from "@/lib/attendance";
import { getEmployeeByUserId, getEmployeeTodayAttendance } from "@/lib/hris";
import { getScheduledShiftForDate } from "@/lib/jadwal-karyawan";
import { listEligibleApprovers } from "@/lib/overtime";
import { AttendanceCapture } from "@/features/employee/AttendanceCapture";

export const dynamic = "force-dynamic";

export default async function EmployeeCheckOutPage() {
  const session = await requireEmployeeSession();
  const employee = await getEmployeeByUserId(session.userId);
  if (!employee) return <p className="text-sm text-ink-2">Data karyawan tidak ditemukan.</p>;

  const [todayAttendance, scheduledShift, approversRaw] = await Promise.all([
    getEmployeeTodayAttendance(employee.id),
    getScheduledShiftForDate(employee.id, getJakartaDate()),
    listEligibleApprovers(employee.jabatan),
  ]);
  const isFreelance = (employee.jabatan ?? "").trim().toLowerCase() === "freelance";
  const approvers = approversRaw.map((a) => ({ userId: a.userId, name: a.name, role: a.role }));

  return (
    <AttendanceCapture
      mode="check-out"
      employeeName={employee.nama}
      employeeMeta={`${employee.no_karyawan ?? ""} • ${employee.jabatan ?? ""}`}
      todayAttendance={todayAttendance}
      scheduledShift={scheduledShift && scheduledShift !== "libur" ? scheduledShift : !isFreelance ? "pagi" : null}
      skipEarlyLeaveCheck={isFreelance}
      approvers={approvers}
    />
  );
}
