"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Undo2, Send as SendIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { formatRupiah } from "@/lib/format";

type Pending = { id: number; name: string; role: string | null; division: string | null; periodLabel: string | null; extra?: string | null; amount?: number };
type Log = { id: number; nomorSlip: string | null; name: string; distributedBy: string | null; distributedAt: string | null; slipStatus: string | null; isRead: boolean };

export function DistributionManager({
  title,
  description,
  pending,
  logs,
  idField,
  apiBase,
  canUndo,
  showAmount = false,
}: {
  title: string;
  description: string;
  pending: Pending[];
  logs: Log[];
  idField: "payrollIds" | "payrollBonusIds";
  apiBase: string;
  canUndo: boolean;
  showAmount?: boolean;
}) {
  const router = useRouter();
  const [sel, setSel] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const allSelected = pending.length > 0 && sel.length === pending.length;

  async function distribute() {
    if (sel.length === 0) { setMsg("Pilih minimal satu karyawan."); return; }
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [idField]: sel }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal.");
      setMsg(data.message || "Terkirim.");
      setSel([]);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Gagal.");
    } finally {
      setBusy(false);
    }
  }

  async function undo(logId: number) {
    if (!confirm("Batalkan distribusi slip ini?")) return;
    const res = await fetch(apiBase, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ logIds: [logId] }) });
    if (res.ok) router.refresh();
    else alert("Gagal membatalkan.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={<Button onClick={distribute} loading={busy} disabled={sel.length === 0}><Send className="h-4 w-4" /> Distribusi ({sel.length})</Button>}
      />
      {msg ? <p className="text-[13px] text-ink-2">{msg}</p> : null}

      <Card className="overflow-hidden p-0">
        <CardHeader><CardTitle>Menunggu distribusi</CardTitle></CardHeader>
        {pending.length === 0 ? (
          <div className="p-5"><EmptyState icon={<SendIcon className="h-5 w-5" />} title="Tidak ada slip menunggu" description="Semua slip periode ini sudah terdistribusi." /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH className="w-10">
                    <input type="checkbox" checked={allSelected} onChange={(e) => setSel(e.target.checked ? pending.map((p) => p.id) : [])} className="h-4 w-4 accent-[color:var(--primary)]" />
                  </TH>
                  <TH>Karyawan</TH>
                  <TH>Periode</TH>
                  {showAmount ? <TH>Tipe</TH> : null}
                  {showAmount ? <TH className="text-right">Nominal</TH> : null}
                </TR>
              </THead>
              <TBody>
                {pending.map((p) => (
                  <TR key={p.id}>
                    <TD>
                      <input type="checkbox" checked={sel.includes(p.id)} onChange={(e) => setSel((s) => e.target.checked ? [...s, p.id] : s.filter((x) => x !== p.id))} className="h-4 w-4 accent-[color:var(--primary)]" />
                    </TD>
                    <TD><div className="font-medium text-ink">{p.name}</div><div className="text-[13px] text-ink-2">{p.role || p.division || "—"}</div></TD>
                    <TD className="text-ink-2">{p.periodLabel || "—"}</TD>
                    {showAmount ? <TD>{p.extra ? <Badge tone="neutral">{p.extra}</Badge> : "—"}</TD> : null}
                    {showAmount ? <TD className="nums text-right text-ink">{formatRupiah(p.amount ?? 0)}</TD> : null}
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Card className="overflow-hidden p-0">
        <CardHeader><CardTitle>Riwayat distribusi</CardTitle></CardHeader>
        {logs.length === 0 ? (
          <div className="p-5"><EmptyState title="Belum ada distribusi" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>No. Slip</TH><TH>Karyawan</TH><TH>Oleh</TH><TH>Waktu</TH><TH>Status</TH>
                  {canUndo ? <TH className="text-right">Aksi</TH> : null}
                </TR>
              </THead>
              <TBody>
                {logs.map((l) => (
                  <TR key={l.id}>
                    <TD className="nums text-ink-2">{l.nomorSlip || "—"}</TD>
                    <TD className="font-medium text-ink">{l.name}</TD>
                    <TD className="text-ink-2">{l.distributedBy || "—"}</TD>
                    <TD className="text-ink-2">{l.distributedAt || "—"}</TD>
                    <TD><StatusBadge status={l.slipStatus} /></TD>
                    {canUndo ? (
                      <TD className="text-right">
                        <button onClick={() => undo(l.id)} title="Batalkan" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-ink-2 hover:bg-surface-2 hover:text-ink"><Undo2 className="h-3.5 w-3.5" /> Batalkan</button>
                      </TD>
                    ) : null}
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>
    </div>
  );
}
