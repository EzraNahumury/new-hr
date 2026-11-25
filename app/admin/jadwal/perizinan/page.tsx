import { getJadwalAksesData } from "@/features/jadwal/data";
import { JadwalAksesManager } from "@/features/jadwal/JadwalAksesManager";

export const dynamic = "force-dynamic";

export default async function AdminJadwalPerizinanPage() {
  const { candidates, grantedIds } = await getJadwalAksesData();
  return <JadwalAksesManager candidates={candidates} grantedIds={grantedIds} />;
}
