import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied - Statify",
  description: "You need to be logged in to access this page",
};

export default function AccessDeniedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
