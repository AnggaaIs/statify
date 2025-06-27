import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistics - Statify",
  description:
    "Comprehensive music statistics and listening habits analysis with detailed insights about your Spotify data.",
};

export default function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
