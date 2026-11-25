"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Field, Select } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";

type ShiftDef = { code: string; label: string; startMin: number; checkoutStartMin: number; toleranceMin: number; isLibur: boolean; isSelectable: boolean; isSystem: boolean };
type ShiftGroup = { id: number; name: string; targetType: string; targetValue: string | null; shiftCodes: string[]; memberIds: number[] };
type Roster = { id: number; nama: string; jabatan: string | null; departemen: string | null; penempatan: string | null };
type Opt = { code: string; label: string };

function pad(n: number) { return String(n).padStart(2, "0"); }
function minToTime(m: number) { return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; }
function timeToMin(t: string) { const [h, m] = t.split(":").map(Number); return (h || 0) * 60 + (m || 0); }

export function SetJadwalManager({
  initialShifts,
  initialGroups,
  roster,
  selectableShifts,
  jabatanOptions,
  departemenOptions,
  penempatanOptions,
}: {
  initialShifts: ShiftDef[];
  initialGroups: ShiftGroup[];
  roster: Roster[];
  selectableShifts: Opt[];
  jabatanOptions: string[];
  departemenOptions: string[];
  penempatanOptions: string[];
}) {
  const [shifts, setShifts] = useState<ShiftDef[]>(initialShifts);
  const [groups, setGroups] = useState<ShiftGroup[]>(initialGroups);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // shift def dialog
  const [sdOpen, setSdOpen] = useState(false);
  const [sdEdit, setSdEdit] = useState<ShiftDef | null>(null);
  const [sd, setSd] = useState({ label: "", masuk: "08:30", pulang: "16:30", tol: "5" });

  // group dialog
  const [gOpen, setGOpen] = useState(false);
  const [gEdit, setGEdit] = useState<ShiftGroup | null>(null);
  const [g, setG] = useState<{ name: string; targetType: string; targetValue: string; shiftCodes: string[]; memberIds: number[] }>({ name: "", targetType: "jabatan", targetValue: "", shiftCodes: [], memberIds: [] });

  async function callShiftDef(body: Record<string, unknown>) {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/admin/shift-defs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal.");
      if (Array.isArray(data.shifts)) setShifts(data.shifts);
      setSdOpen(false);
    } catch (e) { setErr(e instanceof Error ? e.message : "Gagal."); } finally { setBusy(false); }
  }

  async function callGroup(body: Record<string, unknown>) {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/admin/shift-groups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal.");
      if (Array.isArray(data.groups)) setGroups(data.groups);
      setGOpen(false);
    } catch (e) { setErr(e instanceof Error ? e.message : "Gagal."); } finally { setBusy(false); }
  }

  function openGroupCreate() { setGEdit(null); setG({ name: "", targetType: "jabatan", targetValue: "", shiftCodes: [], memberIds: [] }); setErr(""); setGOpen(true); }
  function openGroupEdit(grp: ShiftGroup) { setGEdit(grp); setG({ name: grp.name, targetType: grp.targetType, targetValue: grp.targetValue ?? "", shiftCodes: grp.shiftCodes, memberIds: grp.memberIds }); setErr(""); setGOpen(true); }

  const targetOptions = g.targetType === "jabatan" ? jabatanOptions : g.targetType === "departemen" ? departemenOptions : g.targetType === "penempatan" ? penempatanOptions : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Master Set Jadwal" description="Definisi shift (jam) & grup shift per karyawan. Karyawan tampil = yang dicentang 'Ikut Set Jadwal'." />
      {err ? <p className="text-[13px] text-danger">{err}</p> : null}

      {/* SHIFT DEFS */}
      <Card className="overflow-hidden p-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4" /> Definisi Shift</CardTitle>
          <Button size="sm" onClick={() => { setSdEdit(null); setSd({ label: "", masuk: "08:30", pulang: "16:30", tol: "5" }); setErr(""); setSdOpen(true); }}><Plus className="h-4 w-4" /> Shift baru</Button>
        </CardHeader>
        <TableWrap>
          <Table>
            <THead><TR><TH>Kode</TH><TH>Label</TH><TH>Masuk</TH><TH>Mulai pulang</TH><TH className="text-right">Toleransi</TH><TH className="text-right">Aksi</TH></TR></THead>
            <TBody>
              {shifts.map((s) => (
                <TR key={s.code}>
                  <TD><Badge tone="brand">{s.code}</Badge></TD>
                  <TD className="text-ink">{s.label} {s.isSystem ? <Badge tone="neutral" className="ml-1">bawaan</Badge> : null}</TD>
                  <TD className="nums text-ink-2">{s.isLibur ? "—" : minToTime(s.startMin)}</TD>
                  <TD className="nums text-ink-2">{s.isLibur ? "—" : minToTime(s.checkoutStartMin)}</TD>
                  <TD className="nums text-right text-ink-2">{s.toleranceMin}m</TD>
                  <TD className="text-right">
                    {!s.isSystem ? (
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSdEdit(s); setSd({ label: s.label, masuk: minToTime(s.startMin), pulang: minToTime(s.checkoutStartMin), tol: String(s.toleranceMin) }); setErr(""); setSdOpen(true); }} className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => { if (confirm(`Hapus shift ${s.code}?`)) callShiftDef({ action: "delete", code: s.code }); }} className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ) : <span className="text-[12px] text-muted">sistem</span>}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TableWrap>
      </Card>

      {/* SHIFT GROUPS */}
      <Card className="overflow-hidden p-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Layers className="h-4 w-4" /> Grup Shift</CardTitle>
          <Button size="sm" onClick={openGroupCreate}><Plus className="h-4 w-4" /> Grup baru</Button>
        </CardHeader>
        {groups.length === 0 ? (
          <div className="p-5"><EmptyState title="Belum ada grup shift" description="Tanpa grup, karyawan pakai opsi shift default per penempatan." /></div>
        ) : (
          <ul className="divide-y divide-line">
            {groups.map((grp) => (
              <li key={grp.id} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="font-medium text-ink">{grp.name}</div>
                  <div className="text-[13px] text-ink-2">{grp.targetType}{grp.targetValue ? `: ${grp.targetValue}` : grp.targetType === "custom" ? ` · ${grp.memberIds.length} anggota` : ""}</div>
                  <div className="mt-1 flex flex-wrap gap-1">{grp.shiftCodes.map((c) => <Badge key={c} tone="neutral">{c}</Badge>)}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openGroupEdit(grp)} className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (confirm(`Hapus grup ${grp.name}?`)) callGroup({ action: "delete", id: grp.id }); }} className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Shift def dialog */}
      <Dialog open={sdOpen} onClose={() => setSdOpen(false)} title={sdEdit ? `Edit shift ${sdEdit.code}` : "Shift baru"} size="sm"
        footer={<><Button variant="secondary" onClick={() => setSdOpen(false)}>Batal</Button><Button loading={busy} onClick={() => callShiftDef(sdEdit ? { action: "update", code: sdEdit.code, label: sd.label, masukMin: timeToMin(sd.masuk), pulangMin: timeToMin(sd.pulang), toleranceMin: Number(sd.tol) } : { action: "create", label: sd.label, masukMin: timeToMin(sd.masuk), pulangMin: timeToMin(sd.pulang), toleranceMin: Number(sd.tol) })}>{sdEdit ? "Simpan" : "Tambah"}</Button></>}>
        <div className="space-y-4">
          <Field label="Label" required><Input value={sd.label} onChange={(e) => setSd((s) => ({ ...s, label: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Jam masuk"><Input type="time" value={sd.masuk} onChange={(e) => setSd((s) => ({ ...s, masuk: e.target.value }))} /></Field>
            <Field label="Mulai boleh pulang"><Input type="time" value={sd.pulang} onChange={(e) => setSd((s) => ({ ...s, pulang: e.target.value }))} /></Field>
          </div>
          <Field label="Toleransi telat (menit)"><Input type="number" value={sd.tol} onChange={(e) => setSd((s) => ({ ...s, tol: e.target.value }))} /></Field>
        </div>
      </Dialog>

      {/* Group dialog */}
      <Dialog open={gOpen} onClose={() => setGOpen(false)} title={gEdit ? `Edit grup ${gEdit.name}` : "Grup shift baru"} size="md"
        footer={<>{err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}<Button variant="secondary" onClick={() => setGOpen(false)}>Batal</Button><Button loading={busy} onClick={() => callGroup({ action: gEdit ? "update" : "create", id: gEdit?.id, name: g.name, targetType: g.targetType, targetValue: g.targetType === "custom" ? null : g.targetValue, shiftCodes: g.shiftCodes, memberIds: g.memberIds })}>{gEdit ? "Simpan" : "Buat"}</Button></>}>
        <div className="space-y-4">
          <Field label="Nama grup" required><Input value={g.name} onChange={(e) => setG((s) => ({ ...s, name: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Target"><Select value={g.targetType} onChange={(e) => setG((s) => ({ ...s, targetType: e.target.value, targetValue: "" }))}><option value="jabatan">Jabatan</option><option value="departemen">Departemen</option><option value="penempatan">Penempatan</option><option value="custom">Custom (pilih orang)</option></Select></Field>
            {g.targetType !== "custom" ? (
              <Field label="Nilai target"><Select value={g.targetValue} onChange={(e) => setG((s) => ({ ...s, targetValue: e.target.value }))}><option value="">— pilih —</option>{targetOptions.map((o) => <option key={o} value={o}>{o}</option>)}</Select></Field>
            ) : null}
          </div>
          <Field label="Opsi shift yang boleh dipakai grup ini">
            <div className="flex flex-wrap gap-2">
              {selectableShifts.map((s) => {
                const on = g.shiftCodes.includes(s.code);
                return (
                  <button key={s.code} type="button" onClick={() => setG((st) => ({ ...st, shiftCodes: on ? st.shiftCodes.filter((c) => c !== s.code) : [...st.shiftCodes, s.code] }))} className={"rounded-full px-3 py-1 text-[13px] " + (on ? "bg-primary text-on-primary" : "bg-surface-2 text-ink-2 hover:text-ink")}>{s.label}</button>
                );
              })}
            </div>
          </Field>
          {g.targetType === "custom" ? (
            <Field label="Anggota">
              <div className="max-h-44 overflow-y-auto rounded-md border border-line">
                {roster.map((r) => (
                  <label key={r.id} className="flex items-center gap-2 border-b border-line px-3 py-1.5 text-sm last:border-0 hover:bg-surface-2">
                    <input type="checkbox" checked={g.memberIds.includes(r.id)} onChange={(e) => setG((st) => ({ ...st, memberIds: e.target.checked ? [...st.memberIds, r.id] : st.memberIds.filter((x) => x !== r.id) }))} className="h-4 w-4 accent-[color:var(--primary)]" />
                    <span className="text-ink">{r.nama}</span><span className="text-ink-2">{r.jabatan}</span>
                  </label>
                ))}
              </div>
            </Field>
          ) : null}
        </div>
      </Dialog>
    </div>
  );
}
