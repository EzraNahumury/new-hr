import { requireEmployeeSession } from "@/lib/auth";
import { getEmployeeByUserId, getEmployeeContract } from "@/lib/hris";
import { PageHeader } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TableWrap, Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/Feedback";
import { formatRupiah, formatDate } from "@/lib/format";

const MONTHS = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

type Row = {
  nama: string; jabatan: string | null; divisi: string | null; departemen: string | null;
  tanggal_kontrak: string | null; kenaikan_tiap_tahun: string | number | null;
  nominal_potongan: string | number | null; bulan: number; tahun: number;
};

export const dynamic = "force-dynamic";

export default async function EmployeeContractPage() {
  const session = await requireEmployeeSession();
  const profile = await getEmployeeByUserId(session.userId);
  const rows = (profile ? await getEmployeeContract(profile.id) : []) as unknown as Row[];
  const head = rows[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Informasi Kontrak" description="Detail kontrak kerja dan jadwal potongan deposit Anda." />

      <Card>
        <CardHeader><CardTitle>Data kontrak</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Nama" value={head?.nama ?? profile?.nama ?? "—"} />
          <Info label="Jabatan" value={head?.jabatan ?? "—"} />
          <Info label="Tanggal kontrak" value={formatDate(head?.tanggal_kontrak)} />
          <Info label="Kenaikan/tahun" value={formatRupiah(head?.kenaikan_tiap_tahun ?? 0)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Jadwal potongan kontrak</CardTitle></CardHeader>
        {rows.length === 0 ? (
          <CardContent><EmptyState title="Belum ada potongan kontrak" description="Tidak ada jadwal potongan deposit untuk akun Anda." /></CardContent>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR><TH>Periode</TH><TH className="text-right">Nominal potongan</TH></TR>
              </THead>
              <TBody>
                {rows.map((r, i) => (
                  <TR key={i}>
                    <TD className="text-ink">{MONTHS[r.bulan] ?? r.bulan} {r.tahun}</TD>
                    <TD className="nums text-right text-ink">{formatRupiah(r.nominal_potongan ?? 0)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[13px] text-ink-2">{label}</p>
      <p className="mt-0.5 font-medium text-ink">{value}</p>
    </div>
  );
}
