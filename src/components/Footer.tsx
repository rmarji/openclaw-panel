export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]">
              <span
                className="text-[9px] font-bold tracking-wider text-white"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                CG
              </span>
            </div>
            <span
              className="text-[13px] font-medium text-[var(--text-tertiary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              ClawGeeks
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Status", href: "/status" },
              { label: "Contact", href: "mailto:hello@clawgeeks.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-secondary)]"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-[12px] text-[var(--text-tertiary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            &copy; {new Date().getFullYear()} ClawGeeks
          </p>
        </div>
      </div>
    </footer>
  );
}
