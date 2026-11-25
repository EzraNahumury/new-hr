import { notFound } from "next/navigation";
import {
  MASTER_CATEGORIES,
  isMasterCategory,
  listMasterLookup,
} from "@/lib/master-lookup";
import { PageHeader } from "@/components/ui/StatCard";
import { MasterCrud } from "@/features/master/MasterCrud";

export default async function MasterCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isMasterCategory(category)) notFound();

  const cfg = MASTER_CATEGORIES[category];
  const items = await listMasterLookup(category);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Master · ${cfg.label}`}
        description={`Kelola isi dropdown ${cfg.label} yang dipakai di form karyawan dan modul lain.`}
      />
      <MasterCrud
        category={category}
        label={cfg.label}
        initialItems={items}
        isJabatan={category === "jabatan"}
      />
    </div>
  );
}
