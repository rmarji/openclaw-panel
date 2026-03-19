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
    <motion.div
      variants={fadeUp}
      className="agent-row group"
    >
      {/* Status dot */}
      <div className="relative mr-4 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
        {agent.color !== "#6b7280" && (
          <span
            className="absolute inset-0 rounded-full opacity-40"
            style={{ background: agent.color, animation: "status-pulse 2.5s ease-in-out infinite" }}
          />
        )}
        <span
          className="relative h-2 w-2 rounded-full"
          style={{ background: agent.color }}
        />
      </div>

      {/* Name */}
      <span className="w-16 shrink-0 text-[13px] font-semibold text-[var(--text)] sm:w-20">
        {agent.name}
      </span>

      {/* Activity */}
      <span
        key={currentActivity}
        className="flex-1 truncate text-[13px] text-[var(--text-secondary)] transition-all duration-500"
      >
        {currentActivity}
      </span>

      {/* Service badge */}
      <span
        className="ml-3 hidden shrink-0 rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] tracking-wide text-[var(--text-tertiary)] sm:inline-block"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {agent.service}
      </span>

      {/* Time */}
      <span
        className="ml-3 shrink-0 text-[12px] text-[var(--text-tertiary)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {agent.time}
      </span>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-32 sm:pt-24">
      {/* Subtle radial glow behind hero */}
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
          <span
            className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" style={{ animation: "status-pulse 2s ease-in-out infinite" }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[12px] font-medium text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
              8 agents online now
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="heading-hero mx-auto max-w-4xl">
            Your AI agents
            <span className="text-[var(--accent)]">.</span>
            <br />
            <span className="italic">Always working</span>
            <span className="text-[var(--accent)]">.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="body-large mx-auto mt-8 max-w-xl text-center"
        >
          Deploy agents that connect to Telegram, Slack, Gmail, and GitHub.
          Smart routing picks the right model for every task. Zero DevOps.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a href="#pricing" className="btn-primary">
            <span>Launch your first agent</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <a href="#demo" className="btn-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            <span>See it in action</span>
          </a>
        </motion.div>

        {/* Agent Roster Panel */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-16 max-w-2xl"
        >
          <div className="agent-panel">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
              <span
                className="text-[11px] font-medium tracking-widest text-[var(--text-tertiary)] uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Agent Roster
              </span>
              <span
                className="text-[11px] text-[var(--text-tertiary)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                3 of 4 online
              </span>
            </div>

            {/* Agent rows */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
            >
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
