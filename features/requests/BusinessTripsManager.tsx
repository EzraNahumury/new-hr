"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X, ExternalLink, Plane } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";
import { formatDate } from "@/lib/format";

type Trip = {
  id: number;
  employeeName: string;
  nip: string | null;
  startDate: string;
  endDate: string;
  letterPath: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  adminNote: string | null;
  approverName: string | null;
};

function uploadUrl(p: string) {
  return `/uploads/${String(p).replace(/^\/?uploads\//, "")}`;
}

export function BusinessTripsManager({ mode, rows }: { mode: "admin" | "employee"; rows: Trip[] }) {
  const router = useRouter();
  const isAdmin = mode === "admin";
  const today = new Date().toISOString().slice(0, 10);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate: today, endDate: today, note: "" });
  const [file, setFile] = useState<File | null>(null);
  const [detail, setDetail] = useState<Trip | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const counts = useMemo(() => ({
    pending: rows.filter((r) => r.status === "pending").length,
  }), [rows]);

  async function submit() {
    if (!file) { setErr("Surat perjalanan dinas wajib diupload."); return; }
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.set("startDate", form.startDate);
      fd.set("endDate", form.endDate);
      if (form.note) fd.set("note", form.note);
      fd.set("letter", file);
      const res = await fetch("/api/employee/business-trips", { method: "POST", body: fd });
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
      const res = await fetch(`/api/admin/business-trips/${id}`, {
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
        title="Perjalanan Dinas"
        description={isAdmin ? "Approval perjalanan dinas. Approve otomatis mengisi absensi hadir sepanjang tanggal dinas." : "Ajukan perjalanan dinas luar kota dengan melampirkan surat."}
        actions={
          isAdmin ? (
            counts.pending ? <Badge tone="warning" dot>{counts.pending} menunggu</Badge> : null
          ) : (
            <Button onClick={() => { setShowForm(true); setErr(""); }}><Plus className="h-4 w-4" /> Ajukan</Button>
          )
        }
      />

      <Card>
        {rows.length === 0 ? (
          <div className="p-5"><EmptyState icon={<Plane className="h-5 w-5" />} title="Belum ada perjalanan dinas" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  {isAdmin ? <TH>Karyawan</TH> : null}
                  <TH>Periode</TH>
                  <TH>Surat</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <TR key={r.id}>
                    {isAdmin ? (
                      <TD><div className="font-medium text-ink">{r.employeeName}</div><div className="text-[13px] text-ink-2">{r.nip || "—"}</div></TD>
                    ) : null}
                    <TD className="text-ink-2">{formatDate(r.startDate)} – {formatDate(r.endDate)}</TD>
                    <TD>
                      {r.letterPath ? (
                        <a href={uploadUrl(r.letterPath)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                          <ExternalLink className="h-3.5 w-3.5" /> Lihat
                        </a>
                      ) : "—"}
                    </TD>
                    <TD><StatusBadge status={r.status} /></TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        {isAdmin && r.status === "pending" ? (
                          <>
                            <button onClick={() => { setDetail(r); setNote(""); }} className="rounded-md px-2 py-1 text-[13px] font-medium text-primary hover:bg-primary-weak">Review</button>
                          </>
                        ) : (
                          <span className="text-[13px] text-ink-2">{r.adminNote || (r.note ? "" : "—")}</span>
                        )}
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      {/* Employee submit */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} title="Ajukan Perjalanan Dinas" size="sm"
        footer={<>
          {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
          <Button variant="secondary" onClick={() => setShowForm(false)}>Batal</Button>
          <Button onClick={submit} loading={busy}>Kirim</Button>
        </>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal mulai" required><Input type="date" value={form.startDate} onChange={(e) => setForm((s) => ({ ...s, startDate: e.target.value }))} /></Field>
            <Field label="Tanggal selesai" required><Input type="date" value={form.endDate} onChange={(e) => setForm((s) => ({ ...s, endDate: e.target.value }))} /></Field>
          </div>
          <Field label="Catatan"><Textarea value={form.note} onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))} /></Field>
          <Field label="Surat perjalanan dinas" required hint="PDF / gambar.">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-ink file:mr-3 file:rounded-md file:border file:border-line file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-ink" />
          </Field>
        </div>
      </Dialog>

      {/* Admin review */}
      <Dialog open={!!detail} onClose={() => setDetail(null)} title={detail ? `Dinas · ${detail.employeeName}` : ""}
        description={detail ? `${formatDate(detail.startDate)} – ${formatDate(detail.endDate)}` : ""} size="md"
        footer={detail ? <>
          {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
          <Button variant="danger" onClick={() => decide(detail.id, "rejected")} loading={busy}><X className="h-4 w-4" /> Reject</Button>
          <Button onClick={() => decide(detail.id, "approved")} loading={busy}><Check className="h-4 w-4" /> Approve</Button>
        </> : null}>
        {detail ? (
          <div className="space-y-3 text-sm">
            {detail.note ? <p className="text-ink">{detail.note}</p> : <p className="text-ink-2">Tanpa catatan karyawan.</p>}
            {detail.letterPath ? (
              <a href={uploadUrl(detail.letterPath)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"><ExternalLink className="h-4 w-4" /> Lihat surat</a>
            ) : null}
            <Field label="Catatan admin (opsional)"><Textarea value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
