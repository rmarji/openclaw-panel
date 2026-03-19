"use client";

import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[400px] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <span className="label-mono">Get Started</span>

          <h2 className="heading-section mt-4">
            Ready to deploy<br />
            <span className="italic">your team</span>
            <span className="text-[var(--accent)]">?</span>
          </h2>

          <p className="body-large mx-auto mt-6 max-w-md">
            Set up your first AI agent in under 5 minutes.
            No credit card required to start.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#pricing" className="btn-primary">
              <span>View plans</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a href="#" className="btn-secondary">
              Talk to us
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-6">
            {[
              "SOC 2 compliant",
              "Isolated containers",
              "Your keys, your data",
            ].map((badge) => (
              <span
                key={badge}
                className="hidden text-[11px] text-[var(--text-tertiary)] sm:inline-flex sm:items-center sm:gap-1.5"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}
              >
                <svg className="h-3 w-3 text-emerald-500/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
