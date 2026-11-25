"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Input, Field, Select } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";

type KpiItem = { key: string; kpi: string; caraUkur: string; caraPerhitungan: string; bobot: number };
type KpiGroup = { no: number; tugas: string; total: number; items: KpiItem[] };
type InputRow = { aktualData?: string | number; perhitungan?: number; hasilOverride?: "terpenuhi" | "tidak" | null };
type Emp = { id: number; name: string };

function pad(n: number) { return String(n).padStart(2, "0"); }

export function KpiScoringForm({
  title,
  description,
  basePath,
  endpoint,
  month,
  year,
  periodLabel,
  employees,
  selectedId,
  template,
  inputs,
  hariKerja: initialHariKerja,
  omzet,
  placementKey,
}: {
  title: string;
  description: string;
  basePath: string;
  endpoint: string;
  month: number;
  year: number;
  periodLabel: string;
  employees: Emp[];
  selectedId: number | null;
  template: KpiGroup[];
  inputs: Record<string, InputRow>;
  hariKerja: number;
  omzet?: { target: number; realisasi: number };
  placementKey?: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<Record<string, InputRow>>(() => {
    const init: Record<string, InputRow> = {};
    for (const g of template) for (const it of g.items) {
      const v = inputs[it.key] ?? {};
      init[it.key] = { aktualData: v.aktualData ?? "", perhitungan: v.perhitungan ?? 0, hasilOverride: v.hasilOverride ?? null };
    }
    return init;
  });
  const [hariKerja, setHariKerja] = useState(String(initialHariKerja || ""));
  const [omzetT, setOmzetT] = useState(String(omzet?.target ?? ""));
  const [omzetR, setOmzetR] = useState(String(omzet?.realisasi ?? ""));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function nav(params: Record<string, string | number>) {
    const sp = new URLSearchParams({ month: String(month), year: String(year), ...(selectedId ? { emp: String(selectedId) } : {}) });
    for (const [k, v] of Object.entries(params)) sp.set(k, String(v));
    router.push(`${basePath}?${sp.toString()}`);
  }

  async function save() {
    if (!selectedId) return;
    setBusy(true);
    setMsg("");
    try {
      const payload: Record<string, unknown> = {
        employeeId: selectedId, month, year,
        hariKerja: Number(hariKerja) || 0,
        rows: Object.entries(rows).map(([key, v]) => ({ key, aktualData: String(v.aktualData ?? ""), perhitungan: Number(v.perhitungan) || 0, hasilOverride: v.hasilOverride ?? null })),
      };
      if (placementKey) { payload.placementKey = placementKey; payload.omzetTarget = Number(omzetT) || 0; payload.omzetRealisasi = Number(omzetR) || 0; }
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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

  function setCell(key: string, patch: InputRow) {
    setRows((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={`${description} · Periode ${periodLabel}.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedId ?? ""} onChange={(e) => nav({ emp: e.target.value })} className="h-10 w-auto">
              {employees.length === 0 ? <option value="">— tidak ada karyawan —</option> : null}
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </Select>
            <input type="month" value={`${year}-${pad(month)}`} onChange={(e) => { const [y, m] = e.target.value.split("-"); nav({ month: Number(m), year: Number(y) }); }} className="h-10 rounded-md border border-line bg-surface px-3 text-sm text-ink" />
            <Button onClick={save} loading={busy} disabled={!selectedId}><Save className="h-4 w-4" /> Simpan</Button>
          </div>
        }
      />
      {msg ? <p className="text-[13px] text-ink-2">{msg}</p> : null}

      {employees.length === 0 || !selectedId ? (
        <EmptyState icon={<BarChart3 className="h-5 w-5" />} title="Tidak ada karyawan untuk dinilai" />
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle>Parameter periode</CardTitle></CardHeader>
            <div className="grid gap-4 p-5 sm:grid-cols-3">
              <Field label="Hari kerja"><Input type="number" value={hariKerja} onChange={(e) => setHariKerja(e.target.value)} /></Field>
              {placementKey ? (
                <>
                  <Field label="Target omzet"><Input type="number" value={omzetT} onChange={(e) => setOmzetT(e.target.value)} /></Field>
                  <Field label="Realisasi omzet"><Input type="number" value={omzetR} onChange={(e) => setOmzetR(e.target.value)} /></Field>
                </>
              ) : null}
            </div>
          </Card>

          {template.map((g) => (
            <Card key={g.no} className="overflow-hidden p-0">
              <CardHeader><CardTitle>{g.no}. {g.tugas}</CardTitle><span className="text-[13px] text-ink-2">Bobot {g.total}%</span></CardHeader>
              <TableWrap>
                <Table>
                  <THead>
                    <TR><TH className="min-w-[220px]">KPI</TH><TH>Cara ukur</TH><TH className="text-right">Bobot</TH><TH>Data aktual</TH><TH className="text-right">Perhitungan</TH><TH>Hasil</TH></TR>
                  </THead>
                  <TBody>
                    {g.items.map((it) => {
                      const r = rows[it.key] ?? {};
                      return (
                        <TR key={it.key}>
                          <TD className="text-ink"><div className="font-medium">{it.kpi}</div><div className="text-[12px] text-ink-2">{it.caraPerhitungan}</div></TD>
                          <TD className="text-[13px] text-ink-2">{it.caraUkur}</TD>
                          <TD className="nums text-right text-ink-2">{it.bobot}%</TD>
                          <TD><Input value={String(r.aktualData ?? "")} onChange={(e) => setCell(it.key, { aktualData: e.target.value })} className="h-9 min-w-[120px]" /></TD>
                          <TD><Input type="number" value={String(r.perhitungan ?? 0)} onChange={(e) => setCell(it.key, { perhitungan: Number(e.target.value) })} className="h-9 w-24 text-right" /></TD>
                          <TD>
                            <Select value={r.hasilOverride ?? ""} onChange={(e) => setCell(it.key, { hasilOverride: (e.target.value || null) as "terpenuhi" | "tidak" | null })} className="h-9 w-32">
                              <option value="">Auto</option>
                              <option value="terpenuhi">Terpenuhi</option>
                              <option value="tidak">Tidak</option>
                            </Select>
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              </TableWrap>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
