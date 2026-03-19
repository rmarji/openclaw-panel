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
        window.location.href = "/admin/login";
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="admin-card rounded-2xl p-12 w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Claw<span className="text-violet-400">Ops</span></h1>
          <p className="text-xs text-white/25 mt-2 tracking-widest uppercase">Mission Control</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Access token"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 transition-all" autoFocus />
          {error && <p className="text-red-400/80 text-xs">{error}</p>}
          <button type="submit" disabled={loading || !password}
            className="w-full py-3 bg-violet-600/80 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            {loading ? "Authenticating..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-white/20 text-sm">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
