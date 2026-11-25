"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Undo2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";
import { formatRupiah, formatDate } from "@/lib/format";

type Item = {
  employeeId: number; name: string; nip: string; role: string;
  employmentStatus: string; status: "lunas" | "belum_lunas";
  plannedTotal: number; deductedTotal: number; returnAmount: number;
  returned: boolean; returnedAmount: number | null; returnedDate: string | null; returnedNote: string | null;
};

export function ContractReturnsManager({ rows }: { rows: Item[] }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [mark, setMark] = useState<Item | null>(null);
  const [form, setForm] = useState({ nominal: "", tanggal: today, catatan: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function openMark(it: Item) {
    setMark(it);
    setForm({ nominal: String(it.returnAmount || 0), tanggal: today, catatan: "" });
    setErr("");
  }

  async function doMark() {
    if (!mark) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/contract-returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark", employeeId: mark.employeeId, nominal: Number(form.nominal), tanggal: form.tanggal, catatan: form.catatan || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal.");
      setMark(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal.");
    } finally {
      setBusy(false);
    }
  }

  async function unmark(it: Item) {
    if (!confirm(`Batalkan status pengembalian untuk ${it.name}?`)) return;
    const res = await fetch("/api/admin/contract-returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unmark", employeeId: it.employeeId }),
    });
    if (res.ok) router.refresh();
    else alert("Gagal membatalkan.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengembalian Kontrak"
        description="Deposit kontrak yang harus dikembalikan ke karyawan. Tandai bila sudah dikembalikan."
      />

      <Card>
        {rows.length === 0 ? (
          <div className="p-5"><EmptyState icon={<Undo2 className="h-5 w-5" />} title="Tidak ada data pengembalian" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Karyawan</TH>
                  <TH>Kontrak</TH>
                  <TH className="text-right">Terpotong</TH>
                  <TH className="text-right">Harus dikembalikan</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((it) => (
                  <TR key={it.employeeId}>
                    <TD><div className="font-medium text-ink">{it.name}</div><div className="text-[13px] text-ink-2">{it.role || it.nip}</div></TD>
                    <TD><Badge tone={it.status === "lunas" ? "success" : "warning"}>{it.status === "lunas" ? "Lunas" : "Belum lunas"}</Badge></TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(it.deductedTotal)}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(it.returnAmount)}</TD>
                    <TD>
                      {it.returned ? (
                        <div>
                          <StatusBadge status="selesai" />
                          <div className="mt-0.5 text-[12px] text-ink-2">{formatRupiah(it.returnedAmount)} · {formatDate(it.returnedDate)}</div>
                        </div>
                      ) : <StatusBadge status="belum" />}
                    </TD>
                    <TD className="text-right">
                      {it.returned ? (
                        <button onClick={() => unmark(it)} title="Batalkan" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-ink-2 hover:bg-surface-2 hover:text-ink"><RotateCcw className="h-3.5 w-3.5" /> Batalkan</button>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => openMark(it)}>Tandai dikembalikan</Button>
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Dialog open={!!mark} onClose={() => setMark(null)} title={mark ? `Pengembalian · ${mark.name}` : ""} size="sm"
        footer={<>{err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}<Button variant="secondary" onClick={() => setMark(null)}>Batal</Button><Button loading={busy} onClick={doMark}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Nominal dikembalikan (Rp)" required><Input type="number" value={form.nominal} onChange={(e) => setForm((s) => ({ ...s, nominal: e.target.value }))} /></Field>
          <Field label="Tanggal pengembalian"><Input type="date" value={form.tanggal} onChange={(e) => setForm((s) => ({ ...s, tanggal: e.target.value }))} /></Field>
          <Field label="Catatan"><Textarea value={form.catatan} onChange={(e) => setForm((s) => ({ ...s, catatan: e.target.value }))} /></Field>
        </div>
      </Dialog>
    </div>
  );
}
