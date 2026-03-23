"use client";
import { SpendByGroupChart, DailyVolumeChart } from "@/components/admin/SpendChart";
import { EvalByEvaluatorChart, EvalTrendChart } from "@/components/admin/EvalChart";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";

interface Props {
  data: {
    spendByGroup: { group: string; cost: number; requests: number; tokensIn: number; tokensOut: number }[];
    spendByDay: { date: string; requests: number }[];
    evalByEvaluator: { evaluator: string; avg: number; pass: number; partial: number; fail: number; count: number }[];
    evalByDay: Record<string, unknown>[];
    totalSpend: number;
    totalRequests: number;
    totalScores: number;
  };
}

export function AnalyticsClient({ data }: Props) {
  const evaluators = data.evalByEvaluator.map(e => e.evaluator);

  return (
    <div>
      <h1 className="admin-heading-page mb-8">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        <div className="admin-card-metric rounded-lg">
          <AnimatedNumber value={data.totalSpend} prefix="$" decimals={2} className="metric-value text-2xl font-bold text-admin-primary" />
          <p className="text-xs text-admin-tertiary mt-1">Total Spend (7d)</p>
        </div>
        <div className="admin-card-metric rounded-lg">
          <AnimatedNumber value={data.totalRequests} className="metric-value text-2xl font-bold text-admin-primary" />
          <p className="text-xs text-admin-tertiary mt-1">Total Requests (7d)</p>
        </div>
        <div className="admin-card-metric rounded-lg">
          <AnimatedNumber value={data.totalScores} className="metric-value text-2xl font-bold text-admin-primary" />
          <p className="text-xs text-admin-tertiary mt-1">Eval Scores (7d)</p>
        </div>
      </div>

      {/* Costs Section */}
      <h2 className="admin-heading-section mb-4">Costs</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
        <SpendByGroupChart data={data.spendByGroup} />
        <DailyVolumeChart data={data.spendByDay} />
      </div>

      {/* Spend by Group Table */}
      <div className="admin-card-data rounded-lg mb-12">
        <div className="px-4 py-3 border-b border-admin-border">
          <h3 className="admin-heading-card">Spend Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-admin-tertiary border-b border-admin-border">
                <th className="text-left px-4 py-2 font-medium">Model Group</th>
                <th className="text-right px-4 py-2 font-medium">Requests</th>
                <th className="text-right px-4 py-2 font-medium">Tokens In</th>
                <th className="text-right px-4 py-2 font-medium">Tokens Out</th>
                <th className="text-right px-4 py-2 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.spendByGroup.map((g) => (
                <tr key={g.group} className="border-b border-admin-border/50 admin-row-hover">
                  <td className="px-4 py-2.5 text-admin-secondary font-mono">{g.group}</td>
                  <td className="px-4 py-2.5 text-admin-tertiary text-right metric-value">{g.requests.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-admin-tertiary text-right metric-value">{g.tokensIn?.toLocaleString() || "\u2014"}</td>
                  <td className="px-4 py-2.5 text-admin-tertiary text-right metric-value">{g.tokensOut?.toLocaleString() || "\u2014"}</td>
                  <td className="px-4 py-2.5 text-admin-secondary text-right metric-value">${g.cost.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Eval Section */}
      <h2 className="admin-heading-section mb-4">Evaluation Quality</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <EvalByEvaluatorChart data={data.evalByEvaluator} />
        <EvalTrendChart data={data.evalByDay} evaluators={evaluators} />
      </div>

      {/* Eval Summary Table */}
      <div className="admin-card-data rounded-lg">
        <div className="px-4 py-3 border-b border-admin-border">
          <h3 className="admin-heading-card">Eval Score Distribution</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-admin-tertiary border-b border-admin-border">
                <th className="text-left px-4 py-2 font-medium">Evaluator</th>
                <th className="text-right px-4 py-2 font-medium">Avg</th>
                <th className="text-right px-4 py-2 font-medium">Pass</th>
                <th className="text-right px-4 py-2 font-medium">Partial</th>
                <th className="text-right px-4 py-2 font-medium">Fail</th>
                <th className="text-right px-4 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.evalByEvaluator.map((e) => (
                <tr key={e.evaluator} className="border-b border-admin-border/50 admin-row-hover">
                  <td className="px-4 py-2.5 text-admin-secondary">{e.evaluator}</td>
                  <td className={`px-4 py-2.5 text-right font-bold metric-value ${e.avg >= 0.8 ? "text-emerald-400" : e.avg >= 0.5 ? "text-amber-400" : "text-red-400"}`}>
                    {e.avg.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-emerald-400/60 text-right metric-value">{e.pass}</td>
                  <td className="px-4 py-2.5 text-amber-400/60 text-right metric-value">{e.partial}</td>
                  <td className="px-4 py-2.5 text-red-400/60 text-right metric-value">{e.fail}</td>
                  <td className="px-4 py-2.5 text-admin-tertiary text-right metric-value">{e.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
