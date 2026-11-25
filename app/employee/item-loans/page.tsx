import { listItemLoans } from "@/lib/item-loans";
import { ItemLoansManager } from "@/features/item-loans/ItemLoansManager";

export const dynamic = "force-dynamic";

export default async function EmployeeItemLoansPage() {
  const rows = await listItemLoans();
  return (
    <ItemLoansManager
      mode="readonly"
      rows={rows}
      title="Peminjaman Barang"
      description="Daftar peminjaman barang perusahaan (akses read-only departemen Finance)."
    />
  );
}
