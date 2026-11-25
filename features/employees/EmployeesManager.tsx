"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Trash2, KeyRound, Users, FileBadge, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard, PageHeader } from "@/components/ui/StatCard";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Input, Field, Label, Select } from "@/components/ui/Input";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { Dialog } from "@/components/ui/Dialog";

type Opt = { label: string; value: string };
export type Lookups = {
  units: Opt[]; roles: Opt[]; departments: Opt[]; divisions: Opt[];
  subDivisions: Opt[]; placements: Opt[]; costAllocations: Opt[]; banks: Opt[];
  workStatuses: Opt[]; dataStatuses: Opt[]; genders: Opt[]; religions: Opt[];
};
export type Employee = Record<string, unknown> & {
  id: number; name: string; nip: string; email: string;
  role: string; department: string; division: string;
  employmentStatus: string; dataStatus: string;
};
type Stats = { totalEmployees: number; totalContract: number; activeLoans: number };

const SPECIAL_OPTS = {
  penjahitPayrollType: [{ label: "Mingguan", value: "mingguan" }, { label: "Bulanan", value: "bulanan" }],
  csType: [
    { label: "Selling", value: "selling" }, { label: "Order", value: "order" },
    { label: "Grosir", value: "grosir" }, { label: "Marketplace", value: "marketplace" },
  ],
  bonusGroup: [
    { label: "AVA", value: "ava" }, { label: "Ayres", value: "ayres" },
    { label: "Operasional", value: "operasional" },
  ],
  freelanceTipePayroll: [
    { label: "Jam", value: "jam" }, { label: "Pengerjaan", value: "pengerjaan" },
    { label: "Custom Pengerjaan", value: "custom_pengerjaan" }, { label: "Harian", value: "harian" },
  ],
};

type FieldDef = {
  key: string; label: string;
  type: "text" | "email" | "number" | "date" | "select" | "checkbox";
  lookup?: keyof Lookups; opts?: Opt[]; group: string;
};

const FIELDS: FieldDef[] = [
  { key: "name", label: "Nama", type: "text", group: "Identitas" },
  { key: "nip", label: "NIP / No. Karyawan", type: "text", group: "Identitas" },
  { key: "email", label: "Email", type: "email", group: "Identitas" },
  { key: "phoneNumber", label: "No. Telepon", type: "text", group: "Identitas" },
  { key: "unit", label: "Unit", type: "select", lookup: "units", group: "Identitas" },

  { key: "role", label: "Jabatan", type: "select", lookup: "roles", group: "Kepegawaian" },
  { key: "department", label: "Departemen", type: "select", lookup: "departments", group: "Kepegawaian" },
  { key: "division", label: "Divisi", type: "select", lookup: "divisions", group: "Kepegawaian" },
  { key: "subDivision", label: "Sub Divisi", type: "select", lookup: "subDivisions", group: "Kepegawaian" },
  { key: "placement", label: "Penempatan", type: "select", lookup: "placements", group: "Kepegawaian" },
  { key: "employmentStatus", label: "Status Kepegawaian", type: "select", lookup: "workStatuses", group: "Kepegawaian" },
  { key: "workStatus", label: "Status Kerja", type: "select", lookup: "workStatuses", group: "Kepegawaian" },
  { key: "dataStatus", label: "Status Data", type: "select", lookup: "dataStatuses", group: "Kepegawaian" },
  { key: "costAllocation", label: "Pembebanan", type: "select", lookup: "costAllocations", group: "Kepegawaian" },
  { key: "firstJoinDate", label: "Tgl Pertama Masuk", type: "date", group: "Kepegawaian" },
  { key: "contractDate", label: "Tgl Kontrak", type: "date", group: "Kepegawaian" },
  { key: "contractEndDate", label: "Tgl Selesai Kontrak", type: "date", group: "Kepegawaian" },
  { key: "annualRaise", label: "Kenaikan / Tahun", type: "number", group: "Kepegawaian" },
  { key: "isShift", label: "Karyawan Shift", type: "checkbox", group: "Kepegawaian" },
  { key: "userActive", label: "Akun Aktif", type: "checkbox", group: "Kepegawaian" },

  { key: "gender", label: "Jenis Kelamin", type: "select", lookup: "genders", group: "Data Pribadi" },
  { key: "birthPlace", label: "Tempat Lahir", type: "text", group: "Data Pribadi" },
  { key: "birthDate", label: "Tanggal Lahir", type: "date", group: "Data Pribadi" },
  { key: "nik", label: "NIK", type: "text", group: "Data Pribadi" },
  { key: "religion", label: "Agama", type: "select", lookup: "religions", group: "Data Pribadi" },
  { key: "bank", label: "Bank", type: "select", lookup: "banks", group: "Data Pribadi" },
  { key: "accountNumber", label: "No. Rekening", type: "text", group: "Data Pribadi" },
  { key: "addressKtp", label: "Alamat KTP", type: "text", group: "Data Pribadi" },
  { key: "addressCurrent", label: "Alamat Domisili", type: "text", group: "Data Pribadi" },

  { key: "penjahitPayrollType", label: "Tipe Payroll Penjahit", type: "select", opts: SPECIAL_OPTS.penjahitPayrollType, group: "Payroll Khusus" },
  { key: "csType", label: "Tipe CS", type: "select", opts: SPECIAL_OPTS.csType, group: "Payroll Khusus" },
  { key: "bonusGroup", label: "Grup Bonus", type: "select", opts: SPECIAL_OPTS.bonusGroup, group: "Payroll Khusus" },
  { key: "freelanceTipePayroll", label: "Tipe Payroll Freelance", type: "select", opts: SPECIAL_OPTS.freelanceTipePayroll, group: "Payroll Khusus" },
  { key: "cutiHamil", label: "Cuti Hamil", type: "checkbox", group: "Payroll Khusus" },
  { key: "cutiHamilMulai", label: "Mulai Cuti Hamil", type: "date", group: "Payroll Khusus" },
];

const GROUPS = ["Identitas", "Kepegawaian", "Data Pribadi", "Payroll Khusus"];

function toForm(e: Employee | null): Record<string, string | boolean> {
  const f: Record<string, string | boolean> = {};
  for (const fd of FIELDS) {
    const v = e ? (e as Record<string, unknown>)[fd.key] : undefined;
    if (fd.type === "checkbox") f[fd.key] = Boolean(v);
    else f[fd.key] = v == null ? "" : String(v);
  }
  if (e?.ktpPhoto) f.ktpPhoto = String(e.ktpPhoto);
  return f;
}

export function EmployeesManager({
  employees,
  lookups,
  stats,
}: {
  employees: Employee[];
  lookups: Lookups;
  stats: Stats;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string | boolean>>(toForm(null));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pwFor, setPwFor] = useState<Employee | null>(null);
  const [pw, setPw] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return employees;
    return employees.filter((e) =>
      [e.name, e.nip, e.email, e.role, e.department, e.division]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [q, employees]);

  function openCreate() {
    setEditing(null);
    setForm(toForm(null));
    setErr("");
    setShowForm(true);
  }
  function openEdit(e: Employee) {
    setEditing(e);
    setForm(toForm(e));
    setErr("");
    setShowForm(true);
  }

  async function submit() {
    setBusy(true);
    setErr("");
    try {
      const body: Record<string, unknown> = { ...form };
      body.annualRaise = Number(form.annualRaise || 0);
      const url = editing
        ? `/api/admin/employees/${editing.id}`
        : "/api/admin/employees";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  async function remove(e: Employee) {
    if (!confirm(`Hapus karyawan "${e.name}"? Tindakan ini menghapus akun & datanya.`)) return;
    const res = await fetch(`/api/admin/employees/${e.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Gagal menghapus karyawan.");
  }

  async function savePw() {
    if (!pwFor || pw.length < 6) {
      setErr("Password minimal 6 karakter.");
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/employees/${pwFor.id}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) {
      setPwFor(null);
      setPw("");
    } else {
      setErr("Gagal mengatur password.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Karyawan"
        description="Master karyawan — akun, identitas kerja, kontrak, dan rekening."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Tambah Karyawan
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total karyawan" value={stats.totalEmployees} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Status kontrak" value={stats.totalContract} tone="info" icon={<FileBadge className="h-5 w-5" />} />
        <StatCard label="Pinjaman aktif" value={stats.activeLoans} tone="warning" icon={<HandCoins className="h-5 w-5" />} />
      </div>

      <Card>
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama, NIP, email, jabatan…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
          <Badge tone="neutral">{filtered.length}</Badge>
        </div>

        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<Users className="h-5 w-5" />}
              title="Belum ada karyawan"
              description="Tambahkan karyawan pertama untuk mulai mengelola data HR."
              action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah Karyawan</Button>}
            />
          </div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Nama</TH>
                  <TH>NIP</TH>
                  <TH>Jabatan</TH>
                  <TH>Departemen</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((e) => (
                  <TR key={e.id}>
                    <TD>
                      <div className="font-medium text-ink">{e.name}</div>
                      <div className="text-[13px] text-ink-2">{e.email || "—"}</div>
                    </TD>
                    <TD className="nums text-ink-2">{e.nip || "—"}</TD>
                    <TD className="text-ink-2">{e.role || "—"}</TD>
                    <TD className="text-ink-2">{e.department || "—"}</TD>
                    <TD>
                      <div className="flex flex-wrap gap-1.5">
                        <StatusBadge status={e.employmentStatus} />
                        <StatusBadge status={e.dataStatus} />
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(e)} title="Edit" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setPwFor(e); setPw(""); setErr(""); }} title="Reset password" className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink">
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(e)} title="Hapus" className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger">
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

      {/* Create / Edit */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? `Edit: ${editing.name}` : "Tambah Karyawan"}
        description="Field mengikuti kontrak data backend — tidak ada yang diubah."
        size="xl"
        footer={
          <>
            {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
            <Button variant="secondary" onClick={() => setShowForm(false)}>Batal</Button>
            <Button onClick={submit} loading={busy}>{editing ? "Simpan" : "Tambah"}</Button>
          </>
        }
      >
        <div className="space-y-6">
          {GROUPS.map((group) => (
            <div key={group}>
              <h3 className="mb-3 text-sm font-semibold text-ink">{group}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {FIELDS.filter((f) => f.group === group).map((f) => {
                  if (f.type === "checkbox") {
                    return (
                      <label key={f.key} className="flex items-center gap-2 pt-6 text-sm text-ink">
                        <input
                          type="checkbox"
                          checked={Boolean(form[f.key])}
                          onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.checked }))}
                          className="h-4 w-4 accent-[color:var(--primary)]"
                        />
                        {f.label}
                      </label>
                    );
                  }
                  const opts = f.lookup ? lookups[f.lookup] : f.opts;
                  return (
                    <Field key={f.key} label={f.label} required={f.key === "name"}>
                      {f.type === "select" ? (
                        <Select
                          value={String(form[f.key] ?? "")}
                          onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                        >
                          <option value="">— pilih —</option>
                          {(opts ?? []).map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          type={f.type}
                          value={String(form[f.key] ?? "")}
                          onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                        />
                      )}
                    </Field>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Dialog>

      {/* Password reset */}
      <Dialog
        open={!!pwFor}
        onClose={() => setPwFor(null)}
        title={pwFor ? `Reset password: ${pwFor.name}` : ""}
        size="sm"
        footer={
          <>
            {err ? <span className="mr-auto text-[13px] text-danger">{err}</span> : null}
            <Button variant="secondary" onClick={() => setPwFor(null)}>Batal</Button>
            <Button onClick={savePw} loading={busy}>Simpan</Button>
          </>
        }
      >
        <Field label="Password baru" hint="Minimal 6 karakter.">
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </Field>
      </Dialog>
    </div>
  );
}
