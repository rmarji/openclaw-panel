"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Pick your agent",
    description: "Choose a plan, name your agent, and give it a personality. PM bot, DevOps assistant, personal VA  - you decide.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    ),
  },
  {
    number: "2",
    title: "Connect your tools",
    description: "One-click OAuth for Gmail, Slack, GitHub, Calendar, Notion. Your credentials, your agent  - no shared accounts.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    ),
  },
  {
    number: "3",
    title: "It starts working",
    description: "Your agent goes live on Telegram or Slack within minutes. It handles the busywork. You get your time back.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <span className="label-mono">How it works</span>
          <h2 className="heading-section mt-4">
            Live in 5 minutes
            <span className="text-[var(--accent)]">.</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center"
            >
              {/* Connector line (between steps on desktop) */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-8 translate-x-full bg-[var(--border)] sm:block" />
              )}

              {/* Icon circle */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <svg className="h-7 w-7 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  {step.icon}
                </svg>
              </div>

              {/* Step number */}
              <span
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--accent)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Step {step.number}
              </span>

              {/* Title */}
              <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
