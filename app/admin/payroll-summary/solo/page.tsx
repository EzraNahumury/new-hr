import { isPayrollEditor, requireAdminSession } from "@/lib/auth";
import { listPayrollPeriods } from "@/lib/payroll-admin";
import { getAdminPayrollSummarySheet } from "@/lib/payroll-summary";
import { PayrollSummaryManager } from "@/features/payroll/PayrollSummaryManager";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default async function AdminSoloPayrollPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const admin = await requireAdminSession();
  const sp = (await searchParams) ?? {};
  const period = { month: pint(sp.month), year: pint(sp.year) };

  const [sheet, periodOptions, canEdit] = await Promise.all([
    getAdminPayrollSummarySheet(period, { placementFilter: "Toko Solo" }),
    listPayrollPeriods(),
    isPayrollEditor(admin.email),
  ]);

  return (
    <PayrollSummaryManager
      sheet={sheet as never}
      periodOptions={periodOptions}
      canEdit={canEdit}
      basePath="/admin/payroll-summary/solo"
      title="Summary Payroll Solo"
      exports={false}
    />
  );
}
