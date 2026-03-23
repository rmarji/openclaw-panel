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
    id: "leads",
    label: "Lead follow-up",
    botName: "Closer",
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
    id: "scheduling",
    label: "Client meetings",
    botName: "Rayo",
    messages: [
      { type: "user", content: "What's on my plate today?", delay: 0 },
      { type: "system", content: "Pulling from Google Calendar...", delay: 800 },
      {
        type: "agent",
        content:
          "3 meetings today:\n* 10:00 AM - Discovery call with Bloom Co ($15K deal)\n* 2:00 PM - Proposal review with your team\n* 4:00 PM - 1:1 with Marcus\n\nHeads up: Bloom Co opened your proposal email 6 times since yesterday. They're ready.",
        delay: 1800,
      },
      { type: "user", content: "Cancel the 4pm and prep me for the Bloom call", delay: 3600 },
      { type: "system", content: "Updating calendar, pulling deal notes...", delay: 4200 },
      {
        type: "agent",
        content: "Done - Marcus is notified. Here's your Bloom Co brief:\n\n* Budget: $15K/yr, approved by their CFO\n* Pain point: spending 20 hrs/week on manual client reporting\n* Decision maker: Lisa Chen, COO\n* Competitor: they demoed Zapier last week but found it \"too technical\"\n\nLead with the done-for-you angle. They want easy, not DIY.",
        delay: 5400,
      },
    ],
  },
  {
    id: "invoices",
    label: "Revenue tracking",
    botName: "Atlas",
    messages: [
      { type: "user", content: "How did we do this month?", delay: 0 },
      { type: "system", content: "Pulling from Stripe + Gmail...", delay: 800 },
      {
        type: "agent",
        content:
          "March numbers so far:\n\n* Revenue: $14,200 (up 23% from Feb)\n* New customers: 8\n* Churned: 1 (downgraded, not lost)\n* MRR: $11,800\n\n2 invoices are overdue - $790 from Acme (5 days late) and $199 from BrightPath (2 days). Want me to send friendly reminders?",
        delay: 2400,
      },
      { type: "user", content: "Yes, send reminders to both. Personalize them.", delay: 4200 },
      { type: "system", content: "Drafting payment reminders...", delay: 4800 },
      {
        type: "agent",
        content: "Sent. Acme got a note mentioning their upcoming renewal discount. BrightPath got a softer nudge since they're only 2 days out.\n\nAlso noticed: 3 trials are expiring this week. Want me to send them a \"last chance\" offer with 20% off the first 3 months?",
        delay: 6000,
      },
    ],
  },
  {
    id: "social",
    label: "Content + outreach",
    botName: "Ghost",
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
              Your agent closes deals<br />
              <span className="italic">while you sleep</span>
              <span className="text-[var(--accent)]">.</span>
            </h2>
            <p className="body-large mt-6 max-w-md">
              Leads go cold while you're stuck in admin work.
              Your agent follows up, books calls, sends invoices, and drafts content
              - all from <span className="text-[var(--text)]">one message</span>.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {[
                { stat: "6.2 hrs/week", desc: "freed up for revenue work" },
                { stat: "2x faster", desc: "lead response time" },
                { stat: "$0 dropped", desc: "revenue from missed follow-ups" },
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
