"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 120, suffix: "+", label: "Teams deployed" },
  { value: 2, suffix: "M+", label: "Messages processed" },
  { value: 99, suffix: ".9%", label: "Uptime" },
  { value: 23, suffix: "", label: "Routing dimensions" },
];

export function Stats() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="section-divider mb-24" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="stat-value">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="stat-label mt-3">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-24" />
    </section>
  );
}
