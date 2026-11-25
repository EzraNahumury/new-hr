import {
  listPayrollBonusPeriods,
  listPayrollBonusSheet,
} from "@/lib/payroll-bonus";
import { PayrollBonusManager } from "@/features/payroll/PayrollBonusManager";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default async function AdminPayrollBonusPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const period = { month: pint(sp.month), year: pint(sp.year) };
  const [sheet, periodOptions] = await Promise.all([
    listPayrollBonusSheet(period),
    listPayrollBonusPeriods(),
  ]);
  return <PayrollBonusManager sheet={sheet as never} periodOptions={periodOptions} />;
}
