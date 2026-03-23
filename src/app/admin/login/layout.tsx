"use client";
import { ThemeProvider } from "@/components/admin/ThemeProvider";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="fixed inset-0 z-[100] bg-admin-bg" style={{ isolation: "isolate" }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
