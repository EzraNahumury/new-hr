import { cn } from "@/lib/cn";

export function TableWrap({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>{children}</div>
  );
}

export function Table({
  className,
  children,
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      {children}
    </table>
  );
}

export function THead({
  className,
  children,
  sticky = false,
}: {
  className?: string;
  children: React.ReactNode;
  sticky?: boolean;
}) {
  return (
    <thead
      className={cn(
        "bg-surface-2 text-left text-[13px] text-ink-2",
        sticky && "sticky top-0 z-10",
        className,
      )}
    >
      {children}
    </thead>
  );
}

export function TH({
  className,
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 font-medium first:rounded-l-md last:rounded-r-md",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-t border-line transition-colors hover:bg-surface-2/60",
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TD({
  className,
  children,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 align-middle text-ink", className)} {...rest}>
      {children}
    </td>
  );
}
