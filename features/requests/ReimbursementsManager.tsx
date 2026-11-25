"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X, ExternalLink, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";
import { formatDate, formatRupiah } from "@/lib/format";

type Reimb = {
  id: number;
  employeeName: string;
  nip: string | null;
  expenseDate: string;
  category: string;
  description: string | null;
  amount: string;
  receiptPath: string;
  status: "pending" | "approved" | "rejected";
  adminNote: string | null;
};

function uploadUrl(p: string) {
  return `/uploads/${String(p).replace(/^\/?uploads\//, "")}`;
}

export function ReimbursementsManager({ mode, rows }: { mode: "admin" | "employee"; rows: Reimb[] }) {
  const router = useRouter();
  const isAdmin = mode === "admin";
  const today = new Date().toISOString().slice(0, 10);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ requestDate: today, expenseDate: today, category: "Perjalanan Dinas", description: "", amount: "" });
  const [file, setFile] = useState<File | null>(null);
  const [detail, setDetail] = useState<Reimb | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pending = useMemo(() => rows.filter((r) => r.status === "pending").length, [rows]);

  async function submit() {
    if (!file) { setErr("Nota wajib diupload."); return; }
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.set("requestDate", form.requestDate);
      fd.set("expenseDate", form.expenseDate);
      fd.set("category", form.category);
      if (form.description) fd.set("description", form.description);
      fd.set("amount", form.amount);
      fd.set("receipt", file);
      const res = await fetch("/api/employee/reimbursements", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal mengirim.");
      setShowForm(false);
      setFile(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal mengirim.");
    } finally {
      setBusy(false);
    }
  }

  async function decide(id: number, status: "approved" | "rejected") {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/reimbursements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal memproses.");
      setDetail(null);
      setNote("");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal memproses.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reimbursement"
        description={isAdmin ? "Approval penggantian biaya karyawan." : "Ajukan penggantian biaya dengan melampirkan nota."}
        actions={
          isAdmin ? (pending ? <Badge tone="warning" dot>{pending} menunggu</Badge> : null)
            : <Button onClick={() => { setShowForm(true); setErr(""); }}><Plus className="h-4 w-4" /> Ajukan</Button>
        }
      />

      <Card>
        {rows.length === 0 ? (
          <div className="p-5"><EmptyState icon={<Receipt className="h-5 w-5" />} title="Belum ada reimburse" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  {isAdmin ? <TH>Karyawan</TH> : null}
                  <TH>Tanggal biaya</TH>
                  <TH>Kategori</TH>
                  <TH className="text-right">Nominal</TH>
                  <TH>Nota</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <TR key={r.id}>
                    {isAdmin ? <TD><div className="font-medium text-ink">{r.employeeName}</div><div className="text-[13px] text-ink-2">{r.nip || "—"}</div></TD> : null}
                    <TD className="text-ink-2">{formatDate(r.expenseDate)}</TD>
                    <TD className="text-ink-2">{r.category}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(r.amount)}</TD>
                    <TD>
                      {r.receiptPath ? (
                        <a href={uploadUrl(r.receiptPath)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ExternalLink className="h-3.5 w-3.5" /> Lihat</a>
                      ) : "—"}
                    </TD>
                    <TD><StatusBadge status={r.status} /></TD>
                    <TD className="text-right">
                      {isAdmin && r.status === "pending" ? (
                        <button onClick={() => { setDetail(r); setNote(""); }} className="rounded-md px-2 py-1 text-[13px] font-medium text-primary hover:bg-primary-weak">Review</button>
                      ) : <span className="text-[13px] text-ink-2">{r.adminNote || "—"}</span>}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Dialog open={showForm} onClose={() => setShowForm(false)} title="Ajukan Reimbursement" size="sm"
        footer={<>
          {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
          <Button variant="secondary" onClick={() => setShowForm(false)}>Batal</Button>
          <Button onClick={submit} loading={busy}>Kirim</Button>
        </>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal pengajuan" required><Input type="date" value={form.requestDate} onChange={(e) => setForm((s) => ({ ...s, requestDate: e.target.value }))} /></Field>
            <Field label="Tanggal biaya" required><Input type="date" value={form.expenseDate} onChange={(e) => setForm((s) => ({ ...s, expenseDate: e.target.value }))} /></Field>
          </div>
          <Field label="Kategori" required><Input value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} /></Field>
          <Field label="Nominal (Rp)" required><Input type="number" value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} /></Field>
          <Field label="Keterangan"><Textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} /></Field>
          <Field label="Nota" required><input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-ink file:mr-3 file:rounded-md file:border file:border-line file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-ink" /></Field>
        </div>
      </Dialog>

      <Dialog open={!!detail} onClose={() => setDetail(null)} title={detail ? `Reimburse · ${detail.employeeName}` : ""}
        description={detail ? `${detail.category} · ${formatRupiah(detail.amount)}` : ""} size="md"
        footer={detail ? <>
          {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
          <Button variant="danger" onClick={() => decide(detail.id, "rejected")} loading={busy}><X className="h-4 w-4" /> Reject</Button>
          <Button onClick={() => decide(detail.id, "approved")} loading={busy}><Check className="h-4 w-4" /> Approve</Button>
        </> : null}>
        {detail ? (
          <div className="space-y-3 text-sm">
            <p className="text-ink">{detail.description || "Tanpa keterangan."}</p>
            {detail.receiptPath ? <a href={uploadUrl(detail.receiptPath)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"><ExternalLink className="h-4 w-4" /> Lihat nota</a> : null}
            <Field label="Catatan admin (opsional)"><Textarea value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
