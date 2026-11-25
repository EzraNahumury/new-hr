import { cn } from "@/lib/cn";

export type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2",
  brand: "bg-primary-weak text-primary",
  success: "bg-success-weak text-success",
  warning: "bg-warning-weak text-warning",
  danger: "bg-danger-weak text-danger",
  info: "bg-info-weak text-info",
};

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {dot ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />
      ) : null}
      {children}
    </span>
  );
}

// Maps real HR status strings (ID + EN) to a tone + readable label.
const STATUS_MAP: Record<string, { tone: Tone; label: string }> = {
  // approved / positive
  approved: { tone: "success", label: "Approved" },
  approved_finance: { tone: "success", label: "Approved" },
  disetujui: { tone: "success", label: "Disetujui" },
  diterima: { tone: "success", label: "Diterima" },
  selesai: { tone: "success", label: "Selesai" },
  completed: { tone: "success", label: "Completed" },
  lunas: { tone: "success", label: "Lunas" },
  paid: { tone: "success", label: "Paid" },
  aktif: { tone: "success", label: "Aktif" },
  didistribusikan: { tone: "success", label: "Didistribusikan" },
  hadir: { tone: "success", label: "Hadir" },
  // pending / in progress
  pending: { tone: "warning", label: "Pending" },
  menunggu: { tone: "warning", label: "Menunggu" },
  diproses: { tone: "info", label: "Diproses" },
  processed: { tone: "info", label: "Processed" },
  berjalan: { tone: "info", label: "Berjalan" },
  training: { tone: "info", label: "Training" },
  // negative
  rejected: { tone: "danger", label: "Rejected" },
  ditolak: { tone: "danger", label: "Ditolak" },
  dibatalkan: { tone: "danger", label: "Dibatalkan" },
  cancelled: { tone: "danger", label: "Cancelled" },
  nonaktif: { tone: "danger", label: "Nonaktif" },
  alfa: { tone: "danger", label: "Alfa" },
  // neutral / draft
  draft: { tone: "neutral", label: "Draft" },
  belum: { tone: "neutral", label: "Belum" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string | null | undefined;
  className?: string;
}) {
  const key = (status ?? "").trim().toLowerCase();
  const match = STATUS_MAP[key];
  if (!match) {
    return (
      <Badge tone="neutral" dot className={className}>
        {status ? String(status) : "—"}
      </Badge>
    );
  }
  return (
    <Badge tone={match.tone} dot className={className}>
      {match.label}
    </Badge>
  );
}
