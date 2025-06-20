import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kadoku - Your Music Analytics Dashboard",
  description:
    "Beautiful Spotify analytics with real-time insights and personalized music statistics.",
  keywords: ["spotify", "music", "analytics", "dashboard", "statistics"],
  authors: [{ name: "Kadoku Team" }],
  openGraph: {
    title: "Kadoku - Your Music Analytics Dashboard",
    description:
      "Beautiful Spotify analytics with real-time insights and personalized music statistics.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kadoku - Your Music Analytics Dashboard",
    description:
      "Beautiful Spotify analytics with real-time insights and personalized music statistics.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={true}
            theme="system"
            toastOptions={{
              style: {
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
