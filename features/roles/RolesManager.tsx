"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Field, Select } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";

type Admin = { id: number; name: string; email: string; role: "admin" | "spv"; isActive: boolean };

export function RolesManager({ rows }: { rows: Admin[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin", isActive: true });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function openCreate() {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "admin", isActive: true });
    setErr("");
    setOpen(true);
  }
  function openEdit(a: Admin) {
    setEditing(a);
    setForm({ name: a.name, email: a.email, password: "", role: a.role, isActive: a.isActive });
    setErr("");
    setOpen(true);
  }

  async function submit() {
    setBusy(true);
    setErr("");
    try {
      const url = editing ? `/api/admin/roles/${editing.id}` : "/api/admin/roles";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(a: Admin) {
    if (!confirm(`Hapus akun "${a.name}" (${a.email})?`)) return;
    const res = await fetch(`/api/admin/roles/${a.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) router.refresh();
    else alert(data.message || "Gagal menghapus akun.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role & Akun"
        description="Kelola akun Admin dan Supervisor. Akun terakhir yang aktif tidak bisa dihapus/dinonaktifkan."
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah Akun</Button>}
      />

      <Card>
        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<UserCog className="h-5 w-5" />} title="Belum ada akun" />
          </div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Nama</TH>
                  <TH>Email</TH>
                  <TH>Role</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((a) => (
                  <TR key={a.id}>
                    <TD className="font-medium text-ink">{a.name}</TD>
                    <TD className="text-ink-2">{a.email}</TD>
                    <TD>
                      <Badge tone={a.role === "admin" ? "brand" : "info"}>
                        {a.role === "admin" ? "Admin" : "Supervisor"}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge tone={a.isActive ? "success" : "neutral"} dot>
                        {a.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(a)} title="Edit" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(a)} title="Hapus" className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? `Edit akun: ${editing.name}` : "Tambah akun"}
        size="md"
        footer={
          <>
            {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
            <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={submit} loading={busy}>{editing ? "Simpan" : "Tambah"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Nama" required>
            <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          </Field>
          <Field label="Email" required>
            <Input type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          </Field>
          <Field label="Password" hint={editing ? "Kosongkan jika tidak diubah." : "Minimal 6 karakter."}>
            <Input type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role">
              <Select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}>
                <option value="admin">Admin</option>
                <option value="spv">Supervisor</option>
              </Select>
            </Field>
            <label className="flex items-center gap-2 pt-7 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))}
                className="h-4 w-4 accent-[color:var(--primary)]"
              />
              Akun aktif
            </label>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
