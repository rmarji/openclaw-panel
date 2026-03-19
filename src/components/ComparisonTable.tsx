"use client";

import { motion } from "framer-motion";

const rows = [
  { feature: "AI Agent Instances", starter: "1", pro: "3", team: "10" },
  { feature: "Messages / month", starter: "5,000", pro: "25,000", team: "Unlimited" },
  { feature: "Telegram", starter: true, pro: true, team: true },
  { feature: "Slack", starter: false, pro: true, team: true },
  { feature: "Web Chat Widget", starter: false, pro: true, team: true },
  { feature: "Standard Models (Haiku, Sonnet)", starter: true, pro: true, team: true },
  { feature: "Advanced Models (Opus)", starter: false, pro: true, team: true },
  { feature: "Smart Model Routing", starter: false, pro: true, team: true },
  { feature: "Gmail Integration", starter: false, pro: true, team: true },
  { feature: "GitHub Integration", starter: false, pro: true, team: true },
  { feature: "Notion Integration", starter: false, pro: true, team: true },
  { feature: "Custom Tool Integrations", starter: false, pro: false, team: true },
  { feature: "Custom Agent Personas", starter: false, pro: false, team: true },
  { feature: "Langfuse Observability", starter: false, pro: false, team: true },
  { feature: "Dedicated Resources", starter: false, pro: false, team: true },
  { feature: "Support", starter: "Email", pro: "Priority", team: "Slack Channel" },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <svg className="mx-auto h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ) : (
      <span className="mx-auto block h-0.5 w-4 rounded bg-zinc-700" />
    );
  }
  return <span className="text-sm text-zinc-300">{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Compare plans
          </h2>
          <p className="mt-3 text-lg text-zinc-400">
            See exactly what you get at each tier
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass mt-12 overflow-hidden rounded-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    Starter
                  </th>
                  <th className="relative px-6 py-4 text-center text-sm font-semibold text-white">
                    <span className="relative z-10">Pro</span>
                    <div className="absolute inset-x-0 top-0 h-full bg-violet-500/5" />
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-white/[0.03] transition hover:bg-white/[0.02] ${
                      i === rows.length - 1 ? "border-none" : ""
                    }`}
                  >
                    <td className="px-6 py-3.5 text-sm text-zinc-400">
                      {row.feature}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <Cell value={row.starter} />
                    </td>
                    <td className="relative px-6 py-3.5 text-center">
                      <div className="relative z-10">
                        <Cell value={row.pro} />
                      </div>
                      <div className="absolute inset-x-0 top-0 h-full bg-violet-500/5" />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <Cell value={row.team} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
