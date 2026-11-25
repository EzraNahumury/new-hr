import { listAdminLoans } from "@/lib/loans";
import { listEmployees } from "@/lib/employees";
import { LoansManager } from "@/features/loans/LoansManager";

export const dynamic = "force-dynamic";

export default async function AdminLoansPage() {
  const [loans, emps] = await Promise.all([listAdminLoans(), listEmployees()]);
  const employees = emps.map((e) => ({ id: e.id, name: e.name }));
  return <LoansManager mode="admin" loans={loans as never} employees={employees} />;
}
