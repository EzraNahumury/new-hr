"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Coins } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";
import { PayrollPeriodNav } from "./PayrollPeriodNav";
import { formatRupiah } from "@/lib/format";

type Row = { id: number; employeeId: number; number: number; name: string; role: string; bonusTypeLabel: string; amount: number; note: string | null };
type Sheet = { periodMonth: number; periodYear: number; periodLabel: string; totalAmount: number; rows: Row[] };
type PeriodOpt = { month: number; year: number; label: string };

export function PayrollBonusManager({ sheet, periodOptions }: { sheet: Sheet | null; periodOptions: PeriodOpt[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!sheet) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payroll Bonus" />
        <EmptyState icon={<Coins className="h-5 w-5" />} title="Periode tidak tersedia" />
      </div>
    );
  }

  function openEdit(r: Row) {
    setEditing(r);
    setAmount(String(r.amount || 0));
    setNote(r.note ?? "");
    setErr("");
  }

  async function save() {
    if (!editing || !sheet) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/payroll-bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: sheet.periodMonth, year: sheet.periodYear, employeeId: editing.employeeId, amount: Number(amount || 0), note: note || null }),
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
        title="Payroll Bonus"
        description={`Periode ${sheet.periodLabel}. Bonus manual per karyawan (terpisah dari payroll utama & finance).`}
        actions={<PayrollPeriodNav periodOptions={periodOptions} month={sheet.periodMonth} year={sheet.periodYear} basePath="/admin/payroll-bonus" />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total bonus periode" value={<span className="text-2xl">{formatRupiah(sheet.totalAmount)}</span>} tone="brand" icon={<Coins className="h-5 w-5" />} />
        <StatCard label="Karyawan" value={sheet.rows.length} icon={<Coins className="h-5 w-5" />} />
      </div>

      <Card>
        {sheet.rows.length === 0 ? (
          <div className="p-5"><EmptyState icon={<Coins className="h-5 w-5" />} title="Tidak ada data" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>#</TH><TH>Karyawan</TH><TH>Tipe bonus</TH><TH className="text-right">Nominal</TH><TH>Catatan</TH><TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {sheet.rows.map((r) => (
                  <TR key={r.employeeId}>
                    <TD className="text-ink-2">{r.number}</TD>
                    <TD><div className="font-medium text-ink">{r.name}</div><div className="text-[13px] text-ink-2">{r.role}</div></TD>
                    <TD><Badge tone="neutral">{r.bonusTypeLabel}</Badge></TD>
                    <TD className="nums text-right font-medium text-ink">{formatRupiah(r.amount)}</TD>
                    <TD className="text-ink-2">{r.note || "—"}</TD>
                    <TD className="text-right">
                      <button onClick={() => openEdit(r)} title="Edit bonus" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title={editing ? `Bonus · ${editing.name}` : ""} size="sm"
        footer={<>{err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}<Button variant="secondary" onClick={() => setEditing(null)}>Batal</Button><Button loading={busy} onClick={save}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Nominal bonus (Rp)"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
          <Field label="Catatan"><Textarea value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </div>
      </Dialog>
    </div>
  );
}
