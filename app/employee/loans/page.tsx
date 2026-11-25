import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId } from "@/lib/hris";
import {
  checkFullLoanEligibility,
  listEmployeeLoans,
  EMPLOYEE_LOAN_MAX_AMOUNT,
} from "@/lib/loans";
import { LoansManager } from "@/features/loans/LoansManager";

export const dynamic = "force-dynamic";

export default async function EmployeeLoansPage() {
  const session = await requireEmployeeSession();
  const profile = await getEmployeeByUserId(session.userId);
  if (!profile) {
    return <p className="text-sm text-ink-2">Data karyawan tidak ditemukan.</p>;
  }
  const [loans, eligibility] = await Promise.all([
    listEmployeeLoans(profile.id),
    checkFullLoanEligibility(profile.id, profile.tanggal_masuk_pertama),
  ]);
  return (
    <LoansManager
      mode="employee"
      loans={loans as never}
      eligibility={{ eligible: eligibility.eligible, reason: eligibility.reason }}
      maxAmount={EMPLOYEE_LOAN_MAX_AMOUNT}
    />
  );
}
