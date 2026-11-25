import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isHrdSuperEditor, requireAdminSession } from "@/lib/auth";
import {
  clearStaleLoanOverridesOnce,
  recomputeMediaHostliveAdvertiserLateOnce,
  recomputePagiHalfDayOnce,
} from "@/lib/attendance-recompute";
import { getAttendanceSheet } from "@/lib/hris";
import { getAttendanceCodeOptions } from "@/lib/attendance-codes";
import { listNationalHolidaysInRange } from "@/lib/holidays";
import { getCurrentAttendancePeriod } from "@/lib/payroll-admin";
import { PageHeader } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { AttendanceSheet } from "@/features/attendance/AttendanceSheet";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const admin = await requireAdminSession();

  // Read-path normalization (idempotent once-guards) — preserved from original.
  await Promise.all([
    (async () => {
      await recomputeMediaHostliveAdvertiserLateOnce().catch(() => {});
      await recomputePagiHalfDayOnce().catch(() => {});
    })(),
    clearStaleLoanOverridesOnce().catch(() => {}),
  ]);

  const params = await searchParams;
  const active = getCurrentAttendancePeriod();
  const rawMonth = params.month !== undefined ? Number(params.month) : active.month;
  const rawYear = params.year !== undefined ? Number(params.year) : active.year;
  const month = Number.isFinite(rawMonth) && rawMonth >= 1 && rawMonth <= 12 ? rawMonth : active.month;
  const year = Number.isFinite(rawYear) && rawYear >= 2000 ? rawYear : active.year;

  const sheet = await getAttendanceSheet({ month, year, view: "month" });

  const prevMonth = sheet.month === 1 ? 12 : sheet.month - 1;
  const prevYear = sheet.month === 1 ? sheet.year - 1 : sheet.year;
  const nextMonth = sheet.month === 12 ? 1 : sheet.month + 1;
  const nextYear = sheet.month === 12 ? sheet.year + 1 : sheet.year;

  const periodStart = `${prevYear}-${String(prevMonth).padStart(2, "0")}-26`;
  const periodEnd = `${sheet.year}-${String(sheet.month).padStart(2, "0")}-25`;
  const holidays = await listNationalHolidaysInRange(periodStart, periodEnd);
  const holidayMap = Object.fromEntries(holidays.map((h) => [h.date, h.description]));
  const codeOptions = await getAttendanceCodeOptions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Absensi"
        description="Rekap absensi periode payroll 26 bulan lalu – 25 bulan ini. Klik sel untuk mengubah kode."
        actions={
          <div className="flex items-center gap-1">
            <Link
              href={`/admin/attendance?month=${prevMonth}&year=${prevYear}`}
              className="rounded-md border border-line p-2 text-ink-2 hover:bg-surface-2 hover:text-ink"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <span className="min-w-[160px] text-center text-sm font-medium text-ink">
              {MONTHS[sheet.month - 1]} {sheet.year}
            </span>
            <Link
              href={`/admin/attendance?month=${nextMonth}&year=${nextYear}`}
              className="rounded-md border border-line p-2 text-ink-2 hover:bg-surface-2 hover:text-ink"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
      />
      <Card className="overflow-hidden p-0">
        <AttendanceSheet
          days={sheet.days}
          rows={sheet.rows as never}
          month={sheet.month}
          year={sheet.year}
          holidayMap={holidayMap}
          codeOptions={codeOptions}
          canEditHrd={isHrdSuperEditor(admin.email)}
        />
      </Card>
    </div>
  );
}
