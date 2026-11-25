import Link from "next/link";
import {
  Users,
  Clock,
  Wallet,
  FileText,
  CalendarDays,
  Timer,
  HandCoins,
  ChevronRight,
} from "lucide-react";
import { requireAdminSession } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/hris";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const quickLinks = [
  { href: "/admin/employees", title: "Data Karyawan", desc: "Akun, identitas kerja, kontrak, rekening.", icon: Users },
  { href: "/admin/attendance", title: "Rekap Absensi", desc: "Spreadsheet presensi harian & bulanan.", icon: Clock },
  { href: "/admin/overtime", title: "Approval Lembur", desc: "Review bukti lembur dan putuskan.", icon: Timer },
  { href: "/admin/loans", title: "Pinjaman", desc: "Pinjaman aktif, cicilan, sisa kewajiban.", icon: HandCoins },
  { href: "/admin/payroll-summary", title: "Summary Payroll", desc: "Komponen payroll sebelum distribusi.", icon: Wallet },
  { href: "/admin/payslips", title: "Slip Gaji", desc: "Slip yang sudah dibuat & siap dibagikan.", icon: FileText },
];

export default async function AdminDashboardPage() {
  const admin = await requireAdminSession();
  const stats = await getAdminDashboardStats();

  const firstName = admin.fullName?.split(" ")[0] || "Admin";

  const attention = [
    { label: "Absensi masuk hari ini", value: stats.attendanceToday, href: "/admin/attendance" },
    { label: "Draft payroll menunggu proses", value: stats.payrollPending, href: "/admin/payroll-summary" },
    { label: "Slip gaji belum terdistribusi", value: stats.payslipsPending, href: "/admin/payslip-distribution" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Halo, ${firstName}`}
        description="Ringkasan HR, absensi, dan payroll AVA Group — langsung dari database."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total karyawan" value={stats.totalEmployees} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Absensi hari ini" value={stats.attendanceToday} tone="info" icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Payroll pending" value={stats.payrollPending} tone="warning" icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Slip belum didistribusi" value={stats.payslipsPending} tone="brand" icon={<FileText className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Akses cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-lg border border-line p-4 transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary-weak text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-5 text-ink-2">{item.desc}</span>
                  </span>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perlu perhatian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {attention.map((row) => (
              <Link
                key={row.label}
                href={row.href}
                className="flex items-center justify-between gap-3 rounded-lg border border-line px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <span className="min-w-0">
                  <span className="nums text-xl font-semibold text-ink">{row.value}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-ink-2">{row.label}</span>
                </span>
                <ChevronRight className="h-4 w-4 flex-none text-muted" />
              </Link>
            ))}
            <p className="flex items-center gap-2 pt-1 text-[13px] text-ink-2">
              <CalendarDays className="h-4 w-4" />
              Periode payroll berjalan: 26 bulan lalu – 25 bulan ini.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
