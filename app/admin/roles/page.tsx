import { listAdmins } from "@/lib/admins";
import { RolesManager } from "@/features/roles/RolesManager";

export default async function AdminRolesPage() {
  const rows = await listAdmins();
  return <RolesManager rows={rows} />;
}
