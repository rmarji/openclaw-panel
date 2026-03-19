"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

interface EvalGroup { evaluator: string; avg: number; pass: number; partial: number; fail: number; count: number; }

const EVAL_COLORS = ["rgba(139,92,246,0.8)", "rgba(59,130,246,0.8)", "rgba(16,185,129,0.8)", "rgba(245,158,11,0.8)", "rgba(236,72,153,0.8)"];

export function EvalByEvaluatorChart({ data }: { data: EvalGroup[] }) {
  return (
    <div className="admin-card rounded-lg p-5">
      <h3 className="text-xs text-white/40 uppercase tracking-wide mb-4">Eval Scores by Evaluator</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={32}>
          <XAxis dataKey="evaluator" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v.replace("task-completion", "task").replace("tool-use-accuracy", "tool").replace("persona-consistency", "persona").replace("delegation-judgment", "deleg").replace("safety-gate", "safety")} />
          <YAxis domain={[0, 1]} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "rgba(10,10,28,0.95)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "8px", fontSize: "11px", color: "rgba(255,255,255,0.7)" }}
            formatter={(value) => [Number(value).toFixed(2), "Avg Score"]} />
          <Bar dataKey="avg" fill="rgba(139, 92, 246, 0.6)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EvalTrendChart({ data, evaluators }: { data: Record<string, unknown>[]; evaluators: string[] }) {
  return (
    <div className="admin-card rounded-lg p-5">
      <h3 className="text-xs text-white/40 uppercase tracking-wide mb-4">Eval Score Trends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v.split("-").slice(1).join("/")} />
          <YAxis domain={[0, 1]} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "rgba(10,10,28,0.95)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "8px", fontSize: "11px", color: "rgba(255,255,255,0.7)" }} />
          <Legend wrapperStyle={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }} />
          {evaluators.map((e, i) => (
            <Line key={e} type="monotone" dataKey={e} stroke={EVAL_COLORS[i % EVAL_COLORS.length]} strokeWidth={1.5} dot={false}
              name={e.replace("task-completion", "task").replace("tool-use-accuracy", "tool").replace("persona-consistency", "persona").replace("delegation-judgment", "deleg").replace("safety-gate", "safety")} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
