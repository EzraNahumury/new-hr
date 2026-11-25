import { RowDataPacket } from "mysql2";
import AppShell from "@/components/layout/AppShell";
import type { EmployeeCaps } from "@/components/layout/nav-config";
import { requireEmployeeSession } from "@/lib/auth";
import { pool } from "@/lib/db";
import {
  canSetSchedule,
  isFinanceDept,
  isJadwalWhitelisted,
  isManager,
  isSupervisorRole,
} from "@/lib/scheduler-roles";
import { isSalesFieldRole } from "@/lib/sales-roles";

type EmpRow = RowDataPacket & {
  nama: string | null;
  jabatan: string | null;
  departemen: string | null;
  jadwal_editor: number | null;
};

async function getEmployeeCaps(userId: number): Promise<EmployeeCaps> {
  try {
    const [rows] = await pool.query<EmpRow[]>(
      `SELECT nama, jabatan, departemen, jadwal_editor
         FROM karyawan WHERE user_id = ? LIMIT 1`,
      [userId],
    );
    const r = rows[0];
    if (!r) return {};
    return {
      scheduler:
        canSetSchedule(r.jabatan) ||
        isJadwalWhitelisted(r.nama) ||
        Number(r.jadwal_editor) === 1,
      salesField: isSalesFieldRole(r.jabatan),
      manager: isManager(r.jabatan),
      financeDept: isFinanceDept(r.departemen),
      overtimeApprover: isSupervisorRole(r.jabatan) || isManager(r.jabatan),
    };
  } catch {
    return {};
  }
}

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const emp = await requireEmployeeSession();
  const caps = await getEmployeeCaps(emp.userId);
  return (
    <AppShell
      role="employee"
      user={{ name: emp.fullName, email: emp.email }}
      caps={caps}
    >
      {children}
    </AppShell>
  );
}
