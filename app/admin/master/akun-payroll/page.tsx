import { listAdmins } from "@/lib/admins";
import { getPayrollEditorEmails } from "@/lib/payroll-editors";
import { AkunPayrollManager } from "@/features/master/AkunPayrollManager";

export const dynamic = "force-dynamic";

export default async function AdminAkunPayrollPage() {
  const [editors, admins] = await Promise.all([getPayrollEditorEmails(), listAdmins()]);
  const adminOptions = admins
    .filter((a) => a.role === "admin")
    .map((a) => ({ email: a.email.trim().toLowerCase(), name: a.name }));
  return <AkunPayrollManager initialEditors={editors} adminOptions={adminOptions} />;
}
