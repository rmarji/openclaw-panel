export function StaleDataBanner({ message }: { message?: string }) {
  return (
    <div className="admin-card-alert border-l-amber-400 rounded-lg mb-6">
      <p className="text-xs text-amber-400/80">
        {message || "Showing cached data \u2014 some information may be outdated."}
      </p>
    </div>
  );
}
