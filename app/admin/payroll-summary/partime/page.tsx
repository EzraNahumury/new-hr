import { listPayrollPeriods } from "@/lib/payroll-admin";
import { getPartimeSheet } from "@/lib/payroll-partime";
import { PageHeader } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { PayrollPeriodNav } from "@/features/payroll/PayrollPeriodNav";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default async function AdminPartimePayrollPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const [sheet, periodOptions] = await Promise.all([
    getPartimeSheet({ month: pint(sp.month), year: pint(sp.year) }),
    listPayrollPeriods(),
  ]);

  if (!sheet) {
    return (
      <div className="space-y-6">
        <PageHeader title="Summary Payroll Partime" />
        <EmptyState title="Periode tidak tersedia" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Summary Payroll Partime"
        description={`Periode ${sheet.periodLabel}. Insentif ×25, uang makan ×25, potongan telat Rp5.000/telat.`}
        actions={<PayrollPeriodNav periodOptions={periodOptions} month={sheet.periodMonth} year={sheet.periodYear} basePath="/admin/payroll-summary/partime" />}
      />
      <Card className="overflow-hidden p-0">
        {sheet.rows.length === 0 ? (
          <div className="p-5"><EmptyState title="Tidak ada karyawan partime pada periode ini" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Karyawan</TH><TH className="text-right">Masuk</TH><TH className="text-right">Insentif</TH>
                  <TH className="text-right">Uang makan</TH><TH className="text-right">Lembur</TH>
                  <TH className="text-right">Potongan telat</TH><TH className="text-right">Total gaji</TH>
                </TR>
              </THead>
              <TBody>
                {sheet.rows.map((r) => (
                  <TR key={r.employeeId}>
                    <TD><div className="font-medium text-ink">{r.nama}</div><div className="text-[13px] text-ink-2">{r.jabatan}</div></TD>
                    <TD className="nums text-right text-ink-2">{r.masuk}</TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(r.insentifTotal)}</TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(r.uangMakanTotal)}</TD>
                    <TD className="nums text-right text-ink-2">{formatRupiah(r.overtimeBonus)}</TD>
                    <TD className="nums text-right text-danger">{formatRupiah(r.potonganTelat)}</TD>
                    <TD className="nums text-right font-semibold text-ink">{formatRupiah(r.totalGaji)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>
    </div>
  );
}
