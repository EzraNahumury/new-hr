"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, SlidersHorizontal, FileX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Field, Select } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";
import { formatRupiah } from "@/lib/format";

type Installment = { sequence: number; monthLabel: string; nominalDeduction: string | null; deductedAmount: string | null; stopped: boolean };
type Plan = {
  employeeId: number; employeeName: string; nip: string; role: string;
  contractDate: string | null; monthlyDeduction: string | null;
  totalPlannedDeduction: string; totalDeductedAmount: string; remainingDeduction: string;
  isActive: boolean; lastDeductionYm: number | null; firstDeductionYm: number | null;
  installments: Installment[];
};
type EmpOpt = { employeeId: number; name: string };

function ymToStr(ym: number | null): string {
  if (!ym) return "";
  const y = Math.floor(ym / 100);
  const m = ym % 100;
  return `${y}-${String(m).padStart(2, "0")}`;
}

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
function fmtYm(ym: number | null): string {
  if (!ym) return "—";
  const y = Math.floor(ym / 100);
  const m = ym % 100;
  return `${MONTHS_ID[m - 1] ?? "?"} ${y}`;
}

export function ContractDeductionsManager({ plans, employees }: { plans: Plan[]; employees: EmpOpt[] }) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [add, setAdd] = useState({ employeeId: "", nominalDeduction: "200000", description: "" });
  const [detail, setDetail] = useState<Plan | null>(null);
  const [tune, setTune] = useState<Plan | null>(null);
  const [startM, setStartM] = useState("");
  const [lastM, setLastM] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function call(body: Record<string, unknown>, close: () => void) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/contract-deductions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      close();
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  function openTune(p: Plan) {
    setTune(p);
    setStartM(ymToStr(p.firstDeductionYm));
    setLastM(ymToStr(p.lastDeductionYm));
    setErr("");
  }

  async function saveTune() {
    if (!tune) return;
    const parse = (s: string) => {
      const m = /^(\d{4})-(\d{2})$/.exec(s);
      return m ? { year: Number(m[1]), month: Number(m[2]) } : null;
    };
    const start = parse(startM);
    const last = parse(lastM);
    await call(
      { action: "set_start_month", employeeId: tune.employeeId, startMonth: start?.month ?? null, startYear: start?.year ?? null },
      () => {},
    );
    await call(
      { action: "set_last_month", employeeId: tune.employeeId, lastMonth: last?.month ?? null, lastYear: last?.year ?? null },
      () => setTune(null),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Potongan Kontrak"
        description="Deposit kontrak Rp200.000/bulan (5 bulan). Atur bulan mulai & bulan terakhir per karyawan."
        actions={<Button onClick={() => { setShowAdd(true); setErr(""); }}><Plus className="h-4 w-4" /> Tambah Potongan</Button>}
      />

      <Card>
        {plans.length === 0 ? (
          <div className="p-5"><EmptyState icon={<FileX className="h-5 w-5" />} title="Belum ada rencana potongan" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Karyawan</TH>
                  <TH>Mulai</TH>
                  <TH className="text-right">Per bulan</TH>
                  <TH className="text-right">Terpotong</TH>
                  <TH className="text-right">Sisa</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {plans.map((p) => (
                  <TR key={p.employeeId}>
                    <TD><div className="font-medium text-ink">{p.employeeName}</div><div className="text-[13px] text-ink-2">{p.role || p.nip}</div></TD>
                    <TD className="text-ink-2">{fmtYm(p.firstDeductionYm)}</TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(p.monthlyDeduction)}</TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(p.totalDeductedAmount)}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(p.remainingDeduction)}</TD>
                    <TD><Badge tone={p.isActive ? "info" : "neutral"} dot>{p.isActive ? "Berjalan" : "Selesai"}</Badge></TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setDetail(p)} title="Jadwal" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => openTune(p)} title="Atur bulan" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><SlidersHorizontal className="h-4 w-4" /></button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Dialog open={showAdd} onClose={() => setShowAdd(false)} title="Tambah Potongan Kontrak" size="sm"
        footer={<>{err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}<Button variant="secondary" onClick={() => setShowAdd(false)}>Batal</Button><Button loading={busy} onClick={() => call({ employeeId: Number(add.employeeId), nominalDeduction: Number(add.nominalDeduction), description: add.description || null }, () => setShowAdd(false))}>Tambah</Button></>}>
        <div className="space-y-4">
          <Field label="Karyawan" required>
            <Select value={add.employeeId} onChange={(e) => setAdd((s) => ({ ...s, employeeId: e.target.value }))}>
              <option value="">— pilih —</option>
              {employees.map((e) => <option key={e.employeeId} value={e.employeeId}>{e.name}</option>)}
            </Select>
          </Field>
          <Field label="Nominal potongan / bulan (Rp)" required><Input type="number" value={add.nominalDeduction} onChange={(e) => setAdd((s) => ({ ...s, nominalDeduction: e.target.value }))} /></Field>
          <Field label="Keterangan"><Input value={add.description} onChange={(e) => setAdd((s) => ({ ...s, description: e.target.value }))} /></Field>
        </div>
      </Dialog>

      <Dialog open={!!tune} onClose={() => setTune(null)} title={tune ? `Atur bulan · ${tune.employeeName}` : ""} size="sm"
        footer={<>{err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}<Button variant="secondary" onClick={() => setTune(null)}>Batal</Button><Button loading={busy} onClick={saveTune}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Bulan mulai potongan" hint="Kosongkan = default (bulan kontrak + 1)."><Input type="month" value={startM} onChange={(e) => setStartM(e.target.value)} /></Field>
          <Field label="Bulan potongan terakhir" hint="Kosongkan = penuh 5 bulan (tanpa cap)."><Input type="month" value={lastM} onChange={(e) => setLastM(e.target.value)} /></Field>
        </div>
      </Dialog>

      <Dialog open={!!detail} onClose={() => setDetail(null)} title={detail ? `Jadwal potongan · ${detail.employeeName}` : ""}
        description={detail ? `Total ${formatRupiah(detail.totalPlannedDeduction)} · sisa ${formatRupiah(detail.remainingDeduction)}` : ""} size="md">
        {detail ? (
          <ul className="divide-y divide-line">
            {detail.installments.map((it) => (
              <li key={it.sequence} className="flex items-center justify-between py-2 text-sm">
                <span className="text-ink">{it.monthLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="nums text-ink-2">{formatRupiah(it.nominalDeduction)}</span>
                  {it.stopped ? <Badge tone="neutral">Dihentikan</Badge> : Number(it.deductedAmount) > 0 ? <Badge tone="success" dot>Terpotong</Badge> : <Badge tone="warning" dot>Belum</Badge>}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Dialog>
    </div>
  );
}
