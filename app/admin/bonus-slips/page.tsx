import { requireAdminSession } from "@/lib/auth";
import {
  getActivePayrollPeriod,
  formatPayrollPeriodLabel,
} from "@/lib/payroll-admin";
import { listPayrollBonusPeriods, listPayrollBonusSheet } from "@/lib/payroll-bonus";
import { BonusSlipViewer } from "@/features/slips/BonusSlipViewer";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default async function AdminBonusSlipsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const sp = (await searchParams) ?? {};
  const period = { month: pint(sp.month), year: pint(sp.year) };

  const [sheet, periodOptions] = await Promise.all([
    listPayrollBonusSheet(period),
    listPayrollBonusPeriods(),
  ]);

  const active = getActivePayrollPeriod();
  const month = sheet?.periodMonth ?? period.month ?? active.month;
  const year = sheet?.periodYear ?? period.year ?? active.year;

  return (
    <BonusSlipViewer
      rows={(sheet?.rows ?? []) as never}
      periodOptions={periodOptions}
      periodMonth={month}
      periodYear={year}
      periodLabel={sheet?.periodLabel ?? formatPayrollPeriodLabel(month, year)}
    />
  );
}
