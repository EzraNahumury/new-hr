"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  getNav,
  ROLE_HOME,
  ROLE_LABEL,
  type EmployeeCaps,
  type NavGroup,
  type Role,
} from "./nav-config";

type Props = {
  role: Role;
  user: { name: string; email: string };
  caps?: EmployeeCaps;
  children: React.ReactNode;
};

function useBestMatch(groups: NavGroup[], pathname: string) {
  return useMemo(() => {
    let best = "";
    for (const g of groups) {
      for (const it of g.items) {
        if (pathname === it.href || pathname.startsWith(it.href + "/")) {
          if (it.href.length > best.length) best = it.href;
        }
      }
    }
    return best;
  }, [groups, pathname]);
}

export default function AppShell({ role, user, caps, children }: Props) {
  const pathname = usePathname() || ROLE_HOME[role];
  const router = useRouter();
  const groups = useMemo(() => getNav(role, caps), [role, caps]);
  const activeHref = useBestMatch(groups, pathname);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement | null>(null);

  // hydrate persisted prefs
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("hr_sidebar_collapsed") === "1");
      const t = document.documentElement.getAttribute("data-theme");
      setDark(
        t === "dark" ||
          (!t && window.matchMedia("(prefers-color-scheme: dark)").matches),
      );
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  // close user menu on outside click
  useEffect(() => {
    if (!userOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [userOpen]);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("hr_sidebar_collapsed", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function toggleTheme() {
    setDark((d) => {
      const next = !d;
      try {
        document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
        localStorage.setItem("hr_theme", next ? "dark" : "light");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.push("/");
    router.refresh();
  }

  const crumb = useMemo(() => {
    for (const g of groups)
      for (const it of g.items) if (it.href === activeHref) return it.label;
    return "Dashboard";
  }, [groups, activeHref]);

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebar = (
    <Sidebar
      groups={groups}
      activeHref={activeHref}
      role={role}
      collapsed={collapsed}
    />
  );

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-surface lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <Brand collapsed={collapsed} />
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">{sidebar}</div>
        <button
          type="button"
          onClick={toggleCollapsed}
          className="flex items-center gap-2 border-t border-line px-4 py-3 text-[13px] text-ink-2 hover:text-ink"
          title={collapsed ? "Perlebar sidebar" : "Perkecil sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" /> Perkecil
            </>
          )}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-surface">
            <div className="flex items-center justify-between pr-2">
              <Brand collapsed={false} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-ink-2 hover:bg-surface-2 hover:text-ink"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
              <Sidebar
                groups={groups}
                activeHref={activeHref}
                role={role}
                collapsed={false}
              />
            </div>
          </aside>
        </div>
      ) : null}

      {/* Main column */}
      <div className={cn(collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-ink-2 hover:bg-surface-2 hover:text-ink lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="flex min-w-0 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <span className="text-ink-2">{ROLE_LABEL[role]}</span>
            <ChevronRight className="h-4 w-4 flex-none text-muted" />
            <span className="truncate font-medium text-ink">{crumb}</span>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-md p-2 text-ink-2 hover:bg-surface-2 hover:text-ink"
              aria-label="Ganti tema terang/gelap"
              title="Tema terang/gelap"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md py-1.5 pl-1.5 pr-2 hover:bg-surface-2"
                aria-haspopup="menu"
                aria-expanded={userOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-weak text-[13px] font-semibold text-primary">
                  {initials}
                </span>
                <span className="hidden max-w-[160px] truncate text-sm font-medium text-ink sm:block">
                  {user.name || user.email}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-ink-2 sm:block" />
              </button>

              {userOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-lg border border-line bg-surface shadow-md"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-medium text-ink">
                      {user.name || "—"}
                    </p>
                    <p className="truncate text-[13px] text-ink-2">{user.email}</p>
                  </div>
                  {role === "employee" ? (
                    <Link
                      href="/employee/profile"
                      className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-2"
                      role="menuitem"
                    >
                      Profil Pribadi
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-danger hover:bg-danger-weak"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" /> Keluar
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-16 flex-none items-center gap-2.5 border-b border-line px-4">
      <span className="flex h-8 w-8 flex-none items-center justify-center overflow-hidden rounded-lg bg-[#161010]">
        <Image
          src="/logo/new logo.png"
          alt="AYRES"
          width={64}
          height={20}
          className="h-auto w-6"
        />
      </span>
      {!collapsed ? (
        <span className="text-[15px] font-semibold tracking-tight text-ink">
          AYRES <span className="text-primary">HR</span>
        </span>
      ) : null}
    </div>
  );
}

function Sidebar({
  groups,
  activeHref,
  role,
  collapsed,
}: {
  groups: NavGroup[];
  activeHref: string;
  role: Role;
  collapsed: boolean;
}) {
  return (
    <nav className="space-y-5 pt-4" aria-label="Menu utama">
      {groups.map((g, i) => (
        <NavGroupView
          key={g.label ?? `g${i}`}
          group={g}
          activeHref={activeHref}
          role={role}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}

function NavGroupView({
  group,
  activeHref,
  role,
  collapsed,
}: {
  group: NavGroup;
  activeHref: string;
  role: Role;
  collapsed: boolean;
}) {
  const hasActive = group.items.some((it) => it.href === activeHref);
  const [open, setOpen] = useState(true);
  const effectiveOpen = group.collapsible ? open || hasActive : true;

  return (
    <div>
      {group.label && !collapsed ? (
        group.collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between px-3 pb-1.5 text-xs font-medium text-muted hover:text-ink-2"
          >
            {group.label}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                effectiveOpen ? "" : "-rotate-90",
              )}
            />
          </button>
        ) : (
          <p className="px-3 pb-1.5 text-xs font-medium text-muted">{group.label}</p>
        )
      ) : null}

      {effectiveOpen ? (
        <ul className="space-y-0.5">
          {group.items.map((it) => {
            const active = it.href === activeHref;
            const Icon = it.icon;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  title={collapsed ? it.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-primary-weak font-medium text-primary"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  {active ? (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-primary" />
                  ) : null}
                  <Icon className="h-[18px] w-[18px] flex-none" />
                  {!collapsed ? <span className="truncate">{it.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
