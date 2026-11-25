import { requireAdminSession } from "@/lib/auth";
import { listBonusSlipDistribution, listPendingBonusSlips } from "@/lib/bonus-slip";
import { DistributionManager } from "@/features/slips/DistributionManager";

export const dynamic = "force-dynamic";

const BONUS_LABEL: Record<string, string> = {
  sales: "Sales", spv: "SPV", manager: "Manager", cs: "CS", host_live: "Host Live",
  marketplace: "Marketplace", marketing: "Media Marketing", advertiser: "Advertiser", umum: "Umum",
};

function toNum(v: string | number | null | undefined) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default async function AdminBonusSlipDistributionPage() {
  await requireAdminSession();
  const [pendingRows, logRows] = await Promise.all([
    listPendingBonusSlips(),
    listBonusSlipDistribution(),
  ]);

  const pending = pendingRows.map((r) => ({
    id: r.payroll_bonus_id,
    name: r.nama,
    role: r.jabatan,
    division: r.divisi,
    periodLabel: r.periode_label,
    extra: BONUS_LABEL[r.bonus_type] ?? r.bonus_type,
    amount: toNum(r.nominal_bonus),
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
      title="Distribusi Slip Bonus"
      description="Pilih karyawan lalu distribusikan slip bonus ke akun mereka."
      pending={pending}
      logs={logs}
      idField="payrollBonusIds"
      apiBase="/api/admin/bonus-slip-distribution"
      canUndo={false}
      showAmount
    />
  );
}
