import { requireEmployeeSession } from "@/lib/auth";
import { EMPLOYEE_RELIGIONS, getEmployeeProfileByUserId } from "@/lib/employees";
import { ProfileForm } from "@/features/employee/ProfileForm";

export const dynamic = "force-dynamic";

export default async function EmployeeProfilePage() {
  const session = await requireEmployeeSession();
  const profile = await getEmployeeProfileByUserId(session.userId);
  if (!profile) {
    return <p className="text-sm text-ink-2">Data karyawan tidak ditemukan.</p>;
  }
  return <ProfileForm profile={profile} religions={[...EMPLOYEE_RELIGIONS]} />;
}
