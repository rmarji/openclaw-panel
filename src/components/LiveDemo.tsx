"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Message {
  type: "user" | "agent" | "system";
  content: string;
  delay: number;
}

const conversation: Message[] = [
  { type: "user", content: "What meetings do I have today?", delay: 0 },
  { type: "system", content: "Connecting to Google Calendar\u2026", delay: 800 },
  {
    type: "agent",
    content:
      "You have 3 meetings today:\n\u2022 10:00 AM \u2014 Daily standup (15 min)\n\u2022 2:00 PM \u2014 Design review with Sarah (1 hr)\n\u2022 4:00 PM \u2014 1:1 with Marcus (30 min)",
    delay: 1800,
  },
  { type: "user", content: "Cancel the 4pm, something came up", delay: 3600 },
  { type: "system", content: "Updating Google Calendar\u2026", delay: 4200 },
  {
    type: "agent",
    content: "Done! Cancelled your 1:1 with Marcus. I\u2019ve sent him a heads up.",
    delay: 5200,
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
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    conversation.forEach((msg, i) => {
      // Show typing indicator briefly before agent messages
      if (msg.type === "agent") {
        timeouts.push(
          setTimeout(() => setShowTyping(true), msg.delay - 600)
        );
      }

      timeouts.push(
        setTimeout(() => {
          setShowTyping(false);
          setVisibleMessages((prev) => [...prev, i]);
        }, msg.delay)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section id="demo" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label-mono">Live Demo</span>
            <h2 className="heading-section mt-4">
              Watch your agent<br />
              <span className="italic">handle the day</span>
              <span className="text-[var(--accent)]">.</span>
            </h2>
            <p className="body-large mt-6 max-w-md">
              Your agent connects to your tools and acts on your behalf.
              Calendar, email, code \u2014 it handles the routine so you can
              focus on the work that matters.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {[
                "Per-user OAuth \u2014 your agent, their credentials",
                "23-dimension routing picks the perfect model",
                "Every action traced in Langfuse",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-[14px] text-[var(--text-secondary)]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Chat window */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="demo-window">
              {/* Titlebar */}
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
                  Rayo \u00b7 Telegram
                </span>
              </div>

              {/* Messages */}
              <div className="flex min-h-[340px] flex-col gap-3 p-5">
                {conversation.map((msg, i) => {
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="msg-agent w-fit"
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
