"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Message {
  type: "user" | "agent" | "system";
  content: string;
  delay: number;
}

interface Scenario {
  id: string;
  label: string;
  botName: string;
  headline: string;
  subhead: string;
  stats: { stat: string; desc: string }[];
  messages: Message[];
}

const scenarios: Scenario[] = [
  {
    id: "leads",
    label: "Lead follow-up",
    botName: "Closer",
    headline: "Your agent closes deals\nwhile you sleep.",
    subhead:
      "Leads go cold while you're stuck in admin work. Your agent follows up, qualifies, and books calls - all from one message.",
    stats: [
      { stat: "2x faster", desc: "lead response time" },
      { stat: "3 deals", desc: "sourced from auto follow-ups last month" },
      { stat: "$0 dropped", desc: "revenue from missed follow-ups" },
    ],
    messages: [
      { type: "user", content: "Any new leads from the website today?", delay: 0 },
      { type: "system", content: "Checking Gmail + CRM...", delay: 800 },
      {
        type: "agent",
        content:
          "3 new inbound leads today:\n\n1. Jake from FlowStack - downloaded the pricing PDF, visited 4 pages\n2. Sarah at Onyx Media - filled out the demo form 2 hrs ago\n3. Mike R. - replied to your cold email from last week, says \"interested, send me more info\"\n\nSarah is the hottest - demo form + she's VP of Ops at a 40-person agency. Want me to send her a calendar link?",
        delay: 2200,
      },
      { type: "user", content: "Yes, send Sarah my calendar link and draft a personal reply to Mike", delay: 4000 },
      { type: "system", content: "Sending emails...", delay: 4600 },
      {
        type: "agent",
        content: "Done. Sarah got your Calendly link with a personal note referencing agencies like hers. Mike got a reply highlighting the 3 features most relevant to his industry.\n\nBoth emails sent from your Gmail - looks like you wrote them yourself.",
        delay: 5800,
      },
    ],
  },
  {
    id: "autopilot",
    label: "Autopilot cron",
    botName: "Watchdog",
    headline: "It works even when\nyou don't ask.",
    subhead:
      "Set it and forget it. Your agent runs on a schedule - checking revenue, flagging issues, and sending you a morning briefing before you even open your laptop.",
    stats: [
      { stat: "Every 6 hrs", desc: "revenue + churn checks, automatically" },
      { stat: "8:00 AM", desc: "daily briefing in your Telegram, no prompt needed" },
      { stat: "Instant", desc: "alerts when something needs your attention" },
    ],
    messages: [
      {
        type: "system",
        content: "Scheduled check (every 6 hrs)...",
        delay: 0,
      },
      {
        type: "agent",
        content: "Morning briefing - March 24:\n\n* MRR: $11,800 (+$790 from yesterday)\n* 1 new signup overnight: Prism Agency, Pro plan ($79/mo)\n* 0 churns\n* Overdue invoice from Acme ($790) - reminder sent yesterday, no response yet\n\nOne flag: trial user BrightPath hit their message limit 3x this week. High intent - want me to send them an upgrade nudge?",
        delay: 1200,
      },
      { type: "user", content: "Yes, send the upgrade nudge. And follow up on Acme with a phone-friendly reminder", delay: 3200 },
      { type: "system", content: "Drafting emails...", delay: 3800 },
      {
        type: "agent",
        content: "Done. BrightPath got a personalized upgrade email showing their usage vs. the Pro plan limit. Acme got a short, friendly nudge with a direct payment link.\n\nI'll check again at 2 PM and ping you if either responds.",
        delay: 5000,
      },
    ],
  },
  {
    id: "advisory",
    label: "Advisory board",
    botName: "Board",
    headline: "A board of advisors\nin your pocket.",
    subhead:
      "Preinstalled skills turn your agent into a team of mentors - a CFO reviewing your pricing, a CMO critiquing your funnel, a sales coach sharpening your pitch. Expert-level feedback on demand.",
    stats: [
      { stat: "6 advisors", desc: "preinstalled: CFO, CMO, CTO, COO, sales coach, growth mentor" },
      { stat: "On demand", desc: "ask for a board review anytime" },
      { stat: "$0/hr", desc: "vs. $500/hr for a real advisory board" },
    ],
    messages: [
      { type: "user", content: "Run a board review on our Q1 numbers and pricing strategy", delay: 0 },
      { type: "system", content: "Activating advisory skills...", delay: 800 },
      {
        type: "agent",
        content: "Board review complete. Here's the summary:\n\nCFO: Your margins are healthy at 72%, but the Starter tier at $29/mo is underwater after support costs. Consider raising to $39 or removing live support from that tier.\n\nCMO: Your best conversion page is the case study, not the homepage. Move social proof above the fold.\n\nSales Coach: You're leaving money on the table - 40% of Pro users hit their limits monthly. That's an upsell trigger you're ignoring.",
        delay: 3000,
      },
      { type: "user", content: "What does the growth mentor think about our trial-to-paid conversion?", delay: 5200 },
      {
        type: "agent",
        content: "Growth Mentor: Your trial-to-paid is 12%, which is below the 15-20% SaaS benchmark. Two issues:\n\n1. No onboarding email sequence - users sign up and hear nothing for 7 days\n2. Your trial doesn't expire - there's no urgency to convert\n\nQuick win: add a 3-email drip (day 1, day 3, day 6) and set trials to 14 days with a countdown. Companies like Basecamp saw 25% conversion lifts from expiring trials alone.",
        delay: 6800,
      },
    ],
  },
  {
    id: "social",
    label: "Content + outreach",
    botName: "Ghost",
    headline: "Turn your wins into\ninbound leads.",
    subhead:
      "Your agent knows what content drives revenue - not just engagement. It drafts posts, schedules them at peak times, and turns every client win into a lead magnet.",
    stats: [
      { stat: "3 leads", desc: "from last case study thread" },
      { stat: "Tuesday 9am", desc: "your highest engagement window" },
      { stat: "10 min", desc: "from idea to scheduled post" },
    ],
    messages: [
      { type: "user", content: "What content should I post this week?", delay: 0 },
      { type: "system", content: "Analyzing your top posts + industry trends...", delay: 800 },
      {
        type: "agent",
        content:
          "Based on what performed best for you:\n\n1. Case study thread - your client Bloom Co saved 20 hrs/week (your audience loves specifics)\n2. Hot take on the new AI pricing from OpenAI (trending topic, high engagement window)\n3. Behind-the-scenes of how you closed a $15K deal in one call\n\n#1 has the highest revenue potential - last time you posted a case study, you got 3 inbound leads.",
        delay: 2400,
      },
      { type: "user", content: "Draft the case study thread for me", delay: 4200 },
      { type: "system", content: "Writing thread draft...", delay: 4800 },
      {
        type: "agent",
        content: "Here's a 5-post thread:\n\n1/ \"Our client was spending 20 hrs/week on manual reports. Now they spend zero. Here's what we did:\"\n2/ The problem + old workflow\n3/ What we built + the 'aha' moment\n4/ Results with real numbers\n5/ CTA to book a call\n\nFull draft is in your Notion. Want me to schedule it for Tuesday 9am? That's your highest engagement window.",
        delay: 6200,
      },
    ],
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}

export function LiveDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeScenario, setActiveScenario] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [hasPlayed, setHasPlayed] = useState<Set<number>>(new Set([0]));

  const current = scenarios[activeScenario];

  useEffect(() => {
    if (!isInView && !hasPlayed.has(activeScenario)) return;
    if (!isInView) return;

    setVisibleMessages([]);
    setShowTyping(false);

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    current.messages.forEach((msg, i) => {
      if (msg.type === "agent") {
        timeouts.push(setTimeout(() => setShowTyping(true), msg.delay - 600));
      }
      timeouts.push(
        setTimeout(() => {
          setShowTyping(false);
          setVisibleMessages((prev) => [...prev, i]);
        }, msg.delay)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView, activeScenario]);

  function switchScenario(idx: number) {
    setActiveScenario(idx);
    setHasPlayed((prev) => new Set(prev).add(idx));
  }

  return (
    <section id="demo" className="relative py-24 sm:py-32">
      <div className="section-divider mb-24" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left copy - adapts per tab */}
          <div>
            <span className="label-mono">See it work</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScenario}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="heading-section mt-4 whitespace-pre-line">
                  {current.headline.split("\n").map((line, i) => (
                    <span key={i}>
                      {i === 1 ? <span className="italic">{line}</span> : line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                  <span className="text-[var(--accent)]">.</span>
                </h2>
                <p className="body-large mt-6 max-w-md">
                  {current.subhead}
                </p>

                <div className="mt-8 flex flex-col gap-4">
                  {current.stats.map((item) => (
                    <div key={item.stat} className="flex items-baseline gap-3">
                      <span
                        className="shrink-0 text-[15px] font-semibold text-[var(--accent)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item.stat}
                      </span>
                      <span className="text-[14px] text-[var(--text-secondary)]">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Chat window with tabs */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Scenario tabs */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {scenarios.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => switchScenario(i)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
                    i === activeScenario
                      ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="demo-window">
              <div className="demo-titlebar">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span
                  className="ml-2 text-[11px] text-[var(--text-tertiary)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {current.botName} &middot; Telegram
                </span>
              </div>

              <div className="flex min-h-[340px] flex-col gap-3 p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScenario}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3"
                  >
                    {current.messages.map((msg, i) => {
                      const visible = visibleMessages.includes(i);
                      if (!visible) return null;

                      if (msg.type === "system") {
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="msg-system justify-center"
                          >
                            <svg
                              className="h-3 w-3 animate-spin text-[var(--accent)]"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="31.4 31.4"
                                strokeLinecap="round"
                              />
                            </svg>
                            <span>{msg.content}</span>
                          </motion.div>
                        );
                      }

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={
                            msg.type === "user" ? "msg-user" : "msg-agent"
                          }
                        >
                          <p className="whitespace-pre-line text-[13px] leading-relaxed text-[var(--text)]">
                            {msg.content}
                          </p>
                        </motion.div>
                      );
                    })}

                    {showTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="msg-agent w-fit"
                      >
                        <TypingIndicator />
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
