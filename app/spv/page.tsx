import Link from "next/link";
import { CalendarDays, CalendarRange, KeyRound, Timer, ClipboardCheck } from "lucide-react";
import { requireSpvSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const actions = [
  { href: "/spv/jadwal", title: "Bagan Set Jadwal", desc: "Jadwal shift 1 bulan (26–25).", icon: CalendarDays },
  { href: "/spv/jadwal/master", title: "Master Set Jadwal", desc: "Pola mingguan Senin–Minggu.", icon: CalendarRange },
  { href: "/spv/jadwal/perizinan", title: "Perizinan Akses", desc: "Beri akses set jadwal ke karyawan.", icon: KeyRound },
  { href: "/spv/overtime-approvals", title: "Approval Lembur", desc: "Review & putuskan pengajuan lembur.", icon: Timer },
  { href: "/spv/attendance-approvals", title: "Approval Absensi", desc: "Approve telat & pulang awal.", icon: ClipboardCheck },
];

export default async function SpvDashboardPage() {
  const spv = await requireSpvSession();
  const firstName = spv.fullName?.split(" ")[0] || "Supervisor";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Halo, ${firstName}`}
        description="Workspace supervisor — penjadwalan shift dan approval tim."
      />

      <Card>
        <CardHeader>
          <CardTitle>Aksi cepat</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
