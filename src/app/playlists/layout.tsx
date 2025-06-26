import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Playlists - Statify",
  description:
    "Explore and manage your Spotify playlists with detailed information and statistics.",
};

export default function PlaylistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
