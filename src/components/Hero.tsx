"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="float absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="float-delay absolute top-40 right-1/4 h-72 w-72 rounded-full bg-indigo-600/8 blur-3xl" />
        <div className="float-delay-2 absolute -bottom-20 left-1/2 h-80 w-80 rounded-full bg-blue-600/6 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-5xl px-6 text-center lg:px-8"
      >
        {/* Badge */}
        <motion.div variants={item} className="mb-8 inline-flex">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-zinc-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Now with smart model routing
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="mx-auto max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-7xl"
        >
          Your personal AI team,{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              always on
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8C50 2 100 4 150 6C200 8 250 3 298 6"
                stroke="url(#underline-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                  <stop stopColor="#8b5cf6" stopOpacity="0" />
                  <stop offset="0.3" stopColor="#8b5cf6" />
                  <stop offset="0.7" stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
        >
          Deploy AI agents that connect to Telegram, Slack, Gmail, GitHub and
          more. Smart routing picks the right model for every task. Zero DevOps.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#pricing"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <span>View Plans</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <div className="absolute inset-0 -z-10 rounded-xl bg-violet-600 opacity-40 blur-xl transition group-hover:opacity-60" />
          </a>
          <a
            href="#"
            className="glass inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
            Watch Demo
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={item}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex -space-x-2">
            {[
              "bg-gradient-to-br from-violet-400 to-indigo-500",
              "bg-gradient-to-br from-emerald-400 to-teal-500",
              "bg-gradient-to-br from-amber-400 to-orange-500",
              "bg-gradient-to-br from-pink-400 to-rose-500",
              "bg-gradient-to-br from-cyan-400 to-blue-500",
            ].map((bg, i) => (
              <div
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${bg} text-xs font-bold text-white ring-2 ring-[#050510]`}
              >
                {["R", "S", "A", "L", "M"][i]}
              </div>
            ))}
          </div>
          <p className="text-sm text-zinc-500">
            Trusted by <span className="font-medium text-zinc-300">120+</span> teams worldwide
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
