import { requireAdminSession } from "@/lib/auth";
import { listPayslipDistribution, listPendingPayrollsForDistribution } from "@/lib/hris";
import { getActivePayrollPeriod } from "@/lib/payroll-admin";
import { DistributionManager } from "@/features/slips/DistributionManager";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default async function AdminPayslipDistributionPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const sp = (await searchParams) ?? {};
  const active = getActivePayrollPeriod();
  const month = pint(sp.month) ?? active.month;
  const year = pint(sp.year) ?? active.year;
  const period = { month, year };

  const [pendingRows, logRows] = await Promise.all([
    listPendingPayrollsForDistribution(period),
    listPayslipDistribution(period),
  ]);

  const pending = pendingRows.map((r) => ({
    id: r.payroll_id,
    name: r.nama,
    role: r.jabatan,
    division: r.divisi,
    periodLabel: r.periode_label,
  }));
  const logs = logRows.map((r) => ({
    id: r.id,
    nomorSlip: r.nomor_slip,
    name: r.nama,
    distributedBy: r.didistribusikan_oleh_nama,
    distributedAt: r.tanggal_distribusi,
    slipStatus: r.status_distribusi,
    isRead: r.status_baca === 1,
  }));

  return (
    <DistributionManager
      title="Distribusi Slip Gaji"
      description="Pilih karyawan lalu distribusikan slip gaji ke akun mereka."
      pending={pending}
      logs={logs}
      idField="payrollIds"
      apiBase="/api/admin/payslip-distribution"
      canUndo
    />
  );
}
