import { listPayrollPeriods } from "@/lib/payroll-admin";
import { getPenjahitSheet } from "@/lib/payroll-penjahit";
import { PageHeader } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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

export default async function AdminPenjahitPayrollPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const [sheet, periodOptions] = await Promise.all([
    getPenjahitSheet({ month: pint(sp.month), year: pint(sp.year) }),
    listPayrollPeriods(),
  ]);

  if (!sheet) {
    return (
      <div className="space-y-6">
        <PageHeader title="Summary Payroll Penjahit" />
        <EmptyState title="Periode tidak tersedia" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Summary Payroll Penjahit"
        description={`Periode ${sheet.periodLabel}. Mingguan (tgl 8/16/25/1) & bulanan (tgl 25).`}
        actions={<PayrollPeriodNav periodOptions={periodOptions} month={sheet.periodMonth} year={sheet.periodYear} basePath="/admin/payroll-summary/penjahit" />}
      />
      <Card className="overflow-hidden p-0">
        {sheet.rows.length === 0 ? (
          <div className="p-5"><EmptyState title="Tidak ada penjahit pada periode ini" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Karyawan</TH><TH>Tipe</TH><TH className="text-right">Gaji pokok</TH>
                  <TH className="text-right">Kerajinan</TH><TH className="text-right">Potongan</TH>
                  <TH className="text-right">Penerimaan bersih</TH><TH className="text-right">Pencairan mingguan</TH>
                </TR>
              </THead>
              <TBody>
                {sheet.rows.map((r) => {
                  const potongan = r.potonganDenda + r.potonganKontrak + r.potonganPinjaman + r.potonganLainLain;
                  return (
                    <TR key={r.employeeId}>
                      <TD><div className="font-medium text-ink">{r.nama}</div><div className="text-[13px] text-ink-2">{r.subDivisi || r.jabatan}</div></TD>
                      <TD><Badge tone={r.tipePayroll === "mingguan" ? "info" : "neutral"}>{r.tipePayroll}</Badge></TD>
                      <TD className="nums text-right text-ink-2">{formatRupiah(r.totalGajiPokok)}</TD>
                      <TD className="nums text-right text-ink-2">{formatRupiah(r.kerajinanEarned)}</TD>
                      <TD className="nums text-right text-danger">{formatRupiah(potongan)}</TD>
                      <TD className="nums text-right font-semibold text-ink">{formatRupiah(r.penerimaanBersih)}</TD>
                      <TD className="nums text-right text-[13px] text-ink-2">
                        {r.pencairan ? (
                          <span>{formatRupiah(r.pencairan.minggu1)} / {formatRupiah(r.pencairan.minggu2)} / {formatRupiah(r.pencairan.minggu3)} / {formatRupiah(r.pencairan.minggu4)}</span>
                        ) : "—"}
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>
    </div>
  );
}
