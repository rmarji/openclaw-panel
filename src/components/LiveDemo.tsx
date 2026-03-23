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
  messages: Message[];
}

const scenarios: Scenario[] = [
  {
    id: "calendar",
    label: "Calendar",
    botName: "Rayo",
    messages: [
      { type: "user", content: "What meetings do I have today?", delay: 0 },
      { type: "system", content: "Pulling from Google Calendar...", delay: 800 },
      {
        type: "agent",
        content:
          "You have 3 meetings today:\n* 10:00 AM - Daily standup (15 min)\n* 2:00 PM - Design review with Sarah (1 hr)\n* 4:00 PM - 1:1 with Marcus (30 min)",
        delay: 1800,
      },
      { type: "user", content: "Cancel the 4pm, something came up", delay: 3600 },
      { type: "system", content: "Updating Google Calendar...", delay: 4200 },
      {
        type: "agent",
        content: "Done! Cancelled your 1:1 with Marcus and sent him a heads up so he's not left wondering.",
        delay: 5200,
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    botName: "Sentinel",
    messages: [
      { type: "user", content: "How's the production deploy looking?", delay: 0 },
      { type: "system", content: "Checking GitHub Actions + server metrics...", delay: 800 },
      {
        type: "agent",
        content:
          "Deploy #247 rolled out 12 min ago. All 3 servers healthy:\n* CPU: 23% avg across cluster\n* Memory: 4.2 GB / 32 GB on claws\n* 0 errors in the last 10 min\nOne thing: response latency on /api/checkout spiked to 820ms (normally 200ms). Want me to pull the logs?",
        delay: 2200,
      },
      { type: "user", content: "Yeah, pull the slow request logs", delay: 4000 },
      { type: "system", content: "Querying Langfuse traces...", delay: 4600 },
      {
        type: "agent",
        content: "Found it. The Stripe API is taking 600ms+ on subscription.retrieve calls. Looks like Stripe is having intermittent latency on their end - their status page confirms degraded performance. Not on our side. I'll keep monitoring and ping you if it gets worse.",
        delay: 5800,
      },
    ],
  },
  {
    id: "email",
    label: "Email triage",
    botName: "Atlas",
    messages: [
      { type: "user", content: "Anything urgent in my inbox from today?", delay: 0 },
      { type: "system", content: "Scanning Gmail...", delay: 800 },
      {
        type: "agent",
        content:
          "14 new emails today. 2 need your attention:\n\n1. From legal@acme.co - NDA review, they need a signature by EOD Friday\n2. From marcus@team.io - client demo moved to tomorrow 9am, needs your deck\n\nThe rest: 6 newsletters, 3 automated alerts (all green), 2 cold outreach, 1 receipt.",
        delay: 2400,
      },
      { type: "user", content: "Draft a reply to Marcus, tell him I'll have the deck ready by 8am", delay: 4200 },
      { type: "system", content: "Drafting reply in Gmail...", delay: 4800 },
      {
        type: "agent",
        content: "Draft saved. Here's what I wrote:\n\n\"Hey Marcus, got it - I'll have the updated deck in your inbox by 8am sharp. Anything specific you want me to add before the demo?\"\n\nSend it, or want me to change anything?",
        delay: 6000,
      },
    ],
  },
  {
    id: "github",
    label: "Code review",
    botName: "Rayo",
    messages: [
      { type: "user", content: "What PRs are waiting on me?", delay: 0 },
      { type: "system", content: "Checking GitHub...", delay: 800 },
      {
        type: "agent",
        content:
          "3 PRs need your review:\n\n1. #412 \"Add rate limiting to API\" by Sarah - 2 files, opened 3h ago\n2. #409 \"Fix webhook retry logic\" by Marcus - 1 file, opened yesterday\n3. #401 \"Migrate auth to Clerk\" by bot - 13 files, opened 2 days ago\n\n#409 is the smallest, want to start there?",
        delay: 2000,
      },
      { type: "user", content: "Summarize the changes in #412", delay: 3800 },
      { type: "system", content: "Reading PR diff...", delay: 4400 },
      {
        type: "agent",
        content: "Sarah added express-rate-limit middleware to /api/checkout and /api/webhooks. 50 requests per 15 min window per IP, with a custom handler that returns 429 + retry-after header. Tests included. Clean implementation - no concerns from me. Want me to approve it?",
        delay: 5800,
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

  const currentScenario = scenarios[activeScenario];

  useEffect(() => {
    if (!isInView && !hasPlayed.has(activeScenario)) return;
    if (!isInView) return;

    setVisibleMessages([]);
    setShowTyping(false);

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    currentScenario.messages.forEach((msg, i) => {
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
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label-mono">See it work</span>
            <h2 className="heading-section mt-4">
              Your agent handles<br />
              <span className="italic">the chaos</span>
              <span className="text-[var(--accent)]">.</span>
            </h2>
            <p className="body-large mt-6 max-w-md">
              Right now, you're toggling between 7 tabs to reschedule one meeting,
              triage your inbox, or check a deploy.
              Your agent does it in <span className="text-[var(--text)]">one message</span>.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {[
                { stat: "6.2 hrs/week", desc: "saved per user on average" },
                { stat: "< 3 seconds", desc: "to check, act, and confirm" },
                { stat: "Zero", desc: "dropped balls - it never forgets a follow-up" },
              ].map((item) => (
                <div key={item.stat} className="flex items-baseline gap-3">
                  <span className="shrink-0 text-[15px] font-semibold text-[var(--accent)]" style={{ fontFamily: "var(--font-mono)" }}>
                    {item.stat}
                  </span>
                  <span className="text-[14px] text-[var(--text-secondary)]">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

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
                <span className="ml-2 text-[11px] text-[var(--text-tertiary)]" style={{ fontFamily: "var(--font-mono)" }}>
                  {currentScenario.botName} &middot; Telegram
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
                    {currentScenario.messages.map((msg, i) => {
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
                            <svg className="h-3 w-3 animate-spin text-[var(--accent)]" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4 31.4" strokeLinecap="round" />
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
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className={msg.type === "user" ? "msg-user" : "msg-agent"}
                        >
                          <p className="whitespace-pre-line text-[13px] leading-relaxed text-[var(--text)]">
                            {msg.content}
                          </p>
                        </motion.div>
                      );
                    })}

                    {showTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="msg-agent w-fit">
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
