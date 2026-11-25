import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId } from "@/lib/hris";
import { listItemLoansByEmployee } from "@/lib/item-loans";
import { ItemLoansManager } from "@/features/item-loans/ItemLoansManager";

export const dynamic = "force-dynamic";

export default async function EmployeeMyItemLoansPage() {
  const session = await requireEmployeeSession();
  const profile = await getEmployeeByUserId(session.userId);
  const rows = profile ? await listItemLoansByEmployee(profile.id) : [];
  return (
    <ItemLoansManager
      mode="readonly"
      rows={rows}
      title="Barang Dipinjam"
      description="Barang/aset perusahaan yang tercatat dipinjam atas nama Anda."
    />
  );
}
