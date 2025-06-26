import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statify - Top Tracks",
  description:
    "Explore your top tracks on Statify, the music statistics app that provides insights into your listening habits.",
};

export default function TopTracksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
