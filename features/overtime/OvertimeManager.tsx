"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Eye, Timer, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Textarea, Field } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";

type Row = {
  id: number;
  nama: string;
  divisi: string | null;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  total_jam: string;
  bukti_lembur: string | null;
  status_approval: "pending" | "approved" | "rejected";
  approver_name: string | null;
  assigned_approver_name: string | null;
  catatan_atasan: string | null;
  catatan_karyawan: string | null;
  jenis_pekerjaan: string | null;
  nama_order: string | null;
  jumlah_qty: number | null;
  target_sebelum_lembur: number | null;
  target_setelah_lembur: number | null;
  approval_flow: "single" | "double";
  first_approval_status: "pending" | "approved" | "rejected" | null;
  first_approver_name: string | null;
};

type Filter = "pending" | "approved" | "rejected" | "all";

export function OvertimeManager({
  rows,
  canApprove,
  apiBase = "/api/admin/overtime",
  title = "Manajemen Lembur",
  description,
}: {
  rows: Row[];
  canApprove: boolean;
  apiBase?: string;
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("pending");
  const [detail, setDetail] = useState<Row | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const counts = useMemo(() => ({
    pending: rows.filter((r) => r.status_approval === "pending").length,
    approved: rows.filter((r) => r.status_approval === "approved").length,
    rejected: rows.filter((r) => r.status_approval === "rejected").length,
    all: rows.length,
  }), [rows]);

  const list = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status_approval === filter)),
    [rows, filter],
  );

  async function decide(id: number, statusApproval: "approved" | "rejected") {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusApproval, catatanAtasan: note || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal memproses.");
      setDetail(null);
      setNote("");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal memproses.");
    } finally {
      setBusy(false);
    }
  }

  const tabs: { key: Filter; label: string }[] = [
    { key: "pending", label: `Menunggu (${counts.pending})` },
    { key: "approved", label: `Disetujui (${counts.approved})` },
    { key: "rejected", label: `Ditolak (${counts.rejected})` },
    { key: "all", label: `Semua (${counts.all})` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={
          description ??
          (canApprove
            ? "Semua pengajuan lembur karyawan. Approve/reject sesuai bukti dan kebutuhan."
            : "Anda bisa melihat pengajuan. Approve/reject hanya untuk admin berwenang.")
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Menunggu" value={counts.pending} tone="warning" icon={<Timer className="h-5 w-5" />} />
        <StatCard label="Disetujui" value={counts.approved} tone="success" icon={<Check className="h-5 w-5" />} />
        <StatCard label="Ditolak" value={counts.rejected} tone="danger" icon={<X className="h-5 w-5" />} />
      </div>

      <Card>
        <div className="flex flex-wrap gap-1 border-b border-line p-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
                (filter === t.key ? "bg-primary-weak text-primary" : "text-ink-2 hover:bg-surface-2 hover:text-ink")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<Timer className="h-5 w-5" />} title="Tidak ada data" description="Belum ada pengajuan lembur pada filter ini." />
          </div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Karyawan</TH>
                  <TH>Tanggal</TH>
                  <TH>Jam</TH>
                  <TH className="text-right">Total</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {list.map((r) => (
                  <TR key={r.id}>
                    <TD>
                      <div className="font-medium text-ink">{r.nama}</div>
                      <div className="text-[13px] text-ink-2">{r.divisi || "—"}</div>
                    </TD>
                    <TD className="text-ink-2">{r.tanggal}</TD>
                    <TD className="nums text-ink-2">{r.jam_mulai}–{r.jam_selesai}</TD>
                    <TD className="nums text-right text-ink">{r.total_jam} jam</TD>
                    <TD>
                      <StatusBadge status={r.status_approval} />
                      {r.approval_flow === "double" ? (
                        <Badge tone="neutral" className="ml-1">2-level</Badge>
                      ) : null}
                    </TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setDetail(r); setNote(""); setErr(""); }} title="Detail" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink">
                          <Eye className="h-4 w-4" />
                        </button>
                        {canApprove && r.status_approval !== "approved" ? (
                          <button onClick={() => decide(r.id, "approved")} title="Approve" className="rounded-md p-1.5 text-ink-2 hover:bg-success-weak hover:text-success">
                            <Check className="h-4 w-4" />
                          </button>
                        ) : null}
                        {canApprove && r.status_approval !== "rejected" ? (
                          <button onClick={() => decide(r.id, "rejected")} title="Reject" className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger">
                            <X className="h-4 w-4" />
                          </button>
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

      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Lembur · ${detail.nama}` : ""}
        description={detail ? `${detail.tanggal} · ${detail.jam_mulai}–${detail.jam_selesai} · ${detail.total_jam} jam` : ""}
        size="md"
        footer={
          canApprove && detail ? (
            <>
              {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
              <Button variant="danger" onClick={() => decide(detail.id, "rejected")} loading={busy}>
                <X className="h-4 w-4" /> Reject
              </Button>
              <Button onClick={() => decide(detail.id, "approved")} loading={busy}>
                <Check className="h-4 w-4" /> Approve
              </Button>
            </>
          ) : null
        }
      >
        {detail ? (
          <div className="space-y-4 text-sm">
            <DetailRow label="Status" value={<StatusBadge status={detail.status_approval} />} />
            <DetailRow label="Jenis pekerjaan" value={detail.jenis_pekerjaan || "—"} />
            {detail.nama_order ? <DetailRow label="Order" value={detail.nama_order} /> : null}
            {detail.jumlah_qty != null ? <DetailRow label="Qty" value={String(detail.jumlah_qty)} /> : null}
            {detail.target_sebelum_lembur != null ? (
              <DetailRow label="Target" value={`${detail.target_sebelum_lembur} → ${detail.target_setelah_lembur ?? "—"}`} />
            ) : null}
            <DetailRow label="Catatan karyawan" value={detail.catatan_karyawan || "—"} />
            {detail.approval_flow === "double" ? (
              <DetailRow
                label="Approval atasan"
                value={`${detail.first_approval_status ?? "pending"}${detail.first_approver_name ? ` · ${detail.first_approver_name}` : ""}`}
              />
            ) : null}
            {detail.approver_name ? <DetailRow label="Diputuskan oleh" value={detail.approver_name} /> : null}
            {detail.catatan_atasan ? <DetailRow label="Catatan atasan" value={detail.catatan_atasan} /> : null}
            {detail.bukti_lembur ? (
              <a
                href={`/uploads/${String(detail.bukti_lembur).replace(/^\/?uploads\//, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" /> Lihat bukti lembur
              </a>
            ) : null}
            {canApprove ? (
              <Field label="Catatan atasan (opsional)">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan untuk keputusan ini…" />
              </Field>
            ) : null}
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-2 last:border-0">
      <span className="text-ink-2">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
