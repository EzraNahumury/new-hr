import { listContractReturns } from "@/lib/contract-returns";
import { ContractReturnsManager } from "@/features/contract/ContractReturnsManager";

export const dynamic = "force-dynamic";

export default async function AdminContractReturnsPage() {
  const rows = await listContractReturns();
  return <ContractReturnsManager rows={rows as never} />;
}
