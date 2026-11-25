import { requireAdminSession } from "@/lib/auth";
import {
  FINANCE_KPI,
  formatKpiPeriodLabel,
  getDefaultKpiPeriod,
  getFinanceStaffEmployees,
  getKpiFinanceHariKerja,
  getKpiFinanceInputs,
  getKpiFinanceOmzet,
} from "@/lib/kpi-finance";
import { KpiScoringForm } from "@/features/kpi/KpiScoringForm";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export default async function AdminKpiFinancePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const sp = (await searchParams) ?? {};
  const def = getDefaultKpiPeriod();
  const month = pint(sp.month) ?? def.month;
  const year = pint(sp.year) ?? def.year;
  const emp = pint(sp.emp);

  const employees = await getFinanceStaffEmployees();
  const selected = (emp ? employees.find((e) => e.id === emp) : undefined) ?? employees[0] ?? null;
  const [inputs, hariKerja, omzet] = await Promise.all([
    selected ? getKpiFinanceInputs(selected.id, month, year) : Promise.resolve({}),
    getKpiFinanceHariKerja(month, year),
    selected ? getKpiFinanceOmzet(selected.placementKey, month, year) : Promise.resolve({ target: 0, realisasi: 0 }),
  ]);

  return (
    <KpiScoringForm
      title="KPI Finance"
      description="Penilaian KPI Staff Finance"
      basePath="/admin/kpi/finance"
      endpoint="/api/admin/kpi/finance"
      month={month}
      year={year}
      periodLabel={formatKpiPeriodLabel(month, year)}
      employees={employees.map((e) => ({ id: e.id, name: e.nama }))}
      selectedId={selected?.id ?? null}
      template={FINANCE_KPI as never}
      inputs={inputs as never}
      hariKerja={hariKerja}
      omzet={omzet}
      placementKey={selected?.placementKey}
    />
  );
}
