"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select, Field } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";

type Detail = {
  code: string;
  status: string | null;
  lateMinutes?: number;
  needsApproval?: boolean;
  approvalStatus?: string | null;
};
type Row = {
  employeeId: number;
  name: string;
  nip: string;
  division: string;
  daily: Record<number, Detail>;
};
type CodeOpt = { code: string; label: string };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function cellTone(status: string | null | undefined): string {
  const s = (status ?? "").toLowerCase();
  if (s.includes("hadir") || s === "h") return "bg-success-weak text-success";
  if (s.includes("alfa") || s.includes("alpa")) return "bg-danger-weak text-danger";
  if (s.includes("setengah") || s.includes("telat") || s.includes("terlambat")) return "bg-warning-weak text-warning";
  if (s.includes("izin") || s.includes("sakit") || s.includes("cuti") || s.includes("dinas")) return "bg-info-weak text-info";
  return "bg-surface-2 text-ink-2";
}

export function AttendanceSheet({
  days,
  rows,
  month,
  year,
  holidayMap,
  codeOptions,
}: {
  days: number[];
  rows: Row[];
  month: number;
  year: number;
  holidayMap: Record<string, string>;
  codeOptions: CodeOpt[];
  canEditHrd: boolean;
}) {
  const router = useRouter();
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const dateFor = (d: number) =>
    d >= 26 ? `${prevYear}-${pad(prevMonth)}-${pad(d)}` : `${year}-${pad(month)}-${pad(d)}`;

  const [cell, setCell] = useState<{ employeeId: number; name: string; day: number; date: string; code: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function openCell(r: Row, d: number) {
    const detail = r.daily[d];
    const date = dateFor(d);
    setCell({ employeeId: r.employeeId, name: r.name, day: d, date, code: detail?.code ?? "" });
    setCode(detail?.code ?? "");
    setErr("");
  }

  async function save() {
    if (!cell || !code) {
      setErr("Pilih kode absensi.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/attendance/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: cell.employeeId, date: cell.date, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      setCell(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="border-collapse text-[13px]">
        <thead className="bg-surface-2 text-ink-2">
          <tr>
            <th className="sticky left-0 z-10 min-w-[200px] border-b border-line bg-surface-2 px-4 py-2.5 text-left font-medium">
              Karyawan
            </th>
            {days.map((d) => {
              const holiday = holidayMap[dateFor(d)];
              return (
                <th
                  key={d}
                  title={holiday || undefined}
                  className={
                    "border-b border-l border-line px-0 py-2.5 text-center font-medium " +
                    (holiday ? "text-danger" : "")
                  }
                  style={{ minWidth: 34 }}
                >
                  {d}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.employeeId} className="hover:bg-surface-2/40">
              <td className="sticky left-0 z-10 min-w-[200px] border-b border-line bg-surface px-4 py-2">
                <div className="truncate font-medium text-ink">{r.name}</div>
                <div className="truncate text-[12px] text-ink-2">{r.division || r.nip}</div>
              </td>
              {days.map((d) => {
                const detail = r.daily[d];
                const pending = detail?.needsApproval && detail?.approvalStatus !== "approved";
                return (
                  <td key={d} className="border-b border-l border-line p-0.5 text-center">
                    <button
                      onClick={() => openCell(r, d)}
                      className={
                        "mx-auto flex h-7 w-7 items-center justify-center rounded text-[12px] font-semibold " +
                        cellTone(detail?.status) +
                        (pending ? " ring-1 ring-warning" : "") +
                        " hover:outline hover:outline-1 hover:outline-primary"
                      }
                      title={detail?.status ?? "Belum ada data"}
                    >
                      {detail?.code || "·"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={days.length + 1} className="px-4 py-10 text-center text-sm text-ink-2">
                Tidak ada data absensi pada periode ini.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <Dialog
        open={!!cell}
        onClose={() => setCell(null)}
        title={cell ? `Absensi · ${cell.name}` : ""}
        description={cell ? `Tanggal ${cell.date}` : ""}
        size="sm"
        footer={
          <>
            {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
            <Button variant="secondary" onClick={() => setCell(null)}>Batal</Button>
            <Button onClick={save} loading={busy}>Simpan</Button>
          </>
        }
      >
        <Field label="Kode absensi" hint="Perubahan menghitung ulang efek payroll sesuai kategori kode.">
          <Select value={code} onChange={(e) => setCode(e.target.value)}>
            <option value="">— pilih kode —</option>
            {codeOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label}
              </option>
            ))}
          </Select>
        </Field>
      </Dialog>
    </div>
  );
}
