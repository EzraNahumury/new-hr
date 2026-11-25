import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId, getEmployeeAttendanceHistory } from "@/lib/hris";
import { PageHeader } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

export default async function EmployeeAttendanceHistoryPage() {
  const session = await requireEmployeeSession();
  const employee = await getEmployeeByUserId(session.userId);
  const rows = (employee ? (await getEmployeeAttendanceHistory(employee.id)).slice(0, 200) : []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Absensi" description="Rekap kehadiran pribadi (200 terbaru)." />
      <Card className="overflow-hidden p-0">
        {rows.length === 0 ? (
          <div className="p-5"><EmptyState title="Belum ada riwayat absensi" /></div>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR><TH>Tanggal</TH><TH>Status</TH><TH>Masuk</TH><TH>Pulang</TH><TH className="text-right">Telat</TH><TH>Keterangan</TH></TR>
              </THead>
              <TBody>
                {rows.map((r, i) => (
                  <TR key={i}>
                    <TD className="text-ink">{r.tanggal}</TD>
                    <TD>
                      <StatusBadge status={r.status_absensi} />
                      {r.approval_status === "pending" ? <span className="ml-1 text-[12px] text-warning">(menunggu approval)</span> : null}
                    </TD>
                    <TD className="nums text-ink-2">{r.jam_masuk || "—"}</TD>
                    <TD className="nums text-ink-2">{r.jam_pulang || "—"}</TD>
                    <TD className="nums text-right text-ink-2">{r.terlambat_menit ? `${r.terlambat_menit}m` : "—"}</TD>
                    <TD className="text-[13px] text-ink-2">{r.keterangan || r.catatan_atasan || "—"}</TD>
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
