import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Base - KnoLib",
  description: "Comprehensive knowledge base and documentation for KnoLib platform",
};

export default function KnowledgeLayout({
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
