"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileHeader } from "@/components/admin/MobileHeader";
import { ThemeProvider } from "@/components/admin/ThemeProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-admin-bg relative z-[1]">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <MobileHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 md:ml-56 px-5 md:px-8 py-6 pt-14 md:pt-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
