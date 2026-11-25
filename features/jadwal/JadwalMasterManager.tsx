"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";

type Karyawan = { id: number; nama: string; penempatan: string; subDivisi: string | null; jabatan: string | null };
type MasterItem = { karyawanId: number; hari: number; shift: string };
type Opt = { value: string; label: string };

const DAYS = [
  { hari: 1, label: "Senin" },
  { hari: 2, label: "Selasa" },
  { hari: 3, label: "Rabu" },
  { hari: 4, label: "Kamis" },
  { hari: 5, label: "Jumat" },
  { hari: 6, label: "Sabtu" },
  { hari: 7, label: "Minggu" },
];

function keyOf(kid: number, hari: number) {
  return `${kid}|${hari}`;
}

export function JadwalMasterManager({
  karyawanList,
  master,
  optionsByKaryawan,
}: {
  karyawanList: Karyawan[];
  master: MasterItem[];
  optionsByKaryawan: Record<number, Opt[]>;
}) {
  const router = useRouter();

  const initial = useMemo(() => {
    const m: Record<string, string> = {};
    for (const it of master) m[keyOf(it.karyawanId, it.hari)] = it.shift;
    return m;
  }, [master]);

  const [cur, setCur] = useState<Record<string, string>>(() => ({ ...initial }));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const dirty = useMemo(() => {
    const keys = new Set([...Object.keys(initial), ...Object.keys(cur)]);
    for (const k of keys) if ((initial[k] ?? "") !== (cur[k] ?? "")) return true;
    return false;
  }, [initial, cur]);

  async function save() {
    setBusy(true);
    setMsg("");
    const entries: MasterItem[] = [];
    const removeKeys: { karyawanId: number; hari: number }[] = [];
    const keys = new Set([...Object.keys(initial), ...Object.keys(cur)]);
    for (const k of keys) {
      const [kid, hari] = k.split("|").map(Number);
      const now = cur[k] ?? "";
      const was = initial[k] ?? "";
      if (now === was) continue;
      if (now) entries.push({ karyawanId: kid, hari, shift: now });
      else removeKeys.push({ karyawanId: kid, hari });
    }
    try {
      const res = await fetch("/api/spv/jadwal-master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries, removeKeys }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      setMsg(data.message || "Tersimpan.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Set Jadwal"
        description="Pola shift mingguan (Senin–Minggu) per karyawan. Menyimpan otomatis menerapkannya ke Bagan periode berjalan."
        actions={
          <Button onClick={save} loading={busy} disabled={!dirty}>
            <Save className="h-4 w-4" /> Simpan & Terapkan
          </Button>
        }
      />
      {msg ? <p className="text-[13px] text-ink-2">{msg}</p> : null}

      <Card className="overflow-hidden p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-surface-2 text-ink-2">
              <tr>
                <th className="sticky left-0 z-10 min-w-[200px] border-b border-line bg-surface-2 px-4 py-2.5 text-left font-medium">
                  Karyawan
                </th>
                {DAYS.map((d) => (
                  <th key={d.hari} className="border-b border-l border-line px-2 py-2.5 text-center font-medium" style={{ minWidth: 110 }}>
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {karyawanList.map((k) => {
                const opts = optionsByKaryawan[k.id] ?? [{ value: "", label: "—" }];
                return (
                  <tr key={k.id} className="hover:bg-surface-2/40">
                    <td className="sticky left-0 z-10 min-w-[200px] border-b border-line bg-surface px-4 py-2">
                      <div className="truncate font-medium text-ink">{k.nama}</div>
                      <div className="truncate text-[12px] text-ink-2">{k.penempatan || k.jabatan || "—"}</div>
                    </td>
                    {DAYS.map((d) => {
                      const key = keyOf(k.id, d.hari);
                      return (
                        <td key={d.hari} className="border-b border-l border-line p-0.5">
                          <select
                            value={cur[key] ?? ""}
                            onChange={(e) => setCur((s) => ({ ...s, [key]: e.target.value }))}
                            className="h-8 w-full rounded border border-transparent bg-transparent px-1 text-[12px] text-ink hover:border-line focus:border-primary"
                          >
                            {opts.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {karyawanList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-ink-2">
                    Tidak ada karyawan dengan flag Shift aktif.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
