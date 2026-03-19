export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
              <span className="text-xs font-bold text-white">CG</span>
            </div>
            <span className="text-sm font-semibold text-zinc-400">ClawGeeks</span>
          </div>

          <div className="flex gap-8 text-sm text-zinc-600">
            <a href="#" className="transition hover:text-zinc-300">Privacy</a>
            <a href="#" className="transition hover:text-zinc-300">Terms</a>
            <a href="#" className="transition hover:text-zinc-300">Status</a>
            <a href="#" className="transition hover:text-zinc-300">Contact</a>
          </div>

          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} ClawGeeks
          </p>
        </div>
      </div>
    </footer>
  );
}
