"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Fleet", icon: "fleet" },
  { href: "/admin/servers", label: "Servers", icon: "servers" },
  { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
  { href: "/admin/users", label: "Users", icon: "users" },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const cls = `w-[18px] h-[18px] transition-colors duration-200 ${active ? "text-violet-400" : "text-white/30 group-hover:text-white/50"}`;
  switch (type) {
    case "fleet":
      return (
        <svg className={cls} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="1" width="7" height="7" rx="2" />
          <rect x="10" y="1" width="7" height="7" rx="2" />
          <rect x="1" y="10" width="7" height="7" rx="2" />
          <rect x="10" y="10" width="7" height="7" rx="2" />
        </svg>
      );
    case "servers":
      return (
        <svg className={cls} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="14" height="5" rx="1.5" />
          <rect x="2" y="11" width="14" height="5" rx="1.5" />
          <circle cx="5" cy="4.5" r="0.75" fill="currentColor" />
          <circle cx="5" cy="13.5" r="0.75" fill="currentColor" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={cls} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 16L6 10L10 12L16 4" />
          <path d="M12 4H16V8" />
        </svg>
      );
    case "users":
      return (
        <svg className={cls} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="6" r="3.5" />
          <path d="M2.5 16C2.5 12.5 5.5 10 9 10C12.5 10 15.5 12.5 15.5 16" />
        </svg>
      );
    default:
      return null;
  }
}

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav className="admin-sidebar w-64 min-h-screen flex flex-col py-8 px-5 fixed left-0 top-0 z-40">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600/0 via-violet-500/60 to-blue-500/0" />

      <div className="mb-14 px-4 pt-2">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Claw<span className="text-violet-400 admin-brand-glow">Ops</span>
        </h1>
        <p className="text-[10px] text-white/25 mt-1.5 tracking-[0.2em] uppercase font-medium">
          Mission Control
        </p>
      </div>

      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group admin-nav-item flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "admin-nav-active text-white font-semibold"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
              }`}
            >
              <NavIcon type={item.icon} active={isActive} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-4 pt-8 border-t border-white/[0.04]">
        <Link
          href="/api/admin/logout"
          className="text-xs text-white/20 hover:text-white/50 transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            fetch("/api/admin/logout", { method: "POST" }).then(() => window.location.href = "/admin/login");
          }}
        >
          Sign out
        </Link>
      </div>
    </nav>
  );
}
