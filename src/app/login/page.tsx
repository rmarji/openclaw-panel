"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("logout")) {
      fetch("/api/admin/logout", { method: "POST" }).then(() => {
        window.location.href = "/login";
      });
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { router.push("/admin"); } else {
      const data = await res.json();
      setError(data.error || "Invalid password");
    }
    setLoading(false);
  }

  return (
    <div className="login-scene flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 login-grid pointer-events-none" />

      {/* Login card */}
      <div className="login-card relative z-10 rounded-2xl p-16 w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Claw<span className="login-accent-text">Ops</span>
          </h1>
          <p className="text-xs text-white/30 mt-3 tracking-[0.25em] uppercase font-medium">
            Mission Control
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access token"
              className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 focus:bg-white/[0.05] transition-all duration-300"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400/90 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating
              </span>
            ) : (
              "Enter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#050510]">
          <div className="text-white/20 text-sm tracking-wide">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
