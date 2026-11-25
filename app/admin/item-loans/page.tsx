import { listItemLoans } from "@/lib/item-loans";
import { listEmployees } from "@/lib/employees";
import { ItemLoansManager } from "@/features/item-loans/ItemLoansManager";

export const dynamic = "force-dynamic";

export default async function AdminItemLoansPage() {
  const [rows, emps] = await Promise.all([listItemLoans(), listEmployees()]);
  const employees = emps.map((e) => ({ id: e.id, name: e.name, nip: e.nip }));
  return <ItemLoansManager mode="admin" rows={rows} employees={employees} />;
}
