import { requireAdminSession } from "@/lib/auth";
import {
  formatKpiPeriodLabel,
  getCustomerServiceEmployees,
  getDefaultKpiPeriod,
  getKpiSalesRetailHariKerja,
  getKpiSalesRetailInputs,
  getSalesRetailTemplate,
} from "@/lib/kpi-sales-retail";
import { KpiScoringForm } from "@/features/kpi/KpiScoringForm";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export default async function AdminKpiSalesRetailPage({
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

  const employees = await getCustomerServiceEmployees();
  const selected = (emp ? employees.find((e) => e.id === emp) : undefined) ?? employees[0] ?? null;
  const template = selected ? getSalesRetailTemplate(selected.subDivisi, selected.jabatan, selected.csType) : [];
  const [inputs, hariKerja] = await Promise.all([
    selected ? getKpiSalesRetailInputs(selected.id, month, year) : Promise.resolve({}),
    getKpiSalesRetailHariKerja(month, year),
  ]);

  return (
    <KpiScoringForm
      title="KPI Sales & Retail"
      description="Penilaian KPI Customer Service"
      basePath="/admin/kpi/sales-retail"
      endpoint="/api/admin/kpi/sales-retail"
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
