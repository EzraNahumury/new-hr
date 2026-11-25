import { requireAdminSession } from "@/lib/auth";
import { EMPLOYEE_PLACEMENTS } from "@/lib/employees";
import { getMasterLookupOptions } from "@/lib/master-lookup";
import { getShiftGroupRoster, listShiftGroups } from "@/lib/shift-groups";
import { getSelectableShifts, listShiftDefs } from "@/lib/shift-defs";
import { SetJadwalManager } from "@/features/master/SetJadwalManager";

export const dynamic = "force-dynamic";

export default async function AdminMasterSetJadwalPage() {
  await requireAdminSession();
  const [groups, roster, master, selectableShifts, shiftDefs] = await Promise.all([
    listShiftGroups(),
    getShiftGroupRoster(),
    getMasterLookupOptions(),
    getSelectableShifts(),
    listShiftDefs(),
  ]);

  return (
    <SetJadwalManager
      initialShifts={shiftDefs.map((d) => ({
        code: d.code, label: d.label, startMin: d.startMin, checkoutStartMin: d.checkoutStartMin,
        toleranceMin: d.toleranceMin, isLibur: d.isLibur, isSelectable: d.isSelectable, isSystem: d.isSystem,
      }))}
      initialGroups={groups as never}
      roster={roster as never}
      selectableShifts={selectableShifts}
      jabatanOptions={master.roles.map((o) => o.value)}
      departemenOptions={master.departments.map((o) => o.value)}
      penempatanOptions={[...EMPLOYEE_PLACEMENTS]}
    />
  );
}
