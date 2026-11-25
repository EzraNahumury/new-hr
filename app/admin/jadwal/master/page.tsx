import { getJadwalMasterData } from "@/features/jadwal/data";
import { JadwalMasterManager } from "@/features/jadwal/JadwalMasterManager";

export const dynamic = "force-dynamic";

export default async function AdminJadwalMasterPage() {
  const data = await getJadwalMasterData();
  return (
    <JadwalMasterManager
      karyawanList={data.karyawanList}
      master={data.master}
      optionsByKaryawan={data.options}
    />
  );
}
