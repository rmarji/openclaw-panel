"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { useChartTheme } from "./ChartTooltip";

interface EvalGroup { evaluator: string; avg: number; pass: number; partial: number; fail: number; count: number; }

const EVAL_COLORS = ["#5E6AD2", "#3B82F6", "#10B981", "#F59E0B", "#EC4899"];

export function EvalByEvaluatorChart({ data }: { data: EvalGroup[] }) {
  const chart = useChartTheme();
  return (
    <div className="admin-card rounded-lg p-4">
      <h3 className="admin-heading-card mb-3">Eval Scores by Evaluator</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={24}>
          <XAxis dataKey="evaluator" tick={{ fill: chart.labelColor, fontSize: 9 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v.replace("task-completion", "task").replace("tool-use-accuracy", "tool").replace("persona-consistency", "persona").replace("delegation-judgment", "deleg").replace("safety-gate", "safety")} />
          <YAxis domain={[0, 1]} tick={{ fill: chart.labelColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chart.tooltipStyle}
            formatter={(value) => [Number(value).toFixed(2), "Avg Score"]} />
          <Bar dataKey="avg" fill={chart.accentColor} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EvalTrendChart({ data, evaluators }: { data: Record<string, unknown>[]; evaluators: string[] }) {
  const chart = useChartTheme();
  return (
    <div className="admin-card rounded-lg p-4">
      <h3 className="admin-heading-card mb-3">Eval Score Trends</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridColor} />
          <XAxis dataKey="date" tick={{ fill: chart.labelColor, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v.split("-").slice(1).join("/")} />
          <YAxis domain={[0, 1]} tick={{ fill: chart.labelColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chart.tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
          {evaluators.map((e, i) => (
            <Line key={e} type="monotone" dataKey={e} stroke={EVAL_COLORS[i % EVAL_COLORS.length]} strokeWidth={1.5} dot={false}
              name={e.replace("task-completion", "task").replace("tool-use-accuracy", "tool").replace("persona-consistency", "persona").replace("delegation-judgment", "deleg").replace("safety-gate", "safety")} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
