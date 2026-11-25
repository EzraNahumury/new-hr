"use client";

import { useState } from "react";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/Feedback";

type AdminOpt = { email: string; name: string };

export function AkunPayrollManager({
  initialEditors,
  adminOptions,
}: {
  initialEditors: string[];
  adminOptions: AdminOpt[];
}) {
  const [editors, setEditors] = useState<string[]>(initialEditors);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function call(action: "add" | "remove", value: string) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/payroll-editors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, email: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal.");
      if (Array.isArray(data.editors)) setEditors(data.editors);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal.");
    } finally {
      setBusy(false);
    }
  }

  const available = adminOptions.filter((a) => !editors.includes(a.email.trim().toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Akun Payroll" description="Admin yang berhak mengedit Summary Payroll. Minimal 1 akun." />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-line p-4 sm:flex-row sm:items-center">
          <Select value={email} onChange={(e) => setEmail(e.target.value)} className="sm:max-w-sm">
            <option value="">— pilih akun admin —</option>
            {available.map((a) => <option key={a.email} value={a.email}>{a.name} ({a.email})</option>)}
          </Select>
          <Button onClick={() => email && call("add", email)} loading={busy} disabled={!email}><Plus className="h-4 w-4" /> Beri hak</Button>
          {err ? <span className="text-[13px] text-danger sm:ml-2">{err}</span> : null}
        </div>
        {editors.length === 0 ? (
          <div className="p-5"><EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="Belum ada akun payroll" /></div>
        ) : (
          <ul className="divide-y divide-line">
            {editors.map((e) => (
              <li key={e} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-ink"><ShieldCheck className="h-4 w-4 text-success" /> {e}</span>
                <button onClick={() => call("remove", e)} title="Cabut hak" className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
