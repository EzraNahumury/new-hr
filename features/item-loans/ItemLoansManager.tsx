"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Download, Boxes, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";
import { formatDate } from "@/lib/format";

type Emp = { id: number; name: string; nip: string };
type Record_ = { id: number; employees: Emp[]; items: string[]; loanDate: string | null; note: string | null };
type EmpOpt = { id: number; name: string; nip: string };

export function ItemLoansManager({
  mode,
  rows,
  employees = [],
  title,
  description,
}: {
  mode: "admin" | "readonly";
  rows: Record_[];
  employees?: EmpOpt[];
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  const isAdmin = mode === "admin";
  const today = new Date().toISOString().slice(0, 10);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Record_ | null>(null);
  const [selEmp, setSelEmp] = useState<number[]>([]);
  const [itemsText, setItemsText] = useState("");
  const [loanDate, setLoanDate] = useState(today);
  const [note, setNote] = useState("");
  const [empQuery, setEmpQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const empFiltered = useMemo(() => {
    const s = empQuery.trim().toLowerCase();
    if (!s) return employees;
    return employees.filter((e) => `${e.name} ${e.nip}`.toLowerCase().includes(s));
  }, [empQuery, employees]);

  function openCreate() {
    setEditing(null);
    setSelEmp([]);
    setItemsText("");
    setLoanDate(today);
    setNote("");
    setErr("");
    setShowForm(true);
  }
  function openEdit(r: Record_) {
    setEditing(r);
    setSelEmp(r.employees.map((e) => e.id));
    setItemsText(r.items.join("\n"));
    setLoanDate(r.loanDate ?? today);
    setNote(r.note ?? "");
    setErr("");
    setShowForm(true);
  }

  async function submit() {
    setBusy(true);
    setErr("");
    try {
      const items = itemsText.split("\n").map((s) => s.trim()).filter(Boolean);
      if (selEmp.length === 0) throw new Error("Pilih minimal satu karyawan.");
      if (items.length === 0) throw new Error("Isi minimal satu barang.");
      const payload = { employeeIds: selEmp, items, loanDate, note: note || null };
      const url = editing ? `/api/admin/item-loans/${editing.id}` : "/api/admin/item-loans";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      setShowForm(false);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(r: Record_) {
    if (!confirm("Hapus catatan peminjaman barang ini?")) return;
    const res = await fetch(`/api/admin/item-loans/${r.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Gagal menghapus.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title ?? "Peminjaman Barang"}
        description={description ?? "Catat barang/aset perusahaan yang dipinjam karyawan."}
        actions={
          isAdmin ? (
            <div className="flex gap-2">
              <a href="/api/admin/item-loans/export" className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-ink hover:bg-surface-2">
                <Download className="h-4 w-4" /> Export
              </a>
              <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah</Button>
            </div>
          ) : null
        }
      />

      <Card>
        {rows.length === 0 ? (
          <div className="p-5"><EmptyState icon={<Boxes className="h-5 w-5" />} title="Belum ada peminjaman barang" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Karyawan</TH>
                  <TH>Barang</TH>
                  <TH>Tanggal</TH>
                  {isAdmin ? <TH className="text-right">Aksi</TH> : null}
                </TR>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <TR key={r.id}>
                    <TD>
                      <div className="flex flex-wrap gap-1">
                        {r.employees.map((e) => <Badge key={e.id} tone="neutral">{e.name}</Badge>)}
                      </div>
                    </TD>
                    <TD>
                      <div className="flex flex-wrap gap-1">
                        {r.items.map((it, i) => <Badge key={i} tone="brand">{it}</Badge>)}
                      </div>
                    </TD>
                    <TD className="text-ink-2">{formatDate(r.loanDate)}</TD>
                    {isAdmin ? (
                      <TD>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(r)} title="Edit" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => remove(r)} title="Hapus" className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </TD>
                    ) : null}
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Dialog open={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Peminjaman" : "Tambah Peminjaman"} size="md"
        footer={<>{err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}<Button variant="secondary" onClick={() => setShowForm(false)}>Batal</Button><Button loading={busy} onClick={submit}>{editing ? "Simpan" : "Tambah"}</Button></>}>
        <div className="space-y-4">
          <Field label="Karyawan (bisa lebih dari satu)" required>
            <div className="flex items-center gap-2 rounded-md border border-line px-3 py-1.5">
              <Search className="h-4 w-4 text-muted" />
              <input value={empQuery} onChange={(e) => setEmpQuery(e.target.value)} placeholder="Cari karyawan…" className="w-full bg-transparent text-sm outline-none" />
            </div>
            <div className="mt-2 max-h-44 overflow-y-auto rounded-md border border-line">
              {empFiltered.map((e) => (
                <label key={e.id} className="flex items-center gap-2 border-b border-line px-3 py-1.5 text-sm last:border-0 hover:bg-surface-2">
                  <input
                    type="checkbox"
                    checked={selEmp.includes(e.id)}
                    onChange={(ev) => setSelEmp((s) => ev.target.checked ? [...s, e.id] : s.filter((x) => x !== e.id))}
                    className="h-4 w-4 accent-[color:var(--primary)]"
                  />
                  <span className="text-ink">{e.name}</span>
                  <span className="text-ink-2">{e.nip}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-[13px] text-ink-2">{selEmp.length} dipilih</p>
          </Field>
          <Field label="Barang (satu per baris)" required><Textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} placeholder={"Laptop Asus\nHP charger"} /></Field>
          <Field label="Tanggal pinjam"><Input type="date" value={loanDate} onChange={(e) => setLoanDate(e.target.value)} /></Field>
          <Field label="Catatan"><Input value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </div>
      </Dialog>
    </div>
  );
}
