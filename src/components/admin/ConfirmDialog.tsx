"use client";
interface Props { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; loading?: boolean; }

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="admin-card rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-admin-primary mb-2">{title}</h3>
        <p className="text-xs text-admin-secondary mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-3 py-1.5 text-xs text-admin-secondary hover:text-admin-primary transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 disabled:opacity-50">
            {loading ? "Working..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
