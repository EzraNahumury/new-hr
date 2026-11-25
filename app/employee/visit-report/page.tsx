import { requireEmployeeSession } from "@/lib/auth";
import { getJakartaDate } from "@/lib/attendance";
import {
  getEmployeeRoleByUserId,
  listVisitReportsForEmployee,
} from "@/lib/visit-reports";
import { VisitReportEmployee } from "@/features/visit-reports/VisitReportEmployee";

export const dynamic = "force-dynamic";

export default async function EmployeeVisitReportPage() {
  const session = await requireEmployeeSession();
  const employee = await getEmployeeRoleByUserId(session.userId);
  const tanggal = getJakartaDate();
  const reports = employee
    ? await listVisitReportsForEmployee(employee.employeeId, tanggal)
    : [];
  return <VisitReportEmployee reports={reports} tanggal={tanggal} />;
}
