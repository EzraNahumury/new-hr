"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Input";

type PeriodOpt = { month: number; year: number; label: string };

export function PayrollPeriodNav({
  periodOptions,
  month,
  year,
  basePath,
}: {
  periodOptions: PeriodOpt[];
  month: number;
  year: number;
  basePath: string;
}) {
  const router = useRouter();
  return (
    <Select
      value={`${year}-${month}`}
      onChange={(e) => {
        const [y, m] = e.target.value.split("-");
        router.push(`${basePath}?month=${m}&year=${y}`);
      }}
      className="h-10 w-auto"
    >
      {periodOptions.map((p) => (
        <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`}>{p.label}</option>
      ))}
    </Select>
  );
}
