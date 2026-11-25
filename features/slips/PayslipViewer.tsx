"use client";

import { useState } from "react";
import { Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/StatCard";
import { Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/Feedback";
import { PayrollPeriodNav } from "@/features/payroll/PayrollPeriodNav";
import { formatRupiah } from "@/lib/format";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any> & { employeeId: number; name: string; role: string; netIncome: number };
type PeriodOpt = { month: number; year: number; label: string };

export function PayslipViewer({
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
  const [sel, setSel] = useState<number | "">(rows[0]?.employeeId ?? "");
  const row = rows.find((r) => r.employeeId === sel) ?? null;

  const earnings: [string, number][] = row ? ([
    ["Gaji pokok", row.totalBaseSalary ?? 0],
    ["Uang makan", row.mealAllowance ?? 0],
    ["Uang kerajinan", row.diligenceAllowance ?? 0],
    ["Lembur", row.overtimeBonus ?? 0],
    ["Bonus omzet", row.omzetBonus ?? 0],
    ["Bonus performa", row.performanceBonus ?? 0],
    ["Insentif", row.incentive ?? 0],
    ["Transport", row.transportAllowance ?? 0],
    ["Kendaraan", row.vehicleAllowance ?? 0],
    ["Reimburse dinas", row.travelReimbursement ?? 0],
    ["BPJS", row.bpjs ?? 0],
  ] as [string, number][]).filter(([, v]) => v) : [];
  const deductions: [string, number][] = row ? ([
    ["Potongan absensi/denda", row.fineDeduction ?? 0],
    ["Potongan kontrak", row.contractCut ?? 0],
    ["Pinjaman", row.loanCut ?? 0],
    ["Potongan lain-lain", row.otherDeduction ?? 0],
  ] as [string, number][]).filter(([, v]) => v) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slip Gaji"
        description={`Periode ${periodLabel}. Pilih karyawan untuk melihat slip.`}
        actions={
          <div className="flex items-center gap-2">
            <PayrollPeriodNav periodOptions={periodOptions} month={periodMonth} year={periodYear} basePath="/admin/payslips" />
            <Button variant="secondary" onClick={() => window.print()} disabled={!row}><Printer className="h-4 w-4" /> Cetak</Button>
          </div>
        }
      />

      {rows.length === 0 ? (
        <EmptyState icon={<FileText className="h-5 w-5" />} title="Belum ada payroll untuk periode ini" />
      ) : (
        <>
          <div className="max-w-sm print:hidden">
            <Select value={String(sel)} onChange={(e) => setSel(Number(e.target.value))}>
              {rows.map((r) => <option key={r.employeeId} value={r.employeeId}>{r.name}</option>)}
            </Select>
          </div>

          {row ? (
            <Card>
              <CardContent className="space-y-5">
                <div className="flex items-start justify-between border-b border-line pb-4">
                  <div>
                    <div className="text-lg font-semibold text-ink">{row.name}</div>
                    <div className="text-[13px] text-ink-2">{row.role}{row.division ? ` · ${row.division}` : ""}</div>
                  </div>
                  <div className="text-right text-[13px] text-ink-2">
                    <div>Periode</div>
                    <div className="font-medium text-ink">{periodLabel}</div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-ink">Pendapatan</h4>
                    <dl className="space-y-1.5 text-sm">
                      {earnings.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4"><dt className="text-ink-2">{k}</dt><dd className="nums font-medium text-ink">{formatRupiah(v)}</dd></div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-ink">Potongan</h4>
                    <dl className="space-y-1.5 text-sm">
                      {deductions.length ? deductions.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4"><dt className="text-ink-2">{k}</dt><dd className="nums font-medium text-danger">−{formatRupiah(v)}</dd></div>
                      )) : <p className="text-[13px] text-ink-2">Tidak ada potongan.</p>}
                    </dl>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-line pt-4">
                  <span className="text-sm font-semibold text-ink">Take-home pay</span>
                  <span className="nums text-xl font-bold text-primary">{formatRupiah(row.netIncome)}</span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
