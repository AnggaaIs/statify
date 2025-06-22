import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statify - Dashboard",
  description: "Your personal music statistics dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
