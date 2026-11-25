import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CalendarRange,
  KeyRound,
  Boxes,
  Bot,
  Clock,
  Timer,
  ClipboardCheck,
  MapPin,
  Plane,
  Receipt,
  Wallet,
  Coins,
  BarChart3,
  FileText,
  Send,
  Landmark,
  HandCoins,
  FileX,
  Undo2,
  Database,
  ShieldCheck,
  UserCog,
  User,
  type LucideIcon,
} from "lucide-react";

export type Role = "admin" | "employee" | "spv";

export type EmployeeCap =
  | "salesField"
  | "scheduler"
  | "overtimeApprover"
  | "manager"
  | "financeDept";

export type EmployeeCaps = Partial<Record<EmployeeCap, boolean>>;

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  cap?: EmployeeCap; // employee-only: show when cap is true
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
  collapsible?: boolean;
};

const adminNav: NavGroup[] = [
  { items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    label: "Manajemen Karyawan",
    items: [
      { label: "Data Karyawan", href: "/admin/employees", icon: Users },
      { label: "Bagan Set Jadwal", href: "/admin/jadwal", icon: CalendarDays },
      { label: "Master Set Jadwal", href: "/admin/jadwal/master", icon: CalendarRange },
      { label: "Perizinan Akses Jadwal", href: "/admin/jadwal/perizinan", icon: KeyRound },
      { label: "Peminjaman Barang", href: "/admin/item-loans", icon: Boxes },
      { label: "HR Agent", href: "/admin/hr-agent", icon: Bot },
    ],
  },
  {
    label: "Absensi & Aktivitas",
    items: [
      { label: "Absensi", href: "/admin/attendance", icon: Clock },
      { label: "Approval Absensi", href: "/admin/attendance-approvals", icon: ClipboardCheck },
      { label: "Lembur", href: "/admin/overtime", icon: Timer },
      { label: "Laporan Kunjungan", href: "/admin/visit-reports", icon: MapPin },
    ],
  },
  {
    label: "Approval",
    items: [
      { label: "Perjalanan Dinas", href: "/admin/business-trips", icon: Plane },
      { label: "Reimburse", href: "/admin/reimbursements", icon: Receipt },
    ],
  },
  {
    label: "Payroll",
    items: [
      { label: "Summary Payroll", href: "/admin/payroll-summary", icon: Wallet },
      { label: "Payroll Solo", href: "/admin/payroll-summary/solo", icon: Wallet },
      { label: "Sales Nasional", href: "/admin/payroll-summary/sales-nasional", icon: Wallet },
      { label: "Penjahit", href: "/admin/payroll-summary/penjahit", icon: Wallet },
      { label: "Partime", href: "/admin/payroll-summary/partime", icon: Wallet },
      { label: "Freelance", href: "/admin/payroll-freelance", icon: Wallet },
      { label: "Payroll Bonus", href: "/admin/payroll-bonus", icon: Coins },
      { label: "Summary Bonus", href: "/admin/bonus-summary", icon: Coins },
    ],
  },
  {
    label: "KPI",
    collapsible: true,
    items: [
      { label: "KPI RnD", href: "/admin/kpi/rnd", icon: BarChart3 },
      { label: "KPI Finance", href: "/admin/kpi/finance", icon: BarChart3 },
      { label: "KPI Sales & Retail", href: "/admin/kpi/sales-retail", icon: BarChart3 },
      { label: "KPI Logistik", href: "/admin/kpi/logistik", icon: BarChart3 },
    ],
  },
  {
    label: "Slip Gaji",
    items: [
      { label: "Slip Gaji", href: "/admin/payslips", icon: FileText },
      { label: "Distribusi Slip", href: "/admin/payslip-distribution", icon: Send },
      { label: "Slip Bonus", href: "/admin/bonus-slips", icon: FileText },
      { label: "Distribusi Slip Bonus", href: "/admin/bonus-slip-distribution", icon: Send },
    ],
  },
  {
    label: "Keuangan & Kontrak",
    items: [
      { label: "Finance", href: "/admin/finance", icon: Landmark },
      { label: "Pinjaman", href: "/admin/loans", icon: HandCoins },
      { label: "Potongan Kontrak", href: "/admin/contract-deductions", icon: FileX },
      { label: "Pengembalian Kontrak", href: "/admin/contract-returns", icon: Undo2 },
    ],
  },
  {
    label: "Master",
    collapsible: true,
    items: [
      { label: "Unit", href: "/admin/master/unit", icon: Database },
      { label: "Jabatan", href: "/admin/master/jabatan", icon: Database },
      { label: "Departemen", href: "/admin/master/departemen", icon: Database },
      { label: "Divisi", href: "/admin/master/divisi", icon: Database },
      { label: "Sub Divisi", href: "/admin/master/sub_divisi", icon: Database },
      { label: "Set Jadwal (Grup Shift)", href: "/admin/master/set-jadwal", icon: CalendarRange },
      { label: "Kode Absensi", href: "/admin/master/kode-absensi", icon: Clock },
      { label: "Akun Payroll", href: "/admin/master/akun-payroll", icon: ShieldCheck },
    ],
  },
  {
    label: "Pengaturan",
    items: [{ label: "Role", href: "/admin/roles", icon: UserCog }],
  },
];

const spvNav: NavGroup[] = [
  { items: [{ label: "Dashboard", href: "/spv", icon: LayoutDashboard }] },
  {
    label: "Set Jadwal",
    items: [
      { label: "Bagan Set Jadwal", href: "/spv/jadwal", icon: CalendarDays },
      { label: "Master Set Jadwal", href: "/spv/jadwal/master", icon: CalendarRange },
      { label: "Perizinan Akses", href: "/spv/jadwal/perizinan", icon: KeyRound },
    ],
  },
  {
    label: "Approval",
    items: [
      { label: "Approval Lembur", href: "/spv/overtime-approvals", icon: Timer },
      { label: "Approval Absensi", href: "/spv/attendance-approvals", icon: ClipboardCheck },
    ],
  },
];

const employeeNav: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/employee", icon: LayoutDashboard },
      { label: "Profil Pribadi", href: "/employee/profile", icon: User },
    ],
  },
  {
    label: "Presensi",
    items: [
      { label: "Presensi Masuk", href: "/employee/check-in", icon: Clock },
      { label: "Presensi Pulang", href: "/employee/check-out", icon: Clock },
      { label: "Riwayat Absensi", href: "/employee/attendance-history", icon: CalendarDays },
      { label: "Set Jadwal", href: "/employee/jadwal", icon: CalendarRange, cap: "scheduler" },
      { label: "Approval Absensi", href: "/employee/attendance-approvals", icon: ClipboardCheck, cap: "overtimeApprover" },
    ],
  },
  {
    label: "Aktivitas",
    items: [
      { label: "Perjalanan Dinas", href: "/employee/business-trips", icon: Plane },
      { label: "Data Lembur", href: "/employee/overtime", icon: Timer },
      { label: "Pengajuan Reimburse", href: "/employee/reimbursements", icon: Receipt },
      { label: "Laporan Kunjungan", href: "/employee/visit-report", icon: MapPin, cap: "salesField" },
      { label: "Approval Lembur", href: "/employee/overtime-approvals", icon: Timer, cap: "overtimeApprover" },
      { label: "History Lembur", href: "/employee/overtime-history", icon: Clock, cap: "manager" },
    ],
  },
  {
    label: "Keuangan & Slip",
    items: [
      { label: "Status Pinjaman", href: "/employee/loans", icon: HandCoins },
      { label: "Informasi Kontrak", href: "/employee/contract", icon: FileText },
      { label: "Slip Gaji", href: "/employee/payslips", icon: FileText },
      { label: "Slip Payroll Bonus", href: "/employee/bonus-slips", icon: FileText },
      { label: "Finance", href: "/employee/finance", icon: Landmark, cap: "financeDept" },
    ],
  },
  {
    label: "Barang",
    items: [
      { label: "Barang Dipinjam", href: "/employee/my-item-loans", icon: Boxes },
      { label: "Peminjaman Barang", href: "/employee/item-loans", icon: Boxes, cap: "financeDept" },
    ],
  },
];

export function getNav(role: Role, caps: EmployeeCaps = {}): NavGroup[] {
  if (role === "admin") return adminNav;
  if (role === "spv") return spvNav;
  // employee: drop capability items that aren't granted, then empty groups
  return employeeNav
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => !it.cap || caps[it.cap]),
    }))
    .filter((g) => g.items.length > 0);
}

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  employee: "/employee",
  spv: "/spv",
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  employee: "Karyawan",
  spv: "Supervisor",
};
