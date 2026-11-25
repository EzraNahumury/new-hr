"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";

type Karyawan = { id: number; nama: string; penempatan: string; subDivisi: string | null; jabatan: string | null };
type JadwalItem = { karyawanId: number; tanggal: string; shift: string };
type Opt = { value: string; label: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const DOW = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function keyOf(kid: number, date: string) {
  return `${kid}|${date}`;
}

export function JadwalGridManager({
  basePath,
  year,
  month,
  dates,
  karyawanList,
  initialJadwal,
  optionsByKaryawan,
}: {
  basePath: string;
  year: number;
  month: number;
  dates: string[];
  karyawanList: Karyawan[];
  initialJadwal: JadwalItem[];
  optionsByKaryawan: Record<number, Opt[]>;
}) {
  const router = useRouter();

  const initial = useMemo(() => {
    const m: Record<string, string> = {};
    for (const j of initialJadwal) m[keyOf(j.karyawanId, j.tanggal)] = j.shift;
    return m;
  }, [initialJadwal]);

  const [cur, setCur] = useState<Record<string, string>>(() => ({ ...initial }));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const dirty = useMemo(() => {
    const keys = new Set([...Object.keys(initial), ...Object.keys(cur)]);
    for (const k of keys) if ((initial[k] ?? "") !== (cur[k] ?? "")) return true;
    return false;
  }, [initial, cur]);

  const grouped = useMemo(() => {
    const g = new Map<string, Karyawan[]>();
    for (const k of karyawanList) {
      const key = k.penempatan || "Lainnya";
      if (!g.has(key)) g.set(key, []);
      g.get(key)!.push(k);
    }
    return Array.from(g.entries());
  }, [karyawanList]);

  function go(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    router.push(`${basePath}?year=${y}&month=${m}`);
  }

  async function save() {
    setBusy(true);
    setMsg("");
    const entries: JadwalItem[] = [];
    const removeKeys: { karyawanId: number; tanggal: string }[] = [];
    const keys = new Set([...Object.keys(initial), ...Object.keys(cur)]);
    for (const k of keys) {
      const [kid, date] = k.split("|");
      const now = cur[k] ?? "";
      const was = initial[k] ?? "";
      if (now === was) continue;
      if (now) entries.push({ karyawanId: Number(kid), tanggal: date, shift: now });
      else removeKeys.push({ karyawanId: Number(kid), tanggal: date });
    }
    try {
      const res = await fetch("/api/spv/jadwal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month, entries, removeKeys }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan jadwal.");
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
        title="Set Jadwal Karyawan"
        description="Atur shift & libur per periode payroll (26 bulan lalu – 25 bulan ini). Karyawan dengan flag Shift saja."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button onClick={() => go(-1)} className="rounded-md border border-line p-2 text-ink-2 hover:bg-surface-2 hover:text-ink" aria-label="Sebelumnya">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[120px] text-center text-sm font-medium text-ink">{MONTHS[month - 1]} {year}</span>
              <button onClick={() => go(1)} className="rounded-md border border-line p-2 text-ink-2 hover:bg-surface-2 hover:text-ink" aria-label="Berikutnya">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={save} loading={busy} disabled={!dirty}>
              <Save className="h-4 w-4" /> Simpan
            </Button>
          </div>
        }
      />
      {msg ? <p className="text-[13px] text-ink-2">{msg}</p> : null}

      <Card className="overflow-hidden p-0">
        <div className="w-full overflow-x-auto">
          <table className="border-collapse text-[13px]">
            <thead className="bg-surface-2 text-ink-2">
              <tr>
                <th className="sticky left-0 z-10 min-w-[200px] border-b border-line bg-surface-2 px-4 py-2.5 text-left font-medium">
                  Karyawan
                </th>
                {dates.map((d) => {
                  const dt = new Date(d);
                  const dow = dt.getDay();
                  const isSun = dow === 0;
                  return (
                    <th key={d} className={"border-b border-l border-line px-1 py-1.5 text-center font-medium " + (isSun ? "text-danger" : "")} style={{ minWidth: 92 }}>
                      <div>{dt.getDate()}</div>
                      <div className="text-[11px] font-normal opacity-70">{DOW[dow]}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {grouped.map(([penempatan, list]) => (
                <GroupRows key={penempatan} penempatan={penempatan} list={list} dates={dates} cur={cur} setCur={setCur} optionsByKaryawan={optionsByKaryawan} />
              ))}
              {karyawanList.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-ink-2">
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

function GroupRows({
  penempatan,
  list,
  dates,
  cur,
  setCur,
  optionsByKaryawan,
}: {
  penempatan: string;
  list: Karyawan[];
  dates: string[];
  cur: Record<string, string>;
  setCur: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  optionsByKaryawan: Record<number, Opt[]>;
}) {
  return (
    <>
      <tr className="bg-surface-2/60">
        <td colSpan={dates.length + 1} className="sticky left-0 border-b border-line px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-2">
          {penempatan}
        </td>
      </tr>
      {list.map((k) => {
        const opts = optionsByKaryawan[k.id] ?? [{ value: "", label: "—" }];
        return (
          <tr key={k.id} className="hover:bg-surface-2/40">
            <td className="sticky left-0 z-10 min-w-[200px] border-b border-line bg-surface px-4 py-2">
              <div className="truncate font-medium text-ink">{k.nama}</div>
              <div className="truncate text-[12px] text-ink-2">{k.jabatan || k.subDivisi || "—"}</div>
            </td>
            {dates.map((d) => {
              const key = keyOf(k.id, d);
              return (
                <td key={d} className="border-b border-l border-line p-0.5">
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
    </>
  );
}
