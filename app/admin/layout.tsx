import AppShell from "@/components/layout/AppShell";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminSession();
  return (
    <AppShell role="admin" user={{ name: admin.fullName, email: admin.email }}>
      {children}
    </AppShell>
  );
}
