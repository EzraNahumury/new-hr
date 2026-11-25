import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId } from "@/lib/hris";
import { listEmployeeDistributedBonusPeriods } from "@/lib/bonus-slip";
import { PageHeader } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Feedback";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

const MONTHS = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export default async function EmployeeBonusSlipsPage() {
  const session = await requireEmployeeSession();
  const employee = await getEmployeeByUserId(session.userId);
  const periods = (employee ? await listEmployeeDistributedBonusPeriods(employee.id) : []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader title="Slip Payroll Bonus" description="Slip bonus yang sudah didistribusikan ke akun Anda." />
      {periods.length === 0 ? (
        <EmptyState title="Belum ada slip bonus" description="Slip bonus akan muncul setelah admin mendistribusikannya." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {periods.map((p, i) => (
            <Card key={i} className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-ink">{MONTHS[p.month] ?? p.month} {p.year}</span>
              <Badge tone="brand" dot>Didistribusikan</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
