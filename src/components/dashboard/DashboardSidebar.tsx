"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/billing", label: "Billing", icon: "billing" },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const cls = `w-4 h-4 ${active ? "text-foreground" : "text-text-tertiary group-hover:text-text-secondary"}`;
  switch (type) {
    case "overview":
      return (
        <svg
          className={cls}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="1" y="1" width="6" height="6" rx="1.5" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" />
        </svg>
      );
    case "billing":
      return (
        <svg
          className={cls}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="1" y="3" width="14" height="10" rx="2" />
          <path d="M1 7h14" />
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

export function DashboardSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <nav
      className={`w-56 min-h-screen flex flex-col py-6 px-3 fixed left-0 top-0 z-50 transition-transform duration-200 bg-void border-r border-border ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="mb-8 px-3">
        <Link href="/" className="text-sm font-semibold text-foreground tracking-tight">
          ClawGeeks
        </Link>
        <p className="text-[10px] text-text-tertiary mt-0.5 font-mono uppercase tracking-widest">
          Dashboard
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors duration-100 ${
                isActive
                  ? "bg-surface-raised text-foreground font-medium border border-border"
                  : "text-text-secondary hover:text-foreground hover:bg-surface-raised"
              }`}
            >
              <NavIcon type={item.icon} active={isActive} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-3 pt-6 border-t border-border space-y-2">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="block text-[12px] text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
