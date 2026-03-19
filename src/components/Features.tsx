"use client";

import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Smart Model Routing",
    description:
      "Manifest scores each query across 23 dimensions and picks the optimal model tier. Simple questions get fast, cheap answers. Complex reasoning gets the big guns. You save 60% on costs without lifting a finger.",
    detail: "23 dimensions \u00b7 4 tiers \u00b7 <2ms scoring",
  },
  {
    number: "02",
    title: "Tool Integrations",
    description:
      "Gmail, GitHub, Notion, Google Calendar, Slack, Linear \u2014 your agent connects to the tools your team already uses. Per-user OAuth means each person\u2019s agent acts with their own credentials.",
    detail: "Per-user OAuth \u00b7 10+ integrations \u00b7 self-serve connect",
  },
  {
    number: "03",
    title: "Full Observability",
    description:
      "Every token, every trace, every dollar. Langfuse captures the complete picture \u2014 latency, cost, model usage, conversation quality, and LLM-as-judge evaluations. Know exactly what your agents are doing.",
    detail: "Langfuse traces \u00b7 LLM-as-judge \u00b7 real-time dashboard",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="label-mono">Capabilities</span>
          <h2 className="heading-section mt-4">
            Built for teams that<br />
            <span className="italic">ship fast</span>
            <span className="text-[var(--accent)]">.</span>
          </h2>
        </motion.div>

        {/* Feature grid: first card full width, then 2 columns */}
        <div className="grid gap-6 lg:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`feature-card ${i === 0 ? "lg:col-span-2" : ""}`}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                {/* Large number */}
                <div className="feature-number shrink-0">{feature.number}</div>

                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-semibold text-[var(--text)]">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {feature.description}
                  </p>
                  <span
                    className="text-[11px] tracking-wider text-[var(--text-tertiary)]"
                    style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
                  >
                    {feature.detail}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional capabilities row */}
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              ),
              title: "Multi-Channel",
              desc: "Telegram, Slack, and web \u2014 agents meet users where they are.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              ),
              title: "Isolated & Secure",
              desc: "Each agent runs in its own Docker container with dedicated resources.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              ),
              title: "Custom Personas",
              desc: "Give each agent a unique personality, knowledge base, and tool set.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--border-bright)] hover:bg-[var(--surface-raised)]"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  {item.icon}
                </svg>
              </div>
              <h3 className="mb-1.5 text-[14px] font-semibold text-[var(--text)]">{item.title}</h3>
              <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
