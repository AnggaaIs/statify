import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statify - Embed Generator",
  description:
    "Create embeddable widgets of your Spotify stats to share on your website or blog.",
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
