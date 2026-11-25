"use client";

import { useMemo, useState } from "react";
import { Search, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Feedback";

type Candidate = { id: number; nama: string; penempatan: string | null; jabatan: string | null };

export function JadwalAksesManager({
  candidates,
  grantedIds,
}: {
  candidates: Candidate[];
  grantedIds: number[];
}) {
  const [granted, setGranted] = useState<Set<number>>(new Set(grantedIds));
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [err, setErr] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return candidates;
    return candidates.filter((c) =>
      [c.nama, c.jabatan, c.penempatan].filter(Boolean).some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [q, candidates]);

  async function toggle(id: number, next: boolean) {
    setBusyId(id);
    setErr("");
    try {
      const res = await fetch("/api/spv/jadwal-akses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ karyawanId: id, granted: next }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Gagal mengubah akses.");
      }
      setGranted((s) => {
        const n = new Set(s);
        if (next) n.add(id);
        else n.delete(id);
        return n;
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal mengubah akses.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perizinan Akses Set Jadwal"
        description="Beri atau cabut izin karyawan untuk mengatur jadwal (selain manager/supervisor yang sudah otomatis bisa)."
      />
      {err ? <p className="text-[13px] text-danger">{err}</p> : null}

      <Card>
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama, jabatan, penempatan…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
          <Badge tone="brand">{granted.size} diberi akses</Badge>
        </div>

        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<KeyRound className="h-5 w-5" />} title="Tidak ada karyawan" />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((c) => {
              const on = granted.has(c.id);
              return (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink">{c.nama}</div>
                    <div className="truncate text-[13px] text-ink-2">
                      {[c.jabatan, c.penempatan].filter(Boolean).join(" · ") || "—"}
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={on}
                    disabled={busyId === c.id}
                    onClick={() => toggle(c.id, !on)}
                    className={
                      "relative h-6 w-11 flex-none rounded-full transition-colors disabled:opacity-50 " +
                      (on ? "bg-primary" : "bg-line-strong")
                    }
                  >
                    <span
                      className={
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform " +
                        (on ? "translate-x-[22px]" : "translate-x-0.5")
                      }
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
