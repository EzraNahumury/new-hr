import Link from "next/link";
import { Database, CalendarRange, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { MASTER_CATEGORIES } from "@/lib/master-lookup";
import { PageHeader } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const extras = [
  { href: "/admin/master/set-jadwal", title: "Set Jadwal (Grup Shift)", desc: "Atur dropdown shift per grup karyawan.", icon: CalendarRange },
  { href: "/admin/master/kode-absensi", title: "Kode Absensi", desc: "Kelola kode absensi & kategori payroll.", icon: Clock },
  { href: "/admin/master/akun-payroll", title: "Akun Payroll", desc: "Atur akun admin yang bisa edit payroll.", icon: ShieldCheck },
];

export default function MasterIndexPage() {
  const categories = Object.entries(MASTER_CATEGORIES).map(([key, cfg]) => ({
    href: `/admin/master/${key}`,
    title: cfg.label,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Master Data" description="Kelola dropdown dan konfigurasi dasar sistem." />

      <Card>
        <CardHeader>
          <CardTitle>Dropdown karyawan</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-center gap-3 rounded-lg border border-line p-4 transition-colors hover:border-line-strong hover:bg-surface-2"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary-weak text-primary">
                <Database className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 text-sm font-medium text-ink">{c.title}</span>
              <ChevronRight className="h-4 w-4 text-muted" />
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi lain</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-start gap-3 rounded-lg border border-line p-4 transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary-weak text-primary">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">{c.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-ink-2">{c.desc}</span>
                </span>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
