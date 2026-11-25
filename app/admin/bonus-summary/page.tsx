import { listPayrollPeriods } from "@/lib/payroll-admin";
import { getBonusSummarySheet } from "@/lib/bonus-summary";
import { PageHeader } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { PayrollPeriodNav } from "@/features/payroll/PayrollPeriodNav";

export const dynamic = "force-dynamic";

function pint(v: string | string[] | undefined) {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default async function AdminBonusSummaryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const month = pint(sp.month);
  const year = pint(sp.year);
  const [sheet, periodOptions] = await Promise.all([
    getBonusSummarySheet(month && year ? { month, year } : undefined),
    listPayrollPeriods(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Summary Bonus"
        description={`Periode ${sheet.periodLabel}. Bonus Personal/Team/Company per karyawan.`}
        actions={<PayrollPeriodNav periodOptions={periodOptions} month={sheet.periodMonth} year={sheet.periodYear} basePath="/admin/bonus-summary" />}
      />

      <Card className="border-info/30 bg-info-weak/30 p-4 text-sm text-ink">
        Rumus nominal bonus (Personal/Team/Company) belum diimplementasikan di backend — nominal sementara 0.
        Halaman ini menampilkan kelayakan & status approval per karyawan (read-only).
      </Card>

      <Card className="overflow-hidden p-0">
        {sheet.rows.length === 0 ? (
          <div className="p-5"><EmptyState title="Tidak ada data" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Karyawan</TH><TH>Golongan</TH><TH className="text-right">Hadir</TH>
                  <TH className="text-right">Telat</TH><TH>Personal</TH><TH>Team</TH><TH>Company</TH>
                </TR>
              </THead>
              <TBody>
                {sheet.rows.map((r) => (
                  <TR key={r.employeeId}>
                    <TD><div className="font-medium text-ink">{r.name}</div><div className="text-[13px] text-ink-2">{r.division}</div></TD>
                    <TD>{r.bonusGroup ? <Badge tone="neutral">{r.bonusGroup}</Badge> : <span className="text-ink-2">—</span>}</TD>
                    <TD className="nums text-right text-ink-2">{r.presentDays}/{r.workDays}</TD>
                    <TD className="nums text-right text-ink-2">{r.lateCount}</TD>
                    <TD><Badge tone={r.personalEligible ? "success" : "neutral"} dot>{r.personalEligible ? "Layak" : "Belum"}</Badge></TD>
                    <TD><Badge tone={r.teamApproved ? "success" : "neutral"} dot>{r.teamApproved ? "Approved" : "—"}</Badge></TD>
                    <TD><Badge tone={r.companyApproved ? "success" : "neutral"} dot>{r.companyApproved ? "Approved" : "—"}</Badge></TD>
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
