import { requireAdminSession } from "@/lib/auth";
import {
  getActivePayrollPeriod,
  formatPayrollPeriodLabel,
  listPayrollPeriods,
} from "@/lib/payroll-admin";
import { getAdminPayrollSummarySheet } from "@/lib/payroll-summary";
import { PayslipViewer } from "@/features/slips/PayslipViewer";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default async function AdminPayslipsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const sp = (await searchParams) ?? {};
  const period = { month: pint(sp.month), year: pint(sp.year) };

  const [sheet, periodOptions] = await Promise.all([
    getAdminPayrollSummarySheet(period),
    listPayrollPeriods(),
  ]);

  const active = getActivePayrollPeriod();
  const month = sheet?.periodMonth ?? period.month ?? active.month;
  const year = sheet?.periodYear ?? period.year ?? active.year;

  return (
    <PayslipViewer
      rows={(sheet?.rows ?? []) as never}
      periodOptions={periodOptions}
      periodMonth={month}
      periodYear={year}
      periodLabel={sheet?.periodLabel ?? formatPayrollPeriodLabel(month, year)}
    />
  );
}
