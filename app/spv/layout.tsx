import AppShell from "@/components/layout/AppShell";
import { requireSpvSession } from "@/lib/auth";

export default async function SpvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const spv = await requireSpvSession();
  return (
    <AppShell role="spv" user={{ name: spv.fullName, email: spv.email }}>
      {children}
    </AppShell>
  );
}
