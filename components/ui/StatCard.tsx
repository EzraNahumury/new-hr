import { cn } from "@/lib/cn";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "neutral",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon?: React.ReactNode;
  tone?: "neutral" | "brand" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const iconTone: Record<string, string> = {
    neutral: "bg-surface-2 text-ink-2",
    brand: "bg-primary-weak text-primary",
    success: "bg-success-weak text-success",
    warning: "bg-warning-weak text-warning",
    danger: "bg-danger-weak text-danger",
    info: "bg-info-weak text-info",
  };
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-ink-2">{label}</p>
          <p className="nums mt-2 text-3xl font-semibold tracking-tight text-ink">
            {value}
          </p>
          {sub ? <p className="mt-1 text-[13px] text-ink-2">{sub}</p> : null}
        </div>
        {icon ? (
          <div
            className={cn(
              "flex h-10 w-10 flex-none items-center justify-center rounded-lg",
              iconTone[tone],
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-2">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
