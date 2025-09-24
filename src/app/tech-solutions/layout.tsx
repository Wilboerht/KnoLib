import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Solutions - KnoLib",
  description: "Comprehensive technical solutions and architecture documentation for KnoLib platform",
};

export default function TechSolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {children}
    </div>
  );
}
