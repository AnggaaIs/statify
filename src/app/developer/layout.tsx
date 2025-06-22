import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statify - Developer",
  description: "Meet the developers behind Statify, the music statistics app.",
};

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
