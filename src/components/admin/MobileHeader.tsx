"use client";

interface Props {
  onToggleSidebar: () => void;
}

export function MobileHeader({ onToggleSidebar }: Props) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-admin-bg border-b border-admin-border">
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-lg text-admin-secondary hover:text-admin-primary hover:bg-admin-surface transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
      <h1 className="text-sm font-bold text-admin-primary tracking-tight">
        Claw<span className="text-admin-accent">Ops</span>
      </h1>
      <div className="w-8" />
    </div>
  );
}
