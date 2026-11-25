import { listAttendanceCodes } from "@/lib/attendance-codes";
import { KodeAbsensiManager } from "@/features/master/KodeAbsensiManager";

export const dynamic = "force-dynamic";

export default async function AdminKodeAbsensiPage() {
  const items = await listAttendanceCodes();
  return <KodeAbsensiManager initialItems={items as never} />;
}
