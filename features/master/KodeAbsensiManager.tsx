"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Field } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";

type Code = { id: number; code: string; label: string; status: string };

export function KodeAbsensiManager({ initialItems }: { initialItems: Code[] }) {
  const [items, setItems] = useState<Code[]>(initialItems);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Code | null>(null);
  const [form, setForm] = useState({ code: "", label: "", status: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function call(body: Record<string, unknown>) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/attendance-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal.");
      if (Array.isArray(data.items)) setItems(data.items as Code[]);
      setOpen(false);
      return true;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function openCreate() { setEditing(null); setForm({ code: "", label: "", status: "" }); setErr(""); setOpen(true); }
  function openEdit(c: Code) { setEditing(c); setForm({ code: c.code, label: c.label, status: c.status }); setErr(""); setOpen(true); }

  async function remove(c: Code) {
    if (!confirm(`Hapus kode "${c.code}"?`)) return;
    await call({ action: "delete", id: c.id });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kode Absensi"
        description="Kode absensi & kategori payroll yang dipakai di spreadsheet absensi."
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah Kode</Button>}
      />

      <Card>
        {items.length === 0 ? (
          <div className="p-5"><EmptyState icon={<Clock className="h-5 w-5" />} title="Belum ada kode absensi" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead><TR><TH>Kode</TH><TH>Label</TH><TH>Kategori payroll</TH><TH className="text-right">Aksi</TH></TR></THead>
              <TBody>
                {items.map((c) => (
                  <TR key={c.id}>
                    <TD><Badge tone="brand">{c.code}</Badge></TD>
                    <TD className="text-ink">{c.label}</TD>
                    <TD className="text-ink-2">{c.status}</TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} title="Edit" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(c)} title="Hapus" className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? `Edit kode ${editing.code}` : "Tambah kode absensi"} size="sm"
        footer={<>{err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}<Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
          <Button loading={busy} onClick={() => editing ? call({ action: "update", id: editing.id, label: form.label, status: form.status }) : call({ action: "add", code: form.code, label: form.label, status: form.status })}>{editing ? "Simpan" : "Tambah"}</Button></>}>
        <div className="space-y-4">
          {!editing ? <Field label="Kode" required hint="Maks 8 karakter, mis. H, T, I, S, A, LN."><Input value={form.code} onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))} /></Field> : null}
          <Field label="Label" required><Input value={form.label} onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))} /></Field>
          <Field label="Kategori payroll" required hint="mis. hadir, izin, sakit, alfa, libur, setengah_hari, cuti, dinas."><Input value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} /></Field>
        </div>
      </Dialog>
    </div>
  );
}
