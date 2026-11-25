import { requireAdminSession } from "@/lib/auth";
import { loadFinanceRecapData } from "@/lib/finance-recap";
import { FinanceRecapView } from "@/features/finance/FinanceRecapView";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default async function AdminFinancePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const sp = (await searchParams) ?? {};
  const m = pint(sp.month);
  const y = pint(sp.year);
  const data = await loadFinanceRecapData(m && y ? { month: m, year: y } : undefined);
  return <FinanceRecapView data={data} basePath="/admin/finance" title="Perhitungan untuk Finance" />;
}
