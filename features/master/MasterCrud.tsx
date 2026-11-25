"use client";

import { useState } from "react";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Feedback";

type Item = { id: number; value: string; canApprove: boolean };

export function MasterCrud({
  category,
  label,
  initialItems,
  isJabatan,
}: {
  category: string;
  label: string;
  initialItems: Item[];
  isJabatan: boolean;
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function call(body: Record<string, unknown>) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, ...body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
      if (Array.isArray(data.items)) setItems(data.items as Item[]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function add() {
    const v = value.trim();
    if (!v) return;
    await call({ action: "add", value: v });
    setValue("");
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-line p-4 sm:flex-row sm:items-center">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder={`Tambah ${label.toLowerCase()} baru…`}
          className="sm:max-w-sm"
        />
        <Button onClick={add} loading={busy}>
          <Plus className="h-4 w-4" /> Tambah
        </Button>
        {err ? <span className="text-[13px] text-danger sm:ml-2">{err}</span> : null}
      </div>

      {items.length === 0 ? (
        <div className="p-5">
          <EmptyState title={`Belum ada ${label.toLowerCase()}`} description="Tambahkan nilai pertama di atas." />
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-ink">
                {it.value}
                {isJabatan && it.canApprove ? (
                  <Badge tone="success" dot>Bisa approve</Badge>
                ) : null}
              </span>
              <div className="flex items-center gap-1">
                {isJabatan ? (
                  <button
                    onClick={() => call({ action: "set_approve", id: it.id, canApprove: !it.canApprove })}
                    title={it.canApprove ? "Cabut izin approve" : "Beri izin approve"}
                    className={
                      "rounded-md p-1.5 hover:bg-surface-2 " +
                      (it.canApprove ? "text-success" : "text-ink-2 hover:text-ink")
                    }
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </button>
                ) : null}
                <button
                  onClick={() => call({ action: "delete", id: it.id })}
                  title="Hapus"
                  className="rounded-md p-1.5 text-ink-2 hover:bg-danger-weak hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
