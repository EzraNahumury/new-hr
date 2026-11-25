import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId, getEmployeePayslips } from "@/lib/hris";
import { PageHeader } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { formatRupiah } from "@/lib/format";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default async function EmployeePayslipsPage() {
  const session = await requireEmployeeSession();
  const employee = await getEmployeeByUserId(session.userId);
  const rows = (employee ? await getEmployeePayslips(employee.id) : []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader title="Slip Gaji" description="Slip gaji yang sudah didistribusikan ke akun Anda." />
      <Card className="overflow-hidden p-0">
        {rows.length === 0 ? (
          <div className="p-5"><EmptyState title="Belum ada slip gaji" description="Slip akan muncul setelah admin mendistribusikannya." /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR><TH>No. Slip</TH><TH>Periode</TH><TH className="text-right">Gaji bersih</TH><TH>Status</TH><TH>Didistribusi</TH></TR>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <TR key={r.id}>
                    <TD className="nums text-ink">{r.nomor_slip || "—"}</TD>
                    <TD className="text-ink-2">{r.periode_bulan ? `${MONTHS[r.periode_bulan]} ${r.periode_tahun}` : "—"}</TD>
                    <TD className="nums text-right font-medium text-ink">{formatRupiah(r.gaji_bersih ?? 0)}</TD>
                    <TD><StatusBadge status={r.status_distribusi} /></TD>
                    <TD className="text-ink-2">{r.tanggal_distribusi || "—"}</TD>
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
