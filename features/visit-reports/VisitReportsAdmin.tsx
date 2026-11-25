"use client";

import { useState } from "react";
import { MapPin, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Field } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/Feedback";
import { formatDateTime } from "@/lib/format";

type Report = {
  id: number; employeeName: string; role: string | null; tanggal: string; waktuSubmit: string;
  namaToko: string; jenisKlien: string | null; pic: string | null; noHpPic: string | null;
  produkDitawarkan: string | null; kebutuhanKlien: string | null; potensiOrder: string | null;
  status: string | null; fotoPath: string; latitude: number | null; longitude: number | null;
};

function uploadUrl(p: string) {
  return `/uploads/${String(p).replace(/^\/?uploads\//, "")}`;
}

export function VisitReportsAdmin({
  initialReports,
  startDate,
  endDate,
}: {
  initialReports: Report[];
  startDate: string;
  endDate: string;
}) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);
  const [busy, setBusy] = useState(false);

  async function apply() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/visit-reports?startDate=${start}&endDate=${end}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) setReports(data.reports ?? []);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan Kunjungan" description="Timeline kunjungan sales lapangan dengan foto dan lokasi GPS." />

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3">
          <Field label="Dari tanggal" className="w-40"><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
          <Field label="Sampai tanggal" className="w-40"><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
          <Button onClick={apply} loading={busy}><Search className="h-4 w-4" /> Terapkan</Button>
          <span className="ml-auto self-center"><Badge tone="neutral">{reports.length} kunjungan</Badge></span>
        </CardContent>
      </Card>

      {reports.length === 0 ? (
        <EmptyState icon={<MapPin className="h-5 w-5" />} title="Belum ada laporan" description="Tidak ada kunjungan pada rentang tanggal ini." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {reports.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-ink">{r.namaToko}</h3>
                    <p className="text-[13px] text-ink-2">{r.employeeName}{r.role ? ` · ${r.role}` : ""}</p>
                  </div>
                  {r.status ? <Badge tone="info">{r.status}</Badge> : null}
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
                  <Pair label="Jenis klien" value={r.jenisKlien} />
                  <Pair label="PIC" value={r.pic} />
                  <Pair label="No. HP" value={r.noHpPic} />
                  <Pair label="Potensi order" value={r.potensiOrder} />
                  <Pair label="Produk" value={r.produkDitawarkan} span />
                  <Pair label="Kebutuhan" value={r.kebutuhanKlien} span />
                </dl>
                <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3 text-[13px]">
                  <span className="text-ink-2">{formatDateTime(r.waktuSubmit)}</span>
                  {r.fotoPath ? <a href={uploadUrl(r.fotoPath)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><ExternalLink className="h-3.5 w-3.5" /> Foto</a> : null}
                  {r.latitude != null && r.longitude != null ? (
                    <a href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><MapPin className="h-3.5 w-3.5" /> Lokasi</a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Pair({ label, value, span }: { label: string; value: string | null; span?: boolean }) {
  if (!value) return null;
  return (
    <div className={span ? "col-span-2" : ""}>
      <dt className="text-ink-2">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
