import { isPayrollEditor, requireAdminSession } from "@/lib/auth";
import { listPayrollPeriods } from "@/lib/payroll-admin";
import {
  getAdminPayrollSummarySheet,
  type AdminPayrollSummarySheet,
} from "@/lib/payroll-summary";
import { isSalesNasionalRole } from "@/lib/sales-roles";
import { isFreelanceJabatan } from "@/lib/freelance-roles";
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
  const period = { month: parseInt_(sp.month) ?? undefined, year: parseInt_(sp.year) ?? undefined };

  const [sheet, periodOptions, canEdit] = await Promise.all([
    getAdminPayrollSummarySheet(period, { excludePlacement: "Toko Solo" }),
    listPayrollPeriods(),
    isPayrollEditor(admin.email),
  ]);

  return (
    <PayrollSummaryManager
      sheet={sheet ? (filterSheet(sheet) as never) : null}
      periodOptions={periodOptions}
      canEdit={canEdit}
    />
  );
}
