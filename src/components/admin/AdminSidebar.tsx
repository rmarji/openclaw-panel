"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Fleet", icon: "\u25C9" },
  { href: "/admin/servers", label: "Servers", icon: "\u2B21" },
  { href: "/admin/analytics", label: "Analytics", icon: "\u25C8" },
  { href: "/admin/users", label: "Users", icon: "\u25CE" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav className="admin-sidebar w-56 min-h-screen flex flex-col py-8 px-4 fixed left-0 top-0 z-40">
      <div className="mb-12 px-4">
        <h1 className="text-lg font-semibold tracking-tight text-white/90">
          Claw<span className="text-violet-400">Ops</span>
        </h1>
        <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">Mission Control</p>
      </div>
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`admin-nav-item flex items-center gap-3 text-sm ${isActive ? "active text-white font-medium" : "text-white/40 hover:text-white/70"}`}>
              <span className="text-base opacity-60">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto px-4 pt-8 border-t border-white/5">
        <Link href="/api/admin/logout" className="text-xs text-white/20 hover:text-white/50 transition-colors" onClick={(e) => { e.preventDefault(); fetch("/api/admin/logout", { method: "POST" }).then(() => window.location.href = "/admin/login"); }}>
          Sign out
        </Link>
      </div>
    </nav>
  );
}
