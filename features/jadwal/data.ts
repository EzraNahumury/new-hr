import {
  getJadwalForRange,
  getJadwalMasterAll,
  listTokoGudangKaryawan,
  listKaryawanForAccess,
  listJadwalEditors,
} from "@/lib/jadwal-karyawan";
import { getActivePayrollPeriod, getPayrollDateRange } from "@/lib/payroll-admin";
import { getShiftOptionsByKaryawan } from "@/lib/shift-groups";

function enumerateDates(startSql: string, endSql: string): string[] {
  const [sy, sm, sd] = startSql.split("-").map(Number);
  const [ey, em, ed] = endSql.split("-").map(Number);
  const cur = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const out: string[] = [];
  while (cur <= end) {
    out.push(
      `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`,
    );
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export async function getJadwalGridData(monthRaw?: number, yearRaw?: number) {
  const def = getActivePayrollPeriod();
  const month =
    Number.isInteger(monthRaw) && (monthRaw as number) >= 1 && (monthRaw as number) <= 12
      ? (monthRaw as number)
      : def.month;
  const year =
    Number.isInteger(yearRaw) && (yearRaw as number) >= 2024 && (yearRaw as number) <= 2100
      ? (yearRaw as number)
      : def.year;

  const range = getPayrollDateRange(month, year);
  const [karyawanList, jadwal] = await Promise.all([
    listTokoGudangKaryawan(),
    getJadwalForRange(range.startSql, range.endSql),
  ]);
  const options = await getShiftOptionsByKaryawan(
    karyawanList.map((k) => ({ id: k.id, penempatan: k.penempatan })),
  );
  const dates = enumerateDates(range.startSql, range.endSql);

  return { year, month, dates, karyawanList, jadwal, options };
}

export async function getJadwalMasterData() {
  const karyawanList = await listTokoGudangKaryawan();
  const [master, options] = await Promise.all([
    getJadwalMasterAll(),
    getShiftOptionsByKaryawan(karyawanList.map((k) => ({ id: k.id, penempatan: k.penempatan }))),
  ]);
  return { karyawanList, master, options };
}

export async function getJadwalAksesData() {
  const [candidates, editors] = await Promise.all([
    listKaryawanForAccess(),
    listJadwalEditors(),
  ]);
  return { candidates, grantedIds: editors.map((e) => e.id) };
}
