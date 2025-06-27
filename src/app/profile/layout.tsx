import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statify - Profile",
  description:
    "View your Spotify profile information, listening stats, and account details on Statify.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
