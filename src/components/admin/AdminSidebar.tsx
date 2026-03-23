"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/admin", label: "Fleet", icon: "fleet" },
  { href: "/admin/servers", label: "Servers", icon: "servers" },
  { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
  { href: "/admin/users", label: "Users", icon: "users" },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const cls = `w-4 h-4 ${active ? "text-admin-primary" : "text-admin-tertiary group-hover:text-admin-secondary"}`;
  switch (type) {
    case "fleet":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="6" height="6" rx="1.5" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" />
        </svg>
      );
    case "servers":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="12" height="5" rx="1" />
          <rect x="2" y="9" width="12" height="5" rx="1" />
          <circle cx="5" cy="4.5" r="0.5" fill="currentColor" />
          <circle cx="5" cy="11.5" r="0.5" fill="currentColor" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 14L5.5 8.5L9 10.5L14 4" />
          <path d="M11 4H14V7" />
        </svg>
      );
    case "users":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="5.5" r="3" />
          <path d="M2.5 14.5C2.5 11 5 9 8 9C11 9 13.5 11 13.5 14.5" />
        </svg>
      );
    default:
      return null;
  }
}

interface Props {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  return (
    <nav className={`admin-sidebar w-56 min-h-screen flex flex-col py-6 px-3 fixed left-0 top-0 z-50 transition-transform duration-200 ${
      open ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0`}>
      <div className="mb-8 px-3">
        <h1 className="text-sm font-semibold text-admin-primary tracking-tight">
          ClawOps
        </h1>
      </div>

      <div className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors duration-100 ${
                isActive
                  ? "admin-nav-active text-admin-primary font-medium"
                  : "text-admin-secondary hover:text-admin-primary hover:bg-admin-surface-raised"
              }`}
            >
              <NavIcon type={item.icon} active={isActive} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-3 pt-6 border-t border-admin-border space-y-2">
        <ThemeToggle />
        <Link
          href="/api/admin/logout"
          className="block text-[12px] text-admin-tertiary hover:text-admin-secondary transition-colors"
          onClick={(e) => {
            e.preventDefault();
            fetch("/api/admin/logout", { method: "POST" }).then(() => window.location.href = "/login");
          }}
        >
          Sign out
        </Link>
      </div>
    </nav>
  );
}
