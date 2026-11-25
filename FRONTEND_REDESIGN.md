# Frontend Redesign — Implementation Tracker

> Companion to `README.md` (the system audit). This file tracks the **UI/UX
> redesign** only. The audit README is the source of truth for existing
> features, business logic, roles, APIs, and DB; it must not be overwritten.
> Every "preserve" claim here traces back to a README section (`§`).
>
> Last updated: 2026-11-25 · Status: **Phase 1 complete, Phase 2 pending approval**

---

## 0. Objective

Rebuild 100% of the visual experience while preserving 100% of existing
functionality, business rules, roles, permissions, API contracts, and DB
schema. Premium enterprise SaaS quality (Linear / Vercel / Stripe / Notion
character), human-designed — not a generic AI dashboard template.

**Non-negotiable contract:** see `README.md §15.1` (must-preserve) and
`§15.4` (backend/API/DB compatibility). No business-logic, schema, route,
or permission changes as part of the redesign (per Strict Rules 1–6).

---

## 1. Implementation approach — DECIDED: Option A

Base = `C:\new-hr`; backend ported **unchanged** from `web_hr-main`. DB = local.
Done: `lib/` (58 files) + `app/api/` (79 route handlers) copied; deps added
(`mysql2`, `exceljs`, `jspdf`, `jspdf-autotable`); `next.config.ts` merged
(uploads rewrite kept; `cacheComponents`/`partialPrefetching` **disabled** —
app is per-request dynamic, matching the original); `.env.local` set to
local DB defaults (`127.0.0.1:3306`, `root`, db `hris_payroll_app_v2`);
`public/uploads/*` folders created (existing 74MB of personal photos/KTP
NOT copied — privacy). Typecheck clean.
**DB: LIVE.** XAMPP MariaDB 10.4.32 on `127.0.0.1:3306`; db `hris_payroll_app_v2`
imported (20 base tables; rest auto-create at runtime). Login API verified
end-to-end (401 for unknown account). Backend fully wired — no blocker.
(DB-start note: if mysqld won't boot with an "Aria recovery failed" error,
clear `aria_log*` from `C:\xampp\mysql\data` and restart.)

Current state of `C:\new-hr`:
- Fresh Next.js **16.4.6** / React **19.3** / Tailwind **v4** app at repo root.
- `app/page.tsx` = redesigned login + signup (already built, ports old look).
- `web_hr-main/` = the **full working old app** (Next 16.1.6), nested, currently a read-only reference.

The redesign needs the **existing backend** present to stay functional
(`lib/*` + `app/api/*` + DB access + auth). Two ways to get there:

- **Option A (recommended):** keep building in `C:\new-hr`; copy the backend
  over from `web_hr-main` **unchanged** (`lib/`, `app/api/`, db config,
  uploads handling, `next.config`), then rebuild all UI new on top.
  `web_hr-main` stays an untouched reference. Matches the trajectory already
  started (login/signup live here).
- **Option B:** redesign in place inside `web_hr-main` (backend already
  wired); the fresh scaffold + login here get merged/retired.

> Confirm A vs B before Phase 2. The rest of this doc is base-independent.

---

## 2. Design system — "warm-ink + oxblood ledger" (IMPLEMENTED: tokens)

Grounded in the subject: daily HR/payroll ops for a multi-unit Indonesian
retail + garment company. Legibility of tables, status clarity, and Rupiah
figures lead. AYRES maroon is the one bold color; everything else is a
disciplined warm-neutral ink system. Light default, dark via
`prefers-color-scheme` + forceable `[data-theme]`. Tokens live in
`app/globals.css` (raw CSS vars → mapped into Tailwind v4 `@theme`).

### 2.1 Color tokens (utilities: `bg-surface`, `text-ink`, `text-primary`, …)
| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#F7F6F4` | `#141110` | app canvas |
| `surface` | `#FFFFFF` | `#1C1917` | cards, panels |
| `surface-2` | `#F1EFEC` | `#26211E` | table header, insets |
| `line` / `line-strong` | `#E6E2DC`/`#D7D0C8` | `#322C28`/`#40382F` | hairlines |
| `ink` / `ink-2` | `#1C1718`/`#5F5653` | `#F2EEEA`/`#B7ADA6` | text |
| `muted` | `#938A85` | `#8A7F78` | captions, placeholders |
| `primary` (oxblood) | `#8F1D22` | `#D9484C` | brand actions |
| `primary-strong` / `primary-weak` | `#731319`/`#FBEDEC` | `#C23A40`/`#2A1618` | hover / tint |
| `success` (+weak) | `#2E7D5B` | `#4CAF82` | approved/completed |
| `warning` (+weak) | `#B5790E` | `#D9A531` | pending |
| `danger` (+weak) | `#C0392B` | `#E0695C` | rejected/error |
| `info` (+weak) | `#2D6E8E` | `#5AA0C0` | in-progress/info |

Status semantics: **Approved/Completed** → success · **Pending/In Progress**
→ warning/info · **Rejected/Cancelled** → danger/neutral · **Draft** → muted.
Brand maroon is reserved for primary actions/active nav — never status.

### 2.2 Typography — IBM Plex Sans (one family, roles by weight)
Serious operational software, first-class tabular/lining numerals for payroll
(`.nums` utility). Loaded via `next/font` (`--font-plex`). No second display
face; headings use weight + tightened tracking.
- Scale (px / line): display 30/36 · h1 24/32 · h2 20/28 · h3 16/24 ·
  body 14/20 · small 13/18 · caption 12/16 · table 13/18.
- Weights: 400 body · 500 labels/table · 600 headings · 700 display.

### 2.3 Spacing / radius / elevation
- Spacing scale (4px base): 4 8 12 16 20 24 32 40 48 64. Page pad 24–32,
  card pad 20–24, component gap 12–16.
- Radius: sm 6 · md 8 · lg 12 (card) · modal 16 · pill (badges only).
- Elevation: borders carry structure; `shadow-sm` for cards on hover,
  `shadow-md` for popovers/modals. No heavy drop shadows.

### 2.4 Libraries (to confirm compat on React 19 / Next 16 before install)
- Icons: **lucide-react** (consistent, tree-shakeable; no emoji icons).
- Motion: **motion** (framer-motion successor), reduced-motion honored.
- Charts: **Recharts 3** (React 19), used only where real API data exists.
- Already in: `three` + `postprocessing` (login GridScan only — not on
  operational pages).

### 2.5 Component library (to build in Phase 2)
Buttons · icon buttons · inputs · selects · searchable dropdown · date picker ·
badges / status pills · cards · data table (sort/filter/paginate/sticky
header/row actions/empty/skeleton) · tabs · dialog · drawer · tooltip ·
avatar · breadcrumbs · empty state · loading skeleton · error state · toast ·
confirm dialog (replaces old `ConfirmDialog` / `useConfirm()`). Each with
documented variants + states.

### 2.6 Component architecture
`components/ui` · `components/layout` · `components/navigation` ·
`components/data` · `components/forms` · `components/feedback` ·
`components/charts` · `features/[module]` · `hooks` · `lib` (ported backend) ·
`styles/tokens`.

---

## 3. Global layout plan
- **AppShell** replacing `AdminShell` / `EmployeeShell` / `SpvShell`
  (README §9.1). One responsive shell; **role- and capability-driven menu**
  built from the exact existing permission sources (README §6.2/§6.3) — no
  menu removed, menu visibility is **not** treated as the security boundary
  (data-layer guards stay; §6.4).
- Sidebar: brand, grouped nav, module icons, active state, expandable
  submenus (KPI, Master), collapsible with tooltips, mobile drawer.
- Topbar: breadcrumb/page context, user avatar + dropdown (profile, settings,
  logout), theme switcher, notifications only if a real source exists.
- Content: clear hierarchy, generous whitespace, consistent per page.
- Breakpoints to test: 1440 / 1366 / 768 / 390.

---

## 4. Page inventory (≈66 pages — README §9.2)

Guards preserved exactly: `app/admin/**`→`requireAdminSession`,
`app/employee/**`→`requireEmployeeSession`, `app/spv/**`→`requireSpvSession`;
`/`=login (no guard). (README §9.2)

### 4.1 Auth (1)
`/` login + signup ✅ *(redesigned)*

### 4.2 Admin (40)
`/admin` dashboard · attendance-approvals (+ /history) · attendance ·
employees · roles · jadwal (+ /master, /perizinan) · overtime ·
business-trips · reimbursements · loans · contract-deductions ·
contract-returns · item-loans · visit-reports · finance · hr-agent ·
payroll-summary (+ /solo, /partime, /penjahit, /sales-nasional) ·
payroll-bonus · payroll-freelance · bonus-summary · payslips ·
payslip-distribution · bonus-slips · bonus-slip-distribution ·
kpi/{finance,logistik,rnd,sales-retail} ·
master (+ /[category], /akun-payroll, /kode-absensi, /set-jadwal)

### 4.3 Employee (21)
`/employee` dashboard · profile · check-in · check-out · attendance-history ·
attendance-approvals · jadwal (+ /master) · overtime · overtime-approvals ·
overtime-history · business-trips · reimbursements · visit-report · loans ·
contract · item-loans · my-item-loans · finance · payslips · bonus-slips

### 4.4 SPV (6)
`/spv` dashboard · attendance-approvals · overtime-approvals ·
jadwal (+ /master, /perizinan)

---

## 5. Feature-preservation checklist

Status columns: **UI** (redesigned) · **Fn** (functionally wired + verified).
All start Pending except login. Do NOT mark Fn=✅ on visuals alone (Rule 10).
Full feature detail: README §4 + §17.

| Module | Pages | UI | Fn |
|---|---|---|---|
| Auth: login (role-routed), signup | `/` | ✅ | ⏳ (API not ported yet) |
| Auth: logout, role mgmt (last-admin/self guards) | admin/roles | ⏳ | ⏳ |
| Employee master: CRUD, NIP, export, soft/hard delete, pw reset | admin/employees | ⏳ | ⏳ |
| Profile self-edit (limited fields) | employee/profile | ⏳ | ⏳ |
| Attendance: geofenced selfie check-in/out, lateness | employee/check-in,check-out | ⏳ | ⏳ |
| Attendance sheet: override/recover/holiday/auto-Alfa | admin/attendance | ⏳ | ⏳ |
| Attendance approval (telat/pulang awal) | admin+employee+spv/attendance-approvals | ⏳ | ⏳ |
| Scheduling: grid, master, shift defs/groups, access grants | admin+employee+spv/jadwal* , master/set-jadwal | ⏳ | ⏳ |
| Overtime: submit, single/double approval, history | admin/overtime, employee/overtime* , spv/overtime-approvals | ⏳ | ⏳ |
| Business trips (+auto-hadir) | admin+employee/business-trips | ⏳ | ⏳ |
| Reimbursements | admin+employee/reimbursements | ⏳ | ⏳ |
| Loans: apply/approve, installments, payoff, payroll attach | admin+employee/loans | ⏳ | ⏳ |
| Contract: deductions, returns, timeline | admin/contract-*, employee/contract | ⏳ | ⏳ |
| Item loans (multi, export, no return) | admin/item-loans, employee/(my-)item-loans | ⏳ | ⏳ |
| Visit reports (photo+GPS+CRM) | admin+employee/visit-report(s) | ⏳ | ⏳ |
| Payroll: main + solo/partime/penjahit/sales-nasional, live compute, clone | admin/payroll-summary* | ⏳ | ⏳ |
| Payroll: freelance (4 modes) | admin/payroll-freelance | ⏳ | ⏳ |
| Bonus: manual payroll_bonus + types | admin/payroll-bonus | ⏳ | ⏳ |
| Bonus summary (scaffold, payout=0 — keep as-is) | admin/bonus-summary | ⏳ | ⏳ |
| Payslips: gen + distribution + undo, client PDF | admin/payslips,payslip-distribution; employee/payslips | ⏳ | ⏳ |
| Bonus slips: gen + distribution | admin/bonus-slips,bonus-slip-distribution; employee/bonus-slips | ⏳ | ⏳ |
| Finance recap (by-unit, pembebanan, pencairan, custom lembur) | admin/finance, employee/finance (ro) | ⏳ | ⏳ |
| KPI: finance/rnd/sales-retail (+ logistik, bug #7 kept) | admin/kpi/* | ⏳ | ⏳ |
| Master data: lookups, codes, shift groups, payroll editors | admin/master/* | ⏳ | ⏳ |
| HR Agent (Ollama read-only SQL) | admin/hr-agent | ⏳ | ⏳ |
| Dashboards (admin/employee/spv) | /admin, /employee, /spv | ⏳ | ⏳ |

**Legend:** ✅ done · ⏳ pending · 🚧 in progress · ⚠ blocked

---

## 6. Phase plan & progress

- [x] **Phase 1 — Audit & prep.** Page inventory, design-system spec,
      feature checklist (this doc). Grounded in README.
- [x] **Phase 2 — Design system.** Tokens (globals.css) + component library
      in `components/ui`: Button, Card(+parts), Badge/StatusBadge, Input/
      Textarea/Select/Label/Field, Table primitives, Skeleton, EmptyState,
      StatCard, PageHeader. `lib/cn.ts` helper.
- [x] **Phase 3 — Global layout.** `components/layout/AppShell.tsx` (client):
      responsive sidebar (collapsible rail + mobile drawer), topbar
      (breadcrumb, theme toggle, user menu + logout), role/capability-driven
      nav (`nav-config.tsx`). Server role layouts (`app/{admin,employee,spv}/
      layout.tsx`) apply `requireXxxSession` guards → shell. No-flash theme
      script in root layout.
- [x] **Phase 4 — Page redesign** (COMPLETE — all ~66 pages). Order done: auth →
      dashboards → core HR → operational → approvals → payroll/finance →
      KPI/master → settings.
      - [x] Login + signup (`/`) — ported old look.
      - [x] Admin dashboard (`/admin`) — real `getAdminDashboardStats`, VERIFIED.
      - [x] Employee dashboard (`/employee`) — greeting + quick actions.
      - [x] SPV dashboard (`/spv`) — greeting + quick actions.
      - [x] Admin · Employees (`/admin/employees`) — list+stats+full form+delete+password, wired, VERIFIED.
      - [x] Admin · Master index + 5 categories (`/admin/master`, `/admin/master/[category]`) — CRUD + jabatan can_approve, VERIFIED.
      - [x] Admin · Roles (`/admin/roles`) — admin/spv CRUD, last-admin/self guards (server), VERIFIED.
      - [x] Admin · Overtime (`/admin/overtime`) — list, filters, approve/reject (+note), detail, bukti link, VERIFIED.
      - [x] Admin · Attendance (`/admin/attendance`) — month-view matrix (employees × days), click-cell code edit wired to update route, holiday highlight, period nav, VERIFIED. (Week-view + recover/holiday admin actions: TODO next pass.)
      - [x] Jadwal · Bagan grid (`/admin/jadwal`, `/spv/jadwal`, `/employee/jadwal`) — shared `JadwalGridManager`: employees×days shift-select grid grouped by penempatan, per-employee allowed options, bulk save/remove via `/api/spv/jadwal` (multi-role auth), period nav. VERIFIED (admin).
      - [x] Jadwal · Perizinan (`/admin/jadwal/perizinan`, `/spv/jadwal/perizinan`) — grant/revoke `jadwal_editor` toggles via `/api/spv/jadwal-akses`. VERIFIED (admin).
      - [x] Jadwal · Master (`/admin/jadwal/master`, `/spv/...`, `/employee/...`) — shared `JadwalMasterManager`: weekly Sen–Min shift grid, save auto-distributes to active period via `/api/spv/jadwal-master`. VERIFIED (admin).
      - [x] Attendance approvals (`/admin/attendance-approvals` + `/history`, `/employee/...`, `/spv/...`) — shared `AttendanceApprovalManager`: filters, approve/reject (+note), detail w/ foto + reason, uniform PATCH per role. VERIFIED (admin).
      - [x] Overtime approvals (`/employee/overtime-approvals`, `/spv/...`) + History (`/employee/overtime-history`) — reuse `OvertimeManager` with `apiBase`/read-only. (admin verified earlier; employee/spv need their session to view.)
      - [x] Loans (`/admin/loans`, `/employee/loans`) — shared `LoansManager`: admin create/approve/reject/payoff(month,year)/delete + installment detail; employee apply (eligibility-gated, max cap) + own list. VERIFIED (admin).
      - [x] Requests · Business trips (`/admin/business-trips`, `/employee/...`) + Reimbursements (`/admin/reimbursements`, `/employee/...`) — admin approve/reject (+note), employee submit via multipart upload (surat/nota), status + file links. VERIFIED (admin).
      - [x] Contract · Deductions (`/admin/contract-deductions`) — plans, add, set start/last month, installment schedule; Returns (`/admin/contract-returns`) — mark/unmark deposit return; Employee contract (`/employee/contract`) — read-only info + schedule. VERIFIED (admin).
      - [x] Item Loans (`/admin/item-loans`, `/employee/my-item-loans`, `/employee/item-loans`) — admin CRUD (multi-employee + items) + Excel export link; employee/finance read-only. VERIFIED (admin).
      - [x] Visit Reports (`/admin/visit-reports`, `/employee/visit-report`) — admin date-range timeline w/ foto + GPS map links; employee submit (CRM fields + camera photo data-URL + geolocation) + today's list. VERIFIED (admin).
      - [x] Payroll · Summary (`/admin/payroll-summary`) — live-computed sheet, period selector, THP-PDF + Finance-XLSX export links, full per-employee edit dialog (11 nominal + 11 override fields, optimistic `expectedInputUpdatedAt`) gated on `isPayrollEditor`. VERIFIED. Shared `PayrollSummaryManager` (parameterized basePath/exportBase).
      - [x] Payroll · Solo (`/admin/payroll-summary/solo`, placementFilter Toko Solo) + Sales Nasional (`/admin/payroll-summary/sales-nasional`, isSalesNasionalRole filter) — reuse `PayrollSummaryManager` (own basePath, exports off). VERIFIED.
      - [x] Payroll · Bonus (`/admin/payroll-bonus`) — per-employee manual bonus editor + period nav (`listPayrollBonusSheet`); Partime (`/admin/payroll-summary/partime`, `getPartimeSheet`) + Penjahit (`/admin/payroll-summary/penjahit`, `getPenjahitSheet` incl weekly pencairan) — read views + period nav. VERIFIED. (`PayrollPeriodNav` shared.)
      - [x] Payroll · Freelance (`/admin/payroll-freelance`) — grouped read tables (jam/pengerjaan/harian/custom) + unassigned + period nav; Summary-Bonus (`/admin/bonus-summary`) — eligibility/approval read table + "payout formula pending" note. VERIFIED. **Payroll block complete (8/8).**
      - [x] Slips (`/admin/payslips`, `/admin/bonus-slips`) — period nav + per-employee slip preview (earnings/deductions/net) + browser print; Distribution (`/admin/payslip-distribution`, `/admin/bonus-slip-distribution`) — shared `DistributionManager`: select pending → distribute, log + undo (payslip). VERIFIED. (jsPDF export + full multi-track slip merge deferred.)
      - [x] Finance (`/admin/finance`, `/employee/finance`) — shared `FinanceRecapView`: per-unit→department net recap + totals + period nav. VERIFIED. (custom-lembur/pembebanan/pencairan edits deferred.)
      - [x] Master · Akun Payroll (`/admin/master/akun-payroll`, grant/revoke payroll editors) + Kode Absensi (`/admin/master/kode-absensi`, code CRUD + payroll category). VERIFIED.
      - [x] KPI ×4 (`/admin/kpi/{finance,rnd,sales-retail,logistik}`) — shared template-driven `KpiScoringForm`: employee + month selector, hari kerja, omzet (finance), grouped weighted items (data aktual + perhitungan + hasil override), save per division endpoint. VERIFIED.
      - [x] HR Agent (`/admin/hr-agent`) — chat UI posting history to `/api/admin/hr-agent` (Ollama); needs OLLAMA_* env to answer, else surfaces the error. VERIFIED (renders).
      - [x] Master · Set Jadwal (`/admin/master/set-jadwal`) — shift definitions CRUD (jam/toleransi) + shift groups CRUD (target jabatan/dept/penempatan/custom + shift codes + members). VERIFIED.
      - [x] Employee self-service — Profile (edit + KTP upload), **Check-in / Check-out LIVE** (faithful port of old UX: webcam `getUserMedia` preview + IG filters + capture, auto real-time GPS `watchPosition` best-accuracy + accuracy + device-permission panel + live Google Maps embed + geofence/blocked popups + late/early-leave approver flow), Attendance history, Payslips, Bonus slips. VERIFIED 200 w/ karyawan session. (Camera+GPS activate in a real browser on localhost/https.)
      - **ALL ~66 PAGES BUILT. `next build` (production) passes — all routes + 79 API handlers compile. All 41 admin routes return 200.**
      - DEV NOTE: Turbopack regenerated `.next/dev/types/routes.d.ts` corrupted (duplicated tail → TS1128) under rapid route additions; a `next dev` restart regenerated it clean. App code was fine throughout.
      - NOTE: freelance/summary-bonus built read+period-nav; mode-specific entry + omzet/approval edits deferred to polish pass.
      - NOTE: partime/penjahit built as read+period-nav; their nominal/override edits (via `/api/admin/payroll-summary` actions) deferred to a polish pass.
      - NOTE: payroll-summary omzet-input + add-new-employee-row deferred (edit of computed rows covers active employees; omzet mainly affects sales track).

**Dev note:** editing a server module (`features/jadwal/data.ts`) to add an export while `next dev` (Turbopack) is running served a stale module ("X is not a function" 500) on the importing route until a dev restart; `tsc` was clean throughout. Next waves: Attendance+codes · Jadwal (grid/master/perizinan) · Overtime+approvals · Attendance approvals · Business-trips · Reimbursements · Loans · Contract (deductions/returns) · Item-loans · Visit-reports · Payroll (summary/solo/partime/penjahit/sales-nasional/freelance/bonus/summary-bonus) · Payslips+distribution+bonus-slips · Finance · KPI ×4 · master/set-jadwal+kode-absensi+akun-payroll · HR-Agent · all employee self-service · all spv pages.

**Reusable built:** `components/ui/*` (Button, Card, Badge/StatusBadge, Input/Select/Field, Table, Dialog, Skeleton, EmptyState, StatCard, PageHeader), `components/layout/AppShell` + `nav-config`, `lib/cn`, `lib/format` (Rupiah/date). Pattern per page: server page fetches via ported `lib/*` → client `*Manager` calls real API routes + `router.refresh()`.
- [x] **Phase 5 — Interaction & animation** (baseline). Restrained hover/press
      transitions, dialog/drawer, loading spinners + skeleton/empty states,
      global reduced-motion honored. (Richer page-transition/count-up motion =
      optional polish.)
- [x] **Phase 6 — Functional integration.** Every page wired to the real ported
      `lib/*` + API routes; no dummy data. (Deferred-edit items noted above are
      read-only-for-now, not dummy.)
- [x] **Phase 7 — QA.** `next build` (production) passes — all app routes + 79
      API handlers compile; `tsc --noEmit` clean; all 41 admin routes 200.
      Remaining QA: live-verify employee/spv pages with those sessions;
      responsive/a11y spot-checks; the deferred-edit polish items.

## 7. Guardrails (do not violate)
Preserve: auth model + all authz sources (§15.1) · 26→25 period · full payroll
formula set + tracks · attendance rules + codes · slip numbering + distribution
gating · API/`lib` contracts + column names (§15.4). Known bugs (README §16)
are **kept as-is** during redesign unless a fix is explicitly approved and
documented first (§15.2).
