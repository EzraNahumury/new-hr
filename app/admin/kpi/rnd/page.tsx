import { requireAdminSession } from "@/lib/auth";
import {
  formatKpiPeriodLabel,
  getDefaultKpiPeriod,
  getKpiRndHariKerja,
  getKpiRndInputs,
  getKpiTemplate,
  getRndEmployees,
} from "@/lib/kpi-rnd";
import { KpiScoringForm } from "@/features/kpi/KpiScoringForm";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export default async function AdminKpiRndPage({
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

  const employees = await getRndEmployees();
  const selected = (emp ? employees.find((e) => e.id === emp) : undefined) ?? employees[0] ?? null;
  const template = selected ? getKpiTemplate(selected.role) : [];
  const [inputs, hariKerja] = await Promise.all([
    selected ? getKpiRndInputs(selected.id, month, year) : Promise.resolve({}),
    getKpiRndHariKerja(month, year),
  ]);

  return (
    <KpiScoringForm
      title="KPI RnD"
      description="Penilaian KPI tim RnD (Staff & SPV)"
      basePath="/admin/kpi/rnd"
      endpoint="/api/admin/kpi/rnd"
      month={month}
      year={year}
      periodLabel={formatKpiPeriodLabel(month, year)}
      employees={employees.map((e) => ({ id: e.id, name: e.nama }))}
      selectedId={selected?.id ?? null}
      template={template as never}
      inputs={inputs as never}
      hariKerja={hariKerja}
    />
  );
}
