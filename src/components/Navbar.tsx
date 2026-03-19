"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "border-b border-[var(--border)] bg-[var(--void)]/90 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
        {/* Logo */}
        <a href="/" className="group flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-110" />
            <span className="relative font-[var(--font-mono)] text-[11px] font-bold tracking-wider text-white">
              CG
            </span>
          </div>
          <span
            className="text-[15px] font-semibold tracking-tight text-[var(--text)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            ClawGeeks
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {[
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text)]"
            >
              {link.label}
            </a>
          ))}

          <div className="mx-3 h-4 w-px bg-[var(--border)]" />

          <a
            href="#"
            className="rounded-lg px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text)]"
          >
            Sign In
          </a>

          <a
            href="#pricing"
            className="ml-1 rounded-lg bg-[var(--accent)] px-5 py-2 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-[var(--accent-glow)]"
          >
            Launch Agent
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-white sm:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[var(--border)] sm:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Sign In", href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-[14px] font-medium text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-lg bg-[var(--accent)] px-5 py-3 text-center text-[14px] font-semibold text-white"
              >
                Launch Agent
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
