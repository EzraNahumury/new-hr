"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Eye, ClipboardCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Textarea, Field } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";

export type ApprovalItem = {
  id: number;
  nama: string;
  nip: string | null;
  divisi: string | null;
  tanggal: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  jenis: string | null;
  lateMinutes: number;
  status: "pending" | "approved" | "rejected";
  keterangan: string | null;
  catatanAtasan: string | null;
  approverName: string | null;
  fotoMasuk: string | null;
};

type Filter = "pending" | "approved" | "rejected" | "all";

const JENIS: Record<string, string> = {
  telat: "Telat",
  pulang_awal: "Pulang Awal",
  telat_pulang_awal: "Telat & Pulang Awal",
};

export function AttendanceApprovalManager({
  rows,
  apiBase,
  canApprove,
  title = "Approval Absensi",
  description = "Pengajuan telat / pulang awal yang perlu keputusan.",
}: {
  rows: ApprovalItem[];
  apiBase: string;
  canApprove: boolean;
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("pending");
  const [detail, setDetail] = useState<ApprovalItem | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const counts = useMemo(() => ({
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    all: rows.length,
  }), [rows]);

  const list = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
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
      <PageHeader title={title} description={description} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Menunggu" value={counts.pending} tone="warning" icon={<ClipboardCheck className="h-5 w-5" />} />
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
            <EmptyState icon={<ClipboardCheck className="h-5 w-5" />} title="Tidak ada data" description="Belum ada pengajuan pada filter ini." />
          </div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Karyawan</TH>
                  <TH>Tanggal</TH>
                  <TH>Jenis</TH>
                  <TH>Jam</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {list.map((r) => (
                  <TR key={r.id}>
                    <TD>
                      <div className="font-medium text-ink">{r.nama}</div>
                      <div className="text-[13px] text-ink-2">{r.divisi || r.nip || "—"}</div>
                    </TD>
                    <TD className="text-ink-2">{r.tanggal}</TD>
                    <TD className="text-ink-2">{r.jenis ? JENIS[r.jenis] ?? r.jenis : "—"}</TD>
                    <TD className="nums text-ink-2">
                      {r.jamMasuk || "—"}{r.jamPulang ? `–${r.jamPulang}` : ""}
                      {r.lateMinutes ? <span className="ml-1 text-warning">+{r.lateMinutes}m</span> : null}
                    </TD>
                    <TD><StatusBadge status={r.status} /></TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setDetail(r); setNote(""); setErr(""); }} title="Detail" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink">
                          <Eye className="h-4 w-4" />
                        </button>
                        {canApprove && r.status !== "approved" ? (
                          <button onClick={() => decide(r.id, "approved")} title="Approve" className="rounded-md p-1.5 text-ink-2 hover:bg-success-weak hover:text-success">
                            <Check className="h-4 w-4" />
                          </button>
                        ) : null}
                        {canApprove && r.status !== "rejected" ? (
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
        title={detail ? `Approval · ${detail.nama}` : ""}
        description={detail ? `${detail.tanggal}${detail.jenis ? ` · ${JENIS[detail.jenis] ?? detail.jenis}` : ""}` : ""}
        size="md"
        footer={
          canApprove && detail ? (
            <>
              {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
              <Button variant="danger" onClick={() => decide(detail.id, "rejected")} loading={busy}><X className="h-4 w-4" /> Reject</Button>
              <Button onClick={() => decide(detail.id, "approved")} loading={busy}><Check className="h-4 w-4" /> Approve</Button>
            </>
          ) : null
        }
      >
        {detail ? (
          <div className="space-y-3 text-sm">
            <Row label="Jam masuk / pulang" value={`${detail.jamMasuk || "—"} / ${detail.jamPulang || "—"}`} />
            {detail.lateMinutes ? <Row label="Keterlambatan" value={`${detail.lateMinutes} menit`} /> : null}
            <Row label="Alasan karyawan" value={detail.keterangan || "—"} />
            {detail.approverName ? <Row label="Diputuskan oleh" value={detail.approverName} /> : null}
            {detail.catatanAtasan ? <Row label="Catatan atasan" value={detail.catatanAtasan} /> : null}
            {detail.fotoMasuk ? (
              <a
                href={`/uploads/${String(detail.fotoMasuk).replace(/^\/?uploads\//, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" /> Lihat foto presensi
              </a>
            ) : null}
            {canApprove ? (
              <Field label="Catatan atasan (opsional)">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
            ) : null}
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-2 last:border-0">
      <span className="text-ink-2">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
