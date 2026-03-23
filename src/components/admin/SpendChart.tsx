"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { useChartTheme } from "./ChartTooltip";

interface SpendGroup { group: string; cost: number; requests: number; }
interface DailyVolume { date: string; requests: number; }

export function SpendByGroupChart({ data }: { data: SpendGroup[] }) {
  const chart = useChartTheme();
  return (
    <div className="admin-card rounded-lg p-4">
      <h3 className="admin-heading-card mb-3">Spend by Model Group</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={24}>
          <XAxis dataKey="group" tick={{ fill: chart.labelColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: chart.labelColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} />
          <Tooltip contentStyle={chart.tooltipStyle}
            formatter={(value) => [`$${Number(value).toFixed(4)}`, "Cost"]} />
          <Bar dataKey="cost" fill={chart.accentColor} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyVolumeChart({ data }: { data: DailyVolume[] }) {
  const chart = useChartTheme();
  return (
    <div className="admin-card rounded-lg p-4">
      <h3 className="admin-heading-card mb-3">Daily Request Volume</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridColor} />
          <XAxis dataKey="date" tick={{ fill: chart.labelColor, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v.split("-").slice(1).join("/")} />
          <YAxis tick={{ fill: chart.labelColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chart.tooltipStyle} />
          <Area type="monotone" dataKey="requests" stroke={chart.accentColor} strokeWidth={1.5} fill={chart.accentColor} fillOpacity={0.08} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
