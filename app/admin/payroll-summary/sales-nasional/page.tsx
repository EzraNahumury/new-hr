import { isPayrollEditor, requireAdminSession } from "@/lib/auth";
import { listPayrollPeriods } from "@/lib/payroll-admin";
import {
  getAdminPayrollSummarySheet,
  type AdminPayrollSummarySheet,
} from "@/lib/payroll-summary";
import { isSalesNasionalRole } from "@/lib/sales-roles";
import { PayrollSummaryManager } from "@/features/payroll/PayrollSummaryManager";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

function filterSN(sheet: AdminPayrollSummarySheet) {
  const rows = sheet.rows
    .filter((r) => isSalesNasionalRole(r.role))
    .map((r, i) => ({ ...r, number: i + 1 }));
  return {
    ...sheet,
    rows,
    totalNetIncome: rows.reduce((t, r) => t + r.netIncome, 0),
    totalDeduction: rows.reduce((t, r) => t + r.fineDeduction + r.contractCut + r.loanCut + r.otherDeduction, 0),
  };
}

export default async function AdminSalesNasionalPayrollPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const admin = await requireAdminSession();
  const sp = (await searchParams) ?? {};
  const period = { month: pint(sp.month), year: pint(sp.year) };

  const [sheet, periodOptions, canEdit] = await Promise.all([
    getAdminPayrollSummarySheet(period),
    listPayrollPeriods(),
    isPayrollEditor(admin.email),
  ]);

  return (
    <PayrollSummaryManager
      sheet={sheet ? (filterSN(sheet) as never) : null}
      periodOptions={periodOptions}
      canEdit={canEdit}
      basePath="/admin/payroll-summary/sales-nasional"
      title="Summary Payroll Sales Nasional"
      exports={false}
    />
  );
}
