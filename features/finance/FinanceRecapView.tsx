import { PageHeader } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { PayrollPeriodNav } from "@/features/payroll/PayrollPeriodNav";
import { formatRupiah } from "@/lib/format";

type DeptData = {
  departemen: string;
  totalGaji: number;
  totalPotonganDenda: number;
  totalPotonganKontrak: number;
  totalPotonganPinjaman: number;
  totalPotonganLain: number;
  total: number;
};
type UnitGroup = { unit: string; departments: DeptData[]; totals: DeptData };
/* eslint-disable @typescript-eslint/no-explicit-any */
type Data = {
  unitGroups: UnitGroup[];
  selectedMonth: number;
  selectedYear: number;
  periodOptions: { month: number; year: number; label: string }[];
} & Record<string, any>;

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export function FinanceRecapView({
  data,
  basePath,
  title,
  description,
}: {
  data: Data;
  basePath: string;
  title: string;
  description?: string;
}) {
  const label = `${MONTHS[data.selectedMonth - 1]} ${data.selectedYear}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description ?? `Rekap pencairan per unit & departemen · ${label}.`}
        actions={<PayrollPeriodNav periodOptions={data.periodOptions} month={data.selectedMonth} year={data.selectedYear} basePath={basePath} />}
      />

      {data.unitGroups.length === 0 ? (
        <EmptyState title="Tidak ada data finance pada periode ini" />
      ) : (
        data.unitGroups.map((g) => (
          <Card key={g.unit} className="overflow-hidden p-0">
            <CardHeader>
              <CardTitle>{g.unit}</CardTitle>
              <span className="nums text-sm font-semibold text-ink">{formatRupiah(g.totals.total)}</span>
            </CardHeader>
            <TableWrap>
              <Table>
                <THead>
                  <TR>
                    <TH>Departemen</TH>
                    <TH className="text-right">Gaji</TH>
                    <TH className="text-right">Denda</TH>
                    <TH className="text-right">Kontrak</TH>
                    <TH className="text-right">Pinjaman</TH>
                    <TH className="text-right">Lain</TH>
                    <TH className="text-right">Total</TH>
                  </TR>
                </THead>
                <TBody>
                  {g.departments.map((d) => (
                    <TR key={d.departemen}>
                      <TD className="text-ink">{d.departemen}</TD>
                      <TD className="nums text-right text-ink-2">{formatRupiah(d.totalGaji)}</TD>
                      <TD className="nums text-right text-ink-2">{formatRupiah(d.totalPotonganDenda)}</TD>
                      <TD className="nums text-right text-ink-2">{formatRupiah(d.totalPotonganKontrak)}</TD>
                      <TD className="nums text-right text-ink-2">{formatRupiah(d.totalPotonganPinjaman)}</TD>
                      <TD className="nums text-right text-ink-2">{formatRupiah(d.totalPotonganLain)}</TD>
                      <TD className="nums text-right font-medium text-ink">{formatRupiah(d.total)}</TD>
                    </TR>
                  ))}
                  <TR className="bg-surface-2/50 font-semibold">
                    <TD className="text-ink">Total {g.unit}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(g.totals.totalGaji)}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(g.totals.totalPotonganDenda)}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(g.totals.totalPotonganKontrak)}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(g.totals.totalPotonganPinjaman)}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(g.totals.totalPotonganLain)}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(g.totals.total)}</TD>
                  </TR>
                </TBody>
              </Table>
            </TableWrap>
          </Card>
        ))
      )}
    </div>
  );
}
