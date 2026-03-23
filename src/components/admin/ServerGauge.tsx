"use client";

interface Props {
  value: number;
  label: string;
  detail?: string;
  color?: string;
}

export function ServerGauge({ value, label, detail, color = "violet" }: Props) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;
  const colorMap: Record<string, string> = {
    violet: "rgba(139, 92, 246, 0.8)",
    blue: "rgba(59, 130, 246, 0.8)",
    emerald: "rgba(16, 185, 129, 0.8)",
    amber: "rgba(245, 158, 11, 0.8)",
    red: "rgba(239, 68, 68, 0.8)",
  };
  const strokeColor =
    value > 90
      ? colorMap.red
      : value > 75
        ? colorMap.amber
        : colorMap[color];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          className="stroke-admin-border"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="gauge-ring"
          transform="rotate(-90 48 48)"
        />
        <text
          x="48"
          y="44"
          textAnchor="middle"
          className="fill-admin-primary font-bold"
          style={{ fontSize: "18px" }}
        >
          {Math.round(value)}%
        </text>
        <text
          x="48"
          y="60"
          textAnchor="middle"
          className="fill-admin-tertiary"
          style={{ fontSize: "9px" }}
        >
          {label}
        </text>
      </svg>
      {detail && (
        <span className="text-[10px] text-admin-tertiary font-mono">{detail}</span>
      )}
    </div>
  );
}
