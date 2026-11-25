"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Download, Wallet, TrendingDown, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { Input, Field, Select } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";
import { formatRupiah } from "@/lib/format";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any> & {
  id: number; employeeId: number; number: number; name: string; role: string;
  presentDays: number; workDays: number; totalBaseSalary: number; overtimeBonus: number;
  fineDeduction: number; contractCut: number; loanCut: number; otherDeduction: number; netIncome: number;
  inputUpdatedAt: string | null;
};
type Sheet = {
  periodMonth: number; periodYear: number; periodLabel: string;
  totalOmzet: number; totalNetIncome: number; totalDeduction: number; rows: Row[];
};
type PeriodOpt = { month: number; year: number; label: string };

const NOMINAL: { key: string; row: string; label: string }[] = [
  { key: "gajiPerDay", row: "inputGajiPerDay", label: "Gaji / hari" },
  { key: "tunjanganJabatan", row: "inputTunjanganJabatan", label: "Tunjangan jabatan" },
  { key: "uangMakan", row: "inputUangMakan", label: "Uang makan" },
  { key: "subsidi", row: "inputSubsidi", label: "Subsidi" },
  { key: "uangKerajinan", row: "inputUangKerajinan", label: "Uang kerajinan" },
  { key: "bpjs", row: "inputBpjs", label: "BPJS" },
  { key: "bonusPerforma", row: "inputBonusPerforma", label: "Bonus performa" },
  { key: "insentif", row: "inputInsentif", label: "Insentif" },
  { key: "uangTransport", row: "inputUangTransport", label: "Uang transport" },
  { key: "kendaraan", row: "inputKendaraan", label: "Kendaraan" },
  { key: "perjalananDinasReimburse", row: "inputPerjalananDinasReimburse", label: "Reimburse dinas" },
];
const OVERRIDE: { key: string; row: string; label: string }[] = [
  { key: "overrideGajiPokok", row: "inputOverrideGajiPokok", label: "Override gaji pokok" },
  { key: "overrideMasuk", row: "inputOverrideMasuk", label: "Override hari masuk" },
  { key: "overrideLembur", row: "inputOverrideLembur", label: "Override lembur" },
  { key: "overrideIzin", row: "inputOverrideIzin", label: "Override izin" },
  { key: "overrideSakit", row: "inputOverrideSakit", label: "Override sakit" },
  { key: "overrideSakitTanpaSurat", row: "inputOverrideSakitTanpaSurat", label: "Override sakit tanpa surat" },
  { key: "overrideSetengahHari", row: "inputOverrideSetengahHari", label: "Override setengah hari" },
  { key: "overrideKontrak", row: "inputOverrideKontrak", label: "Override potongan kontrak" },
  { key: "overridePinjaman", row: "inputOverridePinjaman", label: "Override pinjaman" },
  { key: "overridePinjamanPribadi", row: "inputOverridePinjamanPribadi", label: "Override pinjaman pribadi" },
  { key: "potonganSp2", row: "inputPotonganSp2", label: "Potongan lain-lain (SP2)" },
];

export function PayrollSummaryManager({
  sheet,
  periodOptions,
  canEdit,
  basePath = "/admin/payroll-summary",
  exportBase = "/api/admin/payroll-summary",
  apiBase = "/api/admin/payroll-summary",
  title = "Summary Payroll",
  exports = true,
}: {
  sheet: Sheet | null;
  periodOptions: PeriodOpt[];
  canEdit: boolean;
  basePath?: string;
  exportBase?: string;
  apiBase?: string;
  title?: string;
  exports?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!sheet) {
    return (
      <div className="space-y-6">
        <PageHeader title={title} />
        <EmptyState icon={<Wallet className="h-5 w-5" />} title="Periode tidak tersedia" />
      </div>
    );
  }

  const month = sheet.periodMonth;
  const year = sheet.periodYear;

  function openEdit(r: Row) {
    const f: Record<string, string> = {};
    for (const n of NOMINAL) f[n.key] = String(r[n.row] ?? 0);
    for (const o of OVERRIDE) f[o.key] = r[o.row] == null ? "" : String(r[o.row]);
    f.potonganSp2Note = r.otherDeductionNote ?? "";
    setForm(f);
    setEditing(r);
    setErr("");
  }

  async function save() {
    if (!editing) return;
    setBusy(true);
    setErr("");
    try {
      const payload: Record<string, unknown> = { employeeId: editing.employeeId, month, year, expectedInputUpdatedAt: editing.inputUpdatedAt };
      for (const n of NOMINAL) payload[n.key] = Number(form[n.key] || 0);
      for (const o of OVERRIDE) payload[o.key] = form[o.key] === "" ? "" : Number(form[o.key]);
      payload.potonganSp2Note = form.potonganSp2Note || null;
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      setEditing(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={`Periode ${sheet.periodLabel}. Payroll dihitung live dari absensi & master.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={`${year}-${month}`}
              onChange={(e) => {
                const [y, m] = e.target.value.split("-");
                router.push(`${basePath}?month=${m}&year=${y}`);
              }}
              className="h-10 w-auto"
            >
              {periodOptions.map((p) => (
                <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`}>{p.label}</option>
              ))}
            </Select>
            {exports ? (
              <>
                <a href={`${exportBase}/gaji-export?month=${month}&year=${year}`} className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-surface-2"><Download className="h-4 w-4" /> THP PDF</a>
                <a href={`${exportBase}/finance-export?month=${month}&year=${year}`} className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-surface-2"><Download className="h-4 w-4" /> Finance XLSX</a>
              </>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total take-home" value={<span className="text-2xl">{formatRupiah(sheet.totalNetIncome)}</span>} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Total potongan" value={<span className="text-2xl">{formatRupiah(sheet.totalDeduction)}</span>} tone="warning" icon={<TrendingDown className="h-5 w-5" />} />
        <StatCard label="Total omzet" value={<span className="text-2xl">{formatRupiah(sheet.totalOmzet)}</span>} tone="info" icon={<Receipt className="h-5 w-5" />} />
      </div>

      <Card className="overflow-hidden p-0">
        {sheet.rows.length === 0 ? (
          <div className="p-5"><EmptyState icon={<Wallet className="h-5 w-5" />} title="Tidak ada data payroll pada periode ini" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>#</TH>
                  <TH>Karyawan</TH>
                  <TH className="text-right">Hadir</TH>
                  <TH className="text-right">Gaji pokok</TH>
                  <TH className="text-right">Lembur</TH>
                  <TH className="text-right">Potongan</TH>
                  <TH className="text-right">Take-home</TH>
                  {canEdit ? <TH className="text-right">Aksi</TH> : null}
                </TR>
              </THead>
              <TBody>
                {sheet.rows.map((r) => (
                  <TR key={r.id || r.employeeId}>
                    <TD className="text-ink-2">{r.number}</TD>
                    <TD><div className="font-medium text-ink">{r.name}</div><div className="text-[13px] text-ink-2">{r.role}</div></TD>
                    <TD className="nums text-right text-ink-2">{r.presentDays}/{r.workDays}</TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(r.totalBaseSalary)}</TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(r.overtimeBonus)}</TD>
                    <TD className="nums text-right text-danger">{formatRupiah(r.fineDeduction + r.contractCut + r.loanCut + r.otherDeduction)}</TD>
                    <TD className="nums text-right font-semibold text-ink">{formatRupiah(r.netIncome)}</TD>
                    {canEdit ? (
                      <TD className="text-right">
                        <button onClick={() => openEdit(r)} title="Edit payroll" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                      </TD>
                    ) : null}
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit payroll · ${editing.name}` : ""}
        description="Nominal tetap & override. Kosongkan override untuk kembali ke hitungan otomatis."
        size="xl"
        footer={<>{err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}<Button variant="secondary" onClick={() => setEditing(null)}>Batal</Button><Button loading={busy} onClick={save}>Simpan</Button></>}
      >
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Nominal tetap</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NOMINAL.map((n) => (
                <Field key={n.key} label={n.label}>
                  <Input type="number" value={form[n.key] ?? ""} onChange={(e) => setForm((s) => ({ ...s, [n.key]: e.target.value }))} />
                </Field>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Override (opsional)</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {OVERRIDE.map((o) => (
                <Field key={o.key} label={o.label}>
                  <Input type="number" value={form[o.key] ?? ""} placeholder="auto" onChange={(e) => setForm((s) => ({ ...s, [o.key]: e.target.value }))} />
                </Field>
              ))}
              <Field label="Catatan potongan lain-lain" className="sm:col-span-2 lg:col-span-3">
                <Input value={form.potonganSp2Note ?? ""} onChange={(e) => setForm((s) => ({ ...s, potonganSp2Note: e.target.value }))} />
              </Field>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
