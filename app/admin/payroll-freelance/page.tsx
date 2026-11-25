import { listPayrollPeriods } from "@/lib/payroll-admin";
import { getFreelanceSheet } from "@/lib/payroll-freelance";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
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

export default async function AdminPayrollFreelancePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const [sheet, periodOptions] = await Promise.all([
    getFreelanceSheet({ month: pint(sp.month), year: pint(sp.year) }),
    listPayrollPeriods(),
  ]);

  const grand =
    sheet.jam.reduce((t, r) => t + r.total, 0) +
    sheet.pengerjaan.reduce((t, r) => t + r.total, 0) +
    sheet.harian.reduce((t, r) => t + r.total, 0) +
    sheet.custom.reduce((t, r) => t + r.grandTotal, 0);
  const empty = !sheet.jam.length && !sheet.pengerjaan.length && !sheet.harian.length && !sheet.custom.length && !sheet.unassigned.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Summary Payroll Freelance"
        description={`Periode ${sheet.periodMonth}/${sheet.periodYear}. Tipe: jam, pengerjaan, harian, custom.`}
        actions={<PayrollPeriodNav periodOptions={periodOptions} month={sheet.periodMonth} year={sheet.periodYear} basePath="/admin/payroll-freelance" />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total freelance periode" value={<span className="text-2xl">{formatRupiah(grand)}</span>} tone="brand" />
        <StatCard label="Belum di-set tipe" value={sheet.unassigned.length} tone={sheet.unassigned.length ? "warning" : "neutral"} />
      </div>

      {empty ? <EmptyState title="Tidak ada karyawan freelance pada periode ini" /> : null}

      {sheet.jam.length ? (
        <Section title="Per Jam">
          <TableWrap><Table>
            <THead><TR><TH>Karyawan</TH><TH className="text-right">Jam kerja</TH><TH className="text-right">Rate/jam</TH><TH className="text-right">Total</TH></TR></THead>
            <TBody>{sheet.jam.map((r) => (
              <TR key={r.employeeId}><TD className="font-medium text-ink">{r.name}</TD><TD className="nums text-right text-ink-2">{r.jamKerja}</TD><TD className="nums text-right text-ink-2">{formatRupiah(r.ratePerJam)}</TD><TD className="nums text-right font-semibold text-ink">{formatRupiah(r.total)}</TD></TR>
            ))}</TBody>
          </Table></TableWrap>
        </Section>
      ) : null}

      {sheet.pengerjaan.length ? (
        <Section title="Per Pengerjaan">
          <TableWrap><Table>
            <THead><TR><TH>Karyawan</TH><TH className="text-right">Harga/pcs</TH><TH className="text-right">Jumlah pcs</TH><TH className="text-right">Total</TH></TR></THead>
            <TBody>{sheet.pengerjaan.map((r) => (
              <TR key={r.employeeId}><TD className="font-medium text-ink">{r.name}</TD><TD className="nums text-right text-ink-2">{formatRupiah(r.hargaPerPcs)}</TD><TD className="nums text-right text-ink-2">{r.jumlahPcs}</TD><TD className="nums text-right font-semibold text-ink">{formatRupiah(r.total)}</TD></TR>
            ))}</TBody>
          </Table></TableWrap>
        </Section>
      ) : null}

      {sheet.harian.length ? (
        <Section title="Harian">
          <TableWrap><Table>
            <THead><TR><TH>Karyawan</TH><TH className="text-right">Harga/hari</TH><TH className="text-right">Hari masuk</TH><TH className="text-right">Total</TH></TR></THead>
            <TBody>{sheet.harian.map((r) => (
              <TR key={r.employeeId}><TD className="font-medium text-ink">{r.name}</TD><TD className="nums text-right text-ink-2">{formatRupiah(r.hargaPerHari)}</TD><TD className="nums text-right text-ink-2">{r.hariMasuk}</TD><TD className="nums text-right font-semibold text-ink">{formatRupiah(r.total)}</TD></TR>
            ))}</TBody>
          </Table></TableWrap>
        </Section>
      ) : null}

      {sheet.custom.length ? (
        <Section title="Custom Pengerjaan">
          <div className="divide-y divide-line">
            {sheet.custom.map((r) => (
              <div key={r.employeeId} className="flex items-start justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <div className="font-medium text-ink">{r.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {r.items.map((it, i) => <Badge key={i} tone="neutral">{it.namaJenis}: {it.jumlahPcs}×{formatRupiah(it.hargaPerPcs)}</Badge>)}
                  </div>
                </div>
                <div className="nums shrink-0 font-semibold text-ink">{formatRupiah(r.grandTotal)}</div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {sheet.unassigned.length ? (
        <Section title="Belum di-set tipe freelance">
          <div className="flex flex-wrap gap-2 px-5 py-4">
            {sheet.unassigned.map((r) => <Badge key={r.employeeId} tone="warning">{r.name}</Badge>)}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden p-0">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      {children}
    </Card>
  );
}
