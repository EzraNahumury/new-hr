"use client";

import { useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; content: string };

export function HrAgentChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/hr-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal memproses.");
      setMessages((m) => [...m, { role: "assistant", content: String(data.reply ?? "") }]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal memproses.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="HR Agent" description="Asisten AI tanya-jawab data HR (read-only). Mis. “berapa karyawan aktif?”, “siapa yang telat bulan ini?”." />

      <Card className="flex h-[62vh] flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-ink-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-weak text-primary"><Bot className="h-6 w-6" /></div>
              <p className="mt-3 text-sm">Mulai bertanya tentang data HR.</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn("flex h-8 w-8 flex-none items-center justify-center rounded-full", m.role === "user" ? "bg-ink text-paper" : "bg-primary-weak text-primary")}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn("max-w-[80%] whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm", m.role === "user" ? "bg-ink text-paper" : "bg-surface-2 text-ink")}>
                  {m.content}
                </div>
              </div>
            ))
          )}
          {busy ? <div className="flex items-center gap-2 text-[13px] text-ink-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" /> HR Agent sedang berpikir…</div> : null}
        </div>

        {err ? <p className="border-t border-line px-5 py-2 text-[13px] text-danger">{err}</p> : null}

        <div className="flex items-end gap-2 border-t border-line p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
            placeholder="Tanya sesuatu… (Enter kirim, Shift+Enter baris baru)"
            className="min-h-10 flex-1 resize-none rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-primary"
          />
          <Button onClick={send} loading={busy} disabled={!input.trim()}><Send className="h-4 w-4" /> Kirim</Button>
        </div>
      </Card>
    </div>
  );
}
