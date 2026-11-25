import Link from "next/link";
import {
  LogIn,
  LogOut,
  CalendarDays,
  Timer,
  FileText,
  HandCoins,
  Plane,
  Receipt,
} from "lucide-react";
import { requireEmployeeSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const actions = [
  { href: "/employee/check-in", title: "Presensi Masuk", desc: "Selfie & lokasi saat masuk.", icon: LogIn },
  { href: "/employee/check-out", title: "Presensi Pulang", desc: "Selfie & lokasi saat pulang.", icon: LogOut },
  { href: "/employee/attendance-history", title: "Riwayat Absensi", desc: "Rekap kehadiran pribadi.", icon: CalendarDays },
  { href: "/employee/overtime", title: "Data Lembur", desc: "Ajukan & pantau status lembur.", icon: Timer },
  { href: "/employee/business-trips", title: "Perjalanan Dinas", desc: "Pengajuan dinas luar kota.", icon: Plane },
  { href: "/employee/reimbursements", title: "Reimburse", desc: "Upload nota penggantian biaya.", icon: Receipt },
  { href: "/employee/payslips", title: "Slip Gaji", desc: "Slip gaji pribadi.", icon: FileText },
  { href: "/employee/loans", title: "Status Pinjaman", desc: "Sisa pinjaman & cicilan.", icon: HandCoins },
];

export default async function EmployeeDashboardPage() {
  const emp = await requireEmployeeSession();
  const firstName = emp.fullName?.split(" ")[0] || "Karyawan";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Halo, ${firstName}`}
        description="Portal karyawan — presensi, lembur, slip gaji, dan pengajuan dalam satu tempat."
      />

      <Card>
        <CardHeader>
          <CardTitle>Aksi cepat</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-3 rounded-lg border border-line p-4 transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-weak text-primary">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{item.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-ink-2">{item.desc}</span>
                </span>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
