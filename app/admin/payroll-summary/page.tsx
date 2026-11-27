import { isPayrollEditor, requireAdminSession } from "@/lib/auth";
import {
  listPayrollPeriods,
  listPayrollEmployeeOptions,
  getActivePayrollPeriod,
  formatPayrollPeriodLabel,
} from "@/lib/payroll-admin";
import {
  getAdminPayrollSummarySheet,
  type AdminPayrollSummarySheet,
} from "@/lib/payroll-summary";
import { isSalesNasionalRole } from "@/lib/sales-roles";
import { isFreelanceJabatan } from "@/lib/freelance-roles";
import { isPenjahit } from "@/lib/penjahit-roles";
import { PayrollSummaryManager } from "@/features/payroll/PayrollSummaryManager";

export const dynamic = "force-dynamic";

function parseInt_(v: string | string[] | undefined) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function filterSheet(sheet: AdminPayrollSummarySheet) {
  const rows = sheet.rows
    .filter((r) => !isSalesNasionalRole(r.role) && !isFreelanceJabatan(r.role))
    .map((r, i) => ({ ...r, number: i + 1 }));
  return {
    ...sheet,
    rows,
    totalNetIncome: rows.reduce((t, r) => t + r.netIncome, 0),
    totalDeduction: rows.reduce((t, r) => t + r.fineDeduction + r.contractCut + r.loanCut + r.otherDeduction, 0),
  };
}

export default async function AdminPayrollSummaryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const admin = await requireAdminSession();
  const sp = (await searchParams) ?? {};
  const reqMonth = parseInt_(sp.month);
  const reqYear = parseInt_(sp.year);
  const period = { month: reqMonth ?? undefined, year: reqYear ?? undefined };

  const [sheet, periodOptions, canEdit, rawEmployeeOptions] = await Promise.all([
    getAdminPayrollSummarySheet(period, { excludePlacement: "Toko Solo" }),
    listPayrollPeriods(),
    isPayrollEditor(admin.email),
    listPayrollEmployeeOptions({ excludePlacement: "Toko Solo" }),
  ]);

  // Resolve the period shown even when the sheet is empty, so the page is never a
  // dead-end: admin can still pick a period and add employees to payroll.
  const active = getActivePayrollPeriod();
  const resolvedMonth = sheet?.periodMonth ?? reqMonth ?? active.month;
  const resolvedYear = sheet?.periodYear ?? reqYear ?? active.year;
  const resolvedPeriod = {
    month: resolvedMonth,
    year: resolvedYear,
    label: formatPayrollPeriodLabel(resolvedMonth, resolvedYear),
  };

  // Non-sales, non-penjahit, non-freelance, non-partime employees eligible for the
  // main summary (mirrors the role filter applied to the sheet rows).
  const employeeOptions = rawEmployeeOptions
    .filter((e) => {
      const status = (e.employmentStatus ?? "").trim().toLowerCase();
      return (
        !isSalesNasionalRole(e.role) &&
        !isPenjahit(e.subDivision) &&
        !isFreelanceJabatan(e.role) &&
        status !== "partime" &&
        status !== "freelance"
      );
    })
    .map((e) => ({ employeeId: e.employeeId, name: e.name, role: e.role }));

  return (
    <PayrollSummaryManager
      sheet={sheet ? (filterSheet(sheet) as never) : null}
      periodOptions={periodOptions}
      canEdit={canEdit}
      employeeOptions={employeeOptions}
      period={resolvedPeriod}
    />
  );
}
