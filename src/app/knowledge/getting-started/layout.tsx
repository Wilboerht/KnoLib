import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started - KnoLib Knowledge Base",
  description: "Get started with KnoLib platform - guides and tutorials for beginners",
};

export default function GettingStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
