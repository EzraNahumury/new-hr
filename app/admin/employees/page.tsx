import { listEmployees, getEmployeeLookups, getEmployeeStats } from "@/lib/employees";
import {
  EmployeesManager,
  type Employee,
  type Lookups,
} from "@/features/employees/EmployeesManager";

export default async function AdminEmployeesPage() {
  const [employees, lookups, stats] = await Promise.all([
    listEmployees(),
    getEmployeeLookups(),
    getEmployeeStats(),
  ]);

  return (
    <EmployeesManager
      employees={employees as unknown as Employee[]}
      lookups={lookups as unknown as Lookups}
      stats={stats}
    />
  );
}
