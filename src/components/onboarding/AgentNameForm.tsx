"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  agentId?: string;
}

export function AgentNameForm({ agentId }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/agents/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), agentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/onboarding/telegram");
    } catch {
      setError("Network error, try again");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Agent name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="e.g. My Assistant, Project Alpha"
          maxLength={40}
          autoFocus
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
        {slug && (
          <p className="mt-2 text-xs text-text-tertiary font-mono">
            {slug}.claw.jogeeks.com
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Deploying...
          </span>
        ) : (
          "Deploy Agent"
        )}
      </button>
    </form>
  );
}
