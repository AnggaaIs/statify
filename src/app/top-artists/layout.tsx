import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Artists - Statify",
  description:
    "Discover your most listened to artists on Spotify with detailed statistics and insights.",
};

export default function TopArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
