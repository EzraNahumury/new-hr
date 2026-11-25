"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Field, Select } from "@/components/ui/Input";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Profile = Record<string, any>;

export function ProfileForm({ profile, religions }: { profile: Profile; religions: string[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: profile.name ?? "",
    gender: profile.gender ?? "",
    birthPlace: profile.birthPlace ?? "",
    birthDate: profile.birthDate ?? "",
    nik: profile.nik ?? "",
    religion: profile.religion ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    addressKtp: profile.addressKtp ?? "",
    addressCurrent: profile.addressCurrent ?? "",
    bank: profile.bank ?? "",
    accountNumber: profile.accountNumber ?? "",
  });
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  async function submit() {
    setBusy(true); setMsg(""); setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.set(k, String(v ?? "")));
      if (profile.ktpPhoto) fd.set("ktpPhotoLink", String(profile.ktpPhoto));
      if (ktpFile) fd.set("ktpFile", ktpFile);
      const res = await fetch("/api/employee/profile", { method: "PUT", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      setMsg(data.message || "Tersimpan.");
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
        title="Profil Pribadi"
        description="Lengkapi data diri Anda. Data kerja (NIP, jabatan, kontrak) dikelola oleh admin."
        actions={<Button onClick={submit} loading={busy}><Save className="h-4 w-4" /> Simpan</Button>}
      />
      {msg ? <p className="text-[13px] text-success">{msg}</p> : null}
      {err ? <p className="text-[13px] text-danger">{err}</p> : null}

      <Card>
        <CardHeader><CardTitle>Data kerja</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge tone="neutral">NIP: {profile.nip || "—"}</Badge>
          <Badge tone="neutral">Jabatan: {profile.role || "—"}</Badge>
          <Badge tone="neutral">Departemen: {profile.department || "—"}</Badge>
          <Badge tone="neutral">Divisi: {profile.division || "—"}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Data diri</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Nama" required><Input value={form.name} onChange={set("name")} /></Field>
          <Field label="Jenis kelamin"><Select value={form.gender} onChange={set("gender")}><option value="">—</option><option value="laki-laki">Laki-laki</option><option value="perempuan">Perempuan</option></Select></Field>
          <Field label="No. telepon"><Input value={form.phoneNumber} onChange={set("phoneNumber")} /></Field>
          <Field label="Tempat lahir"><Input value={form.birthPlace} onChange={set("birthPlace")} /></Field>
          <Field label="Tanggal lahir"><Input type="date" value={form.birthDate} onChange={set("birthDate")} /></Field>
          <Field label="NIK"><Input value={form.nik} onChange={set("nik")} /></Field>
          <Field label="Agama"><Select value={form.religion} onChange={set("religion")}><option value="">—</option>{religions.map((r) => <option key={r} value={r}>{r}</option>)}</Select></Field>
          <Field label="Bank"><Input value={form.bank} onChange={set("bank")} /></Field>
          <Field label="No. rekening"><Input value={form.accountNumber} onChange={set("accountNumber")} /></Field>
          <Field label="Alamat KTP" className="sm:col-span-2 lg:col-span-3"><Input value={form.addressKtp} onChange={set("addressKtp")} /></Field>
          <Field label="Alamat domisili" className="sm:col-span-2 lg:col-span-3"><Input value={form.addressCurrent} onChange={set("addressCurrent")} /></Field>
          <Field label="Foto KTP (opsional, ganti)" className="sm:col-span-2 lg:col-span-3">
            <input type="file" accept="image/*" onChange={(e) => setKtpFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-ink file:mr-3 file:rounded-md file:border file:border-line file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-ink" />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
