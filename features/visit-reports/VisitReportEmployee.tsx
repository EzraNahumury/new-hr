"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Camera, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/Feedback";
import { formatDateTime } from "@/lib/format";

type Report = {
  id: number; namaToko: string; status: string | null; waktuSubmit: string;
  pic: string | null; produkDitawarkan: string | null; fotoPath: string;
  latitude: number | null; longitude: number | null;
};

function uploadUrl(p: string) {
  return `/uploads/${String(p).replace(/^\/?uploads\//, "")}`;
}

const EMPTY = {
  namaToko: "", jenisKlien: "", pic: "", noHpPic: "",
  produkDitawarkan: "", kebutuhanKlien: "", potensiOrder: "", status: "",
};

export function VisitReportEmployee({ reports, tanggal }: { reports: Report[]; tanggal: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY });
  const [photo, setPhoto] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsMsg, setGpsMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  function onPhoto(file: File | null) {
    if (!file) return setPhoto("");
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  function getLocation() {
    if (!navigator.geolocation) { setGpsMsg("Perangkat tidak mendukung GPS."); return; }
    setGpsMsg("Mengambil lokasi…");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsMsg("Lokasi terkunci."); },
      () => setGpsMsg("Gagal mengambil lokasi. Izinkan akses lokasi."),
      { enableHighAccuracy: true, timeout: 20000 },
    );
  }

  async function submit() {
    setErr(""); setOk("");
    if (!photo) { setErr("Foto kunjungan wajib diambil."); return; }
    if (!coords) { setErr("Lokasi GPS wajib diambil."); return; }
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.set(k, v));
      fd.set("photoDataUrl", photo);
      fd.set("latitude", String(coords.lat));
      fd.set("longitude", String(coords.lng));
      const res = await fetch("/api/employee/visit-report", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      setOk("Laporan kunjungan tersimpan.");
      setForm({ ...EMPTY }); setPhoto(""); setCoords(null); setGpsMsg("");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan Kunjungan" description="Isi laporan kunjungan toko/klien dengan foto dan lokasi." />

      <Card>
        <CardHeader><CardTitle>Laporan baru</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama toko" required><Input value={form.namaToko} onChange={set("namaToko")} /></Field>
            <Field label="Jenis klien" required><Input value={form.jenisKlien} onChange={set("jenisKlien")} /></Field>
            <Field label="PIC" required><Input value={form.pic} onChange={set("pic")} /></Field>
            <Field label="No. HP PIC" required><Input value={form.noHpPic} onChange={set("noHpPic")} /></Field>
            <Field label="Status" required><Input value={form.status} onChange={set("status")} placeholder="mis. Prospek / Deal" /></Field>
            <Field label="Potensi order"><Input value={form.potensiOrder} onChange={set("potensiOrder")} /></Field>
          </div>
          <Field label="Produk ditawarkan" required><Textarea value={form.produkDitawarkan} onChange={set("produkDitawarkan")} /></Field>
          <Field label="Kebutuhan klien"><Textarea value={form.kebutuhanKlien} onChange={set("kebutuhanKlien")} /></Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Foto kunjungan" required>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-2 hover:bg-surface-2">
                <Camera className="h-4 w-4" /> {photo ? "Ganti foto" : "Ambil / pilih foto"}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0] ?? null)} />
              </label>
              {photo ? <img src={photo} alt="preview" className="mt-2 h-28 w-auto rounded-md border border-line object-cover" /> : null}
            </Field>
            <Field label="Lokasi GPS" required>
              <Button type="button" variant="secondary" onClick={getLocation}><MapPin className="h-4 w-4" /> Ambil lokasi</Button>
              <p className="mt-1 text-[13px] text-ink-2">
                {coords ? <span className="text-success">✓ {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span> : gpsMsg || "Belum diambil."}
              </p>
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={submit} loading={busy}><Check className="h-4 w-4" /> Kirim Laporan</Button>
            {err ? <span className="text-[13px] text-danger">{err}</span> : null}
            {ok ? <span className="text-[13px] text-success">{ok}</span> : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Kunjungan hari ini</CardTitle></CardHeader>
        {reports.length === 0 ? (
          <CardContent><EmptyState title="Belum ada kunjungan hari ini" description={`Tanggal ${tanggal}.`} /></CardContent>
        ) : (
          <CardContent className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-3 rounded-lg border border-line p-3">
                <div className="min-w-0">
                  <div className="font-medium text-ink">{r.namaToko}</div>
                  <div className="text-[13px] text-ink-2">{r.pic ? `${r.pic} · ` : ""}{formatDateTime(r.waktuSubmit)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {r.status ? <Badge tone="info">{r.status}</Badge> : null}
                  {r.fotoPath ? <a href={uploadUrl(r.fotoPath)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><ExternalLink className="h-4 w-4" /></a> : null}
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
