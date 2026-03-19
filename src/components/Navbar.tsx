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
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-white/5 bg-[#050510]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 opacity-80 transition group-hover:opacity-100" />
            <span className="relative text-sm font-bold text-white">CG</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            ClawGeeks
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 sm:flex">
          <a
            href="#pricing"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Pricing
          </a>
          <a
            href="#features"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Features
          </a>
          <div className="mx-2 h-5 w-px bg-white/10" />
          <a
            href="#"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Sign In
          </a>
          <a
            href="#pricing"
            className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/5 hover:text-white sm:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 sm:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Pricing
              </a>
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Features
              </a>
              <a
                href="#"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Sign In
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-xl bg-violet-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
