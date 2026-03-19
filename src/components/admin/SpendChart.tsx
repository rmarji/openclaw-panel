"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

interface SpendGroup { group: string; cost: number; requests: number; }
interface DailyVolume { date: string; requests: number; }

export function SpendByGroupChart({ data }: { data: SpendGroup[] }) {
  return (
    <div className="admin-card rounded-lg p-5">
      <h3 className="text-xs text-white/40 uppercase tracking-wide mb-4">Spend by Model Group</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={32}>
          <XAxis dataKey="group" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} />
          <Tooltip contentStyle={{ background: "rgba(10,10,28,0.95)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "8px", fontSize: "11px", color: "rgba(255,255,255,0.7)" }}
            formatter={(value) => [`$${Number(value).toFixed(4)}`, "Cost"]} />
          <Bar dataKey="cost" fill="rgba(139, 92, 246, 0.6)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyVolumeChart({ data }: { data: DailyVolume[] }) {
  return (
    <div className="admin-card rounded-lg p-5">
      <h3 className="text-xs text-white/40 uppercase tracking-wide mb-4">Daily Request Volume</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v.split("-").slice(1).join("/")} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "rgba(10,10,28,0.95)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "8px", fontSize: "11px", color: "rgba(255,255,255,0.7)" }} />
          <Line type="monotone" dataKey="requests" stroke="rgba(59, 130, 246, 0.8)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
