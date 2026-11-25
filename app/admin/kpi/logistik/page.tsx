import { requireAdminSession } from "@/lib/auth";
import {
  formatKpiPeriodLabel,
  getDefaultKpiPeriod,
  getKpiSalesRetailHariKerja,
  getKpiSalesRetailInputs,
} from "@/lib/kpi-sales-retail";
import { getLogistikEmployees, LOGISTIK_SPV_KPI } from "@/lib/kpi-logistik";
import { KpiScoringForm } from "@/features/kpi/KpiScoringForm";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export default async function AdminKpiLogistikPage({
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

  const employees = await getLogistikEmployees();
  const selected = (emp ? employees.find((e) => e.id === emp) : undefined) ?? employees[0] ?? null;
  const [inputs, hariKerja] = await Promise.all([
    selected ? getKpiSalesRetailInputs(selected.id, month, year) : Promise.resolve({}),
    getKpiSalesRetailHariKerja(month, year),
  ]);

  return (
    <KpiScoringForm
      title="KPI Logistik"
      description="Penilaian KPI Supervisor Logistik"
      basePath="/admin/kpi/logistik"
      endpoint="/api/admin/kpi/logistik"
      month={month}
      year={year}
      periodLabel={formatKpiPeriodLabel(month, year)}
      employees={employees.map((e) => ({ id: e.id, name: e.nama }))}
      selectedId={selected?.id ?? null}
      template={LOGISTIK_SPV_KPI as never}
      inputs={inputs as never}
      hariKerja={hariKerja}
    />
  );
}
