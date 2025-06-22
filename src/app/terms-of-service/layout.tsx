import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statify - Terms of Service",
  description:
    "Statify's Terms of Service outline the rules and guidelines for using our music statistics app.",
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
