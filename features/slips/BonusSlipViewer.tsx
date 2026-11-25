"use client";

import { useState } from "react";
import { Printer, Coins } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/Feedback";
import { PayrollPeriodNav } from "@/features/payroll/PayrollPeriodNav";
import { formatRupiah } from "@/lib/format";

type Row = { employeeId: number; name: string; role: string; bonusTypeLabel: string; amount: number; note: string | null };
type PeriodOpt = { month: number; year: number; label: string };

export function BonusSlipViewer({
  rows,
  periodOptions,
  periodMonth,
  periodYear,
  periodLabel,
}: {
  rows: Row[];
  periodOptions: PeriodOpt[];
  periodMonth: number;
  periodYear: number;
  periodLabel: string;
}) {
  const withBonus = rows.filter((r) => r.amount > 0);
  const [sel, setSel] = useState<number | "">(withBonus[0]?.employeeId ?? "");
  const row = withBonus.find((r) => r.employeeId === sel) ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slip Bonus"
        description={`Periode ${periodLabel}. Slip bonus karyawan yang menerima bonus.`}
        actions={
          <div className="flex items-center gap-2">
            <PayrollPeriodNav periodOptions={periodOptions} month={periodMonth} year={periodYear} basePath="/admin/bonus-slips" />
            <Button variant="secondary" onClick={() => window.print()} disabled={!row}><Printer className="h-4 w-4" /> Cetak</Button>
          </div>
        }
      />

      {withBonus.length === 0 ? (
        <EmptyState icon={<Coins className="h-5 w-5" />} title="Belum ada bonus untuk periode ini" />
      ) : (
        <>
          <div className="max-w-sm print:hidden">
            <Select value={String(sel)} onChange={(e) => setSel(Number(e.target.value))}>
              {withBonus.map((r) => <option key={r.employeeId} value={r.employeeId}>{r.name}</option>)}
            </Select>
          </div>

          {row ? (
            <Card>
              <CardContent className="space-y-5">
                <div className="flex items-start justify-between border-b border-line pb-4">
                  <div>
                    <div className="text-lg font-semibold text-ink">{row.name}</div>
                    <div className="text-[13px] text-ink-2">{row.role}</div>
                  </div>
                  <Badge tone="brand">{row.bonusTypeLabel}</Badge>
                </div>
                {row.note ? <p className="text-sm text-ink-2">{row.note}</p> : null}
                <div className="flex items-center justify-between border-t border-line pt-4">
                  <span className="text-sm font-semibold text-ink">Total bonus ({periodLabel})</span>
                  <span className="nums text-xl font-bold text-primary">{formatRupiah(row.amount)}</span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
