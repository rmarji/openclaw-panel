export function StaleDataBanner({ message }: { message?: string }) {
  return (
    <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg px-4 py-2 mb-6">
      <p className="text-xs text-amber-400/70">
        {message || "Showing cached data — some information may be outdated."}
      </p>
    </div>
  );
}
