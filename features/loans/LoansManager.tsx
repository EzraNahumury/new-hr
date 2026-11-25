"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X, Eye, Trash2, CircleDollarSign, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Input, Field, Select } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";
import { formatRupiah } from "@/lib/format";

type Installment = { id: number; monthLabel: string; plannedDeduction: string; isPaid: boolean };
type Loan = {
  id: number;
  employeeId: number;
  employeeName: string;
  nip: string | null;
  role: string | null;
  totalLoan: string;
  installmentCount: number;
  monthlyDeduction: string;
  requestDate: string | null;
  approvalDate: string | null;
  status: string;
  totalPaid: string;
  remainingBalance: string;
  installments: Installment[];
};
type EmpOpt = { id: number; name: string };

export function LoansManager({
  mode,
  loans,
  employees = [],
  eligibility,
  maxAmount = 3_000_000,
}: {
  mode: "admin" | "employee";
  loans: Loan[];
  employees?: EmpOpt[];
  eligibility?: { eligible: boolean; reason?: string | null };
  maxAmount?: number;
}) {
  const router = useRouter();
  const isAdmin = mode === "admin";
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({ employeeId: "", totalLoan: "", installmentCount: "", requestDate: today });
  const [editing, setEditing] = useState<Loan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState<Loan | null>(null);
  const [payoff, setPayoff] = useState<Loan | null>(null);
  const [payoffPeriod, setPayoffPeriod] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const stats = useMemo(() => {
    const active = loans.filter((l) => ["approved", "berjalan"].includes(l.status)).length;
    const remaining = loans.reduce((s, l) => s + Number(l.remainingBalance || 0), 0);
    const pending = loans.filter((l) => l.status === "pending").length;
    return { total: loans.length, active, remaining, pending };
  }, [loans]);

  function openCreate() {
    setEditing(null);
    setForm({ employeeId: "", totalLoan: "", installmentCount: "", requestDate: today });
    setErr("");
    setShowForm(true);
  }
  function openEdit(l: Loan) {
    setEditing(l);
    setForm({
      employeeId: String(l.employeeId),
      totalLoan: String(Number(l.totalLoan)),
      installmentCount: String(l.installmentCount),
      requestDate: l.requestDate ?? today,
    });
    setErr("");
    setShowForm(true);
  }

  async function submit() {
    setBusy(true);
    setErr("");
    try {
      const payload: Record<string, unknown> = {
        totalLoan: Number(form.totalLoan),
        installmentCount: Number(form.installmentCount),
        requestDate: form.requestDate,
      };
      if (isAdmin) payload.employeeId = Number(form.employeeId);

      let url = isAdmin ? "/api/admin/loans" : "/api/employee/loans";
      let method = "POST";
      if (isAdmin && editing) {
        url = `/api/admin/loans/${editing.id}`;
        method = "PUT";
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      setShowForm(false);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function decide(l: Loan, status: "approved" | "rejected") {
    const res = await fetch(`/api/admin/loans/${l.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
    else {
      const d = await res.json().catch(() => ({}));
      alert(d.message || "Gagal memproses.");
    }
  }

  async function remove(l: Loan) {
    if (!confirm(`Hapus pengajuan pinjaman ${l.employeeName}?`)) return;
    const res = await fetch(`/api/admin/loans/${l.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Gagal menghapus.");
  }

  async function doPayoff() {
    if (!payoff) return;
    setBusy(true);
    setErr("");
    const res = await fetch(`/api/admin/loans/${payoff.id}/payoff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payoffPeriod),
    });
    setBusy(false);
    const d = await res.json().catch(() => ({}));
    if (res.ok) {
      setPayoff(null);
      router.refresh();
    } else setErr(d.message || "Gagal pelunasan.");
  }

  const canApply = !isAdmin && eligibility?.eligible;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? "Pinjaman Karyawan" : "Status Pinjaman"}
        description={isAdmin ? "Kelola pengajuan, approval, cicilan, dan pelunasan pinjaman." : "Pinjaman aktif, cicilan, dan sisa kewajiban Anda."}
        actions={
          isAdmin ? (
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Buat Pinjaman</Button>
          ) : (
            <Button onClick={openCreate} disabled={!canApply}><Plus className="h-4 w-4" /> Ajukan Pinjaman</Button>
          )
        }
      />

      {!isAdmin && eligibility && !eligibility.eligible ? (
        <Card className="border-warning/40 bg-warning-weak/40 p-4 text-sm text-ink">
          {eligibility.reason || "Anda belum memenuhi syarat untuk mengajukan pinjaman."}
        </Card>
      ) : null}

      {isAdmin ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Menunggu approval" value={stats.pending} tone="warning" icon={<HandCoins className="h-5 w-5" />} />
          <StatCard label="Pinjaman aktif" value={stats.active} tone="info" icon={<CircleDollarSign className="h-5 w-5" />} />
          <StatCard label="Total sisa" value={<span className="text-2xl">{formatRupiah(stats.remaining)}</span>} icon={<HandCoins className="h-5 w-5" />} />
        </div>
      ) : null}

      <Card>
        {loans.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<HandCoins className="h-5 w-5" />} title="Belum ada pinjaman" description={isAdmin ? "Buat pengajuan pinjaman untuk memulai." : "Belum ada pinjaman tercatat."} />
          </div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  {isAdmin ? <TH>Karyawan</TH> : null}
                  <TH className="text-right">Jumlah</TH>
                  <TH className="text-right">Cicilan/bln</TH>
                  <TH className="text-right">Sisa</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {loans.map((l) => (
                  <TR key={l.id}>
                    {isAdmin ? (
                      <TD>
                        <div className="font-medium text-ink">{l.employeeName}</div>
                        <div className="text-[13px] text-ink-2">{l.role || l.nip || "—"}</div>
                      </TD>
                    ) : null}
                    <TD className="nums text-right text-ink">{formatRupiah(l.totalLoan)}</TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(l.monthlyDeduction)}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(l.remainingBalance)}</TD>
                    <TD><StatusBadge status={l.status} /></TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setDetail(l)} title="Detail cicilan" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><Eye className="h-4 w-4" /></button>
                        {isAdmin && l.status === "pending" ? (
                          <>
                            <button onClick={() => decide(l, "approved")} title="Approve" className="rounded-md p-1.5 text-ink-2 hover:bg-success-weak hover:text-success"><Check className="h-4 w-4" /></button>
                            <button onClick={() => decide(l, "rejected")} title="Reject" className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger"><X className="h-4 w-4" /></button>
                          </>
                        ) : null}
                        {isAdmin && ["approved", "berjalan"].includes(l.status) ? (
                          <button onClick={() => { setPayoff(l); setErr(""); }} title="Pelunasan dipercepat" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><CircleDollarSign className="h-4 w-4" /></button>
                        ) : null}
                        {isAdmin && l.status !== "lunas" ? (
                          <button onClick={() => remove(l)} title="Hapus" className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                        ) : null}
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      {/* Create / apply / edit */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Pinjaman" : isAdmin ? "Buat Pinjaman" : "Ajukan Pinjaman"}
        description={!isAdmin ? `Maksimal pengajuan mandiri ${formatRupiah(maxAmount)}.` : undefined}
        size="sm"
        footer={
          <>
            {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
            <Button variant="secondary" onClick={() => setShowForm(false)}>Batal</Button>
            <Button onClick={submit} loading={busy}>{editing ? "Simpan" : "Kirim"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          {isAdmin ? (
            <Field label="Karyawan" required>
              <Select value={form.employeeId} onChange={(e) => setForm((s) => ({ ...s, employeeId: e.target.value }))}>
                <option value="">— pilih karyawan —</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </Select>
            </Field>
          ) : null}
          <Field label="Jumlah pinjaman (Rp)" required>
            <Input type="number" value={form.totalLoan} onChange={(e) => setForm((s) => ({ ...s, totalLoan: e.target.value }))} />
          </Field>
          <Field label="Jumlah angsuran (bulan)" required>
            <Input type="number" value={form.installmentCount} onChange={(e) => setForm((s) => ({ ...s, installmentCount: e.target.value }))} />
          </Field>
          <Field label="Tanggal pengajuan" required>
            <Input type="date" value={form.requestDate} onChange={(e) => setForm((s) => ({ ...s, requestDate: e.target.value }))} />
          </Field>
        </div>
      </Dialog>

      {/* Payoff */}
      <Dialog
        open={!!payoff}
        onClose={() => setPayoff(null)}
        title="Pelunasan Dipercepat"
        description="Sisa pinjaman dipotong sekaligus pada periode payroll yang dipilih."
        size="sm"
        footer={
          <>
            {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
            <Button variant="secondary" onClick={() => setPayoff(null)}>Batal</Button>
            <Button onClick={doPayoff} loading={busy}>Terapkan</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Bulan">
            <Input type="number" min={1} max={12} value={payoffPeriod.month} onChange={(e) => setPayoffPeriod((s) => ({ ...s, month: Number(e.target.value) }))} />
          </Field>
          <Field label="Tahun">
            <Input type="number" value={payoffPeriod.year} onChange={(e) => setPayoffPeriod((s) => ({ ...s, year: Number(e.target.value) }))} />
          </Field>
        </div>
      </Dialog>

      {/* Detail installments */}
      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Cicilan · ${detail.employeeName}` : ""}
        description={detail ? `${formatRupiah(detail.totalLoan)} · ${detail.installmentCount}× · sisa ${formatRupiah(detail.remainingBalance)}` : ""}
        size="md"
      >
        {detail ? (
          detail.installments.length === 0 ? (
            <p className="text-sm text-ink-2">Belum ada jadwal cicilan (menunggu approval).</p>
          ) : (
            <ul className="divide-y divide-line">
              {detail.installments.map((it) => (
                <li key={it.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-ink">{it.monthLabel}</span>
                  <span className="flex items-center gap-2">
                    <span className="nums text-ink-2">{formatRupiah(it.plannedDeduction)}</span>
                    <StatusBadge status={it.isPaid ? "lunas" : "belum"} />
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </Dialog>
    </div>
  );
}
