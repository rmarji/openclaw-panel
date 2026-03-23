"use client";

import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
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
          <span className="label-mono">One last thing</span>

          {/* DR close: urgency + loss aversion + simple next step */}
          <h2 className="heading-section mt-4">
            Every hour you wait is an<br />
            <span className="italic">hour you can&apos;t get back</span>
            <span className="text-[var(--accent)]">.</span>
          </h2>

          <p className="body-large mx-auto mt-6 max-w-lg">
            Your competitors are already automating the busywork.
            Set up your first agent in 5 minutes, see the difference by lunch,
            and wonder why you didn&apos;t do this months ago.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#pricing" className="btn-primary">
              <span>Pick your plan</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a href="mailto:hello@clawgeeks.com" className="btn-secondary">
              Questions? Talk to a human
            </a>
          </div>

          {/* Risk reversal — Gary Halbert's favorite move */}
          <div className="mx-auto mt-10 max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text)]">Zero-risk guarantee:</span>{" "}
              No credit card to start. No contracts. No &quot;call us to cancel&quot; runaround.
              If it doesn&apos;t save you time in the first week, just leave. We&apos;ll even help you export your data.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
