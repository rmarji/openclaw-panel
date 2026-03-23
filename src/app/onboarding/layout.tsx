import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup your agent — ClawGeeks",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-[1]">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}
