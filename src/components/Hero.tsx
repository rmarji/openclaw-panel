"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const agents = [
  { name: "Rayo", activity: "Reviewing 3 pull requests", service: "GitHub", time: "2m ago", color: "#34d399" },
  { name: "Eddie", activity: "Drafting Q1 budget summary", service: "Notion", time: "Just now", color: "#34d399" },
  { name: "Alana", activity: "Responding in #general", service: "Slack", time: "5m ago", color: "#34d399" },
  { name: "Lina", activity: "Scheduled \u00b7 starts at 9am", service: "Telegram", time: "Paused", color: "#6b7280" },
];

const activities = [
  ["Reviewing 3 pull requests", "Merging feature branch", "Commenting on issue #47"],
  ["Drafting Q1 budget summary", "Updating project timeline", "Summarizing meeting notes"],
  ["Responding in #general", "Triaging support tickets", "Posting daily standup"],
];

function AgentRow({ agent, index }: { agent: typeof agents[0]; index: number }) {
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    if (index >= activities.length) return;
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % activities[index].length);
    }, 3000 + index * 1200);
    return () => clearInterval(interval);
  }, [index]);

  const currentActivity = index < activities.length ? activities[index][activityIndex] : agent.activity;

  return (
    <motion.div variants={fadeUp} className="agent-row group">
      <div className="relative mr-4 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
        {agent.color !== "#6b7280" && (
          <span
            className="absolute inset-0 rounded-full opacity-40"
            style={{ background: agent.color, animation: "status-pulse 2.5s ease-in-out infinite" }}
          />
        )}
        <span className="relative h-2 w-2 rounded-full" style={{ background: agent.color }} />
      </div>
      <span className="w-16 shrink-0 text-[13px] font-semibold text-[var(--text)] sm:w-20">{agent.name}</span>
      <span key={currentActivity} className="flex-1 truncate text-[13px] text-[var(--text-secondary)] transition-all duration-500">
        {currentActivity}
      </span>
      <span className="ml-3 hidden shrink-0 rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] tracking-wide text-[var(--text-tertiary)] sm:inline-block" style={{ fontFamily: "var(--font-mono)" }}>
        {agent.service}
      </span>
      <span className="ml-3 shrink-0 text-[12px] text-[var(--text-tertiary)]" style={{ fontFamily: "var(--font-mono)" }}>
        {agent.time}
      </span>
    </motion.div>
  );
}

const integrations = [
  { name: "Telegram", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
  )},
  { name: "Slack", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
  )},
  { name: "Gmail", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
  )},
  { name: "GitHub", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  )},
  { name: "Calendar", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>
  )},
  { name: "Notion", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.166V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.046-.747.326-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.513.28-.886.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.046-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>
  )},
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-32 sm:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[300px] left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.03] blur-[120px]" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="mb-10 flex justify-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" style={{ animation: "status-pulse 2s ease-in-out infinite" }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[12px] font-medium text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
              Founding member pricing — limited spots
            </span>
          </span>
        </motion.div>

        {/* Headline — DR: Lead with the outcome, not the feature */}
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="heading-hero mx-auto max-w-4xl">
            Stop doing work<br />
            <span className="italic">your AI should handle</span>
            <span className="text-[var(--accent)]">.</span>
          </h1>
        </motion.div>

        {/* Subhead — Specificity sells. Exact numbers, concrete outcomes. */}
        <motion.p
          variants={fadeUp}
          className="body-large mx-auto mt-8 max-w-2xl text-center"
        >
          Our founding teams cut <span className="text-[var(--text)]">6+ hours of weekly busywork</span> with
          AI agents that read their email, manage their calendar, triage Slack,
          review PRs, and never take a day off.
          <span className="text-[var(--text)]"> Starting at $29/mo.</span>
        </motion.p>

        {/* CTAs — DR: Primary CTA = action, Secondary = reduce risk */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a href="#pricing" className="btn-primary">
            <span>Deploy your first agent</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <a href="#demo" className="btn-secondary">
            <span>See a live demo</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
            </svg>
          </a>
        </motion.div>

        {/* Risk reversal — right under the CTA */}
        <motion.p
          variants={fadeUp}
          className="mt-4 text-center text-[12px] text-[var(--text-tertiary)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          No credit card required &middot; Cancel anytime &middot; 5 minute setup
        </motion.p>

        {/* Integration strip — brand trust through association */}
        <motion.div variants={fadeUp} className="mt-14 flex flex-col items-center gap-4">
          <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-tertiary)]" style={{ fontFamily: "var(--font-mono)" }}>
            Connects to the tools you already use
          </span>
          <div className="flex items-center gap-8 opacity-40">
            {integrations.map((int) => (
              <div key={int.name} className="text-[var(--text-secondary)] transition-opacity hover:opacity-100" title={int.name}>
                {int.icon}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Agent Roster Panel — "Show, don't tell" */}
        <motion.div variants={fadeUp} className="mx-auto mt-14 max-w-2xl">
          <div className="agent-panel">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
              <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--text-tertiary)]" style={{ fontFamily: "var(--font-mono)" }}>
                Live agent roster
              </span>
              <span className="text-[11px] text-emerald-400/80" style={{ fontFamily: "var(--font-mono)" }}>
                3 of 4 working
              </span>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="show">
              {agents.map((agent, i) => (
                <AgentRow key={agent.name} agent={agent} index={i} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
