import {
  listContractDeductionPlans,
  listContractDeductionEmployees,
} from "@/lib/contract-deductions";
import { ContractDeductionsManager } from "@/features/contract/ContractDeductionsManager";

export const dynamic = "force-dynamic";

export default async function AdminContractDeductionsPage() {
  const [plans, emps] = await Promise.all([
    listContractDeductionPlans(),
    listContractDeductionEmployees(),
  ]);
  const employees = emps.map((e) => ({ employeeId: e.employeeId, name: e.name }));
  return <ContractDeductionsManager plans={plans as never} employees={employees} />;
}
