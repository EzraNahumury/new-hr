import { getJadwalGridData } from "@/features/jadwal/data";
import { JadwalGridManager } from "@/features/jadwal/JadwalGridManager";

export const dynamic = "force-dynamic";

export default async function AdminJadwalPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const p = await searchParams;
  const data = await getJadwalGridData(Number(p.month), Number(p.year));
  return (
    <JadwalGridManager
      basePath="/admin/jadwal"
      year={data.year}
      month={data.month}
      dates={data.dates}
      karyawanList={data.karyawanList}
      initialJadwal={data.jadwal}
      optionsByKaryawan={data.options}
    />
  );
}
