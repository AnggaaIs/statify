import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statify - Privacy Policy",
  description:
    "Statify's Privacy Policy outlines how we handle your data and protect your privacy while using our music statistics app.",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
