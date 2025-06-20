"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth/context";
import { DefaultErrorFallback } from "@/components/error/error-boundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { user } = useAuth();

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50/50 via-background to-orange-50/30 dark:from-red-950/20 dark:via-background dark:to-orange-950/10">
      {/* Navbar */}
      <div className="relative z-20">
        <Navbar variant={user ? "authenticated" : "landing"} />
      </div>

      {/* Error Content */}
      <div className="flex-1 flex items-center justify-center">
        <DefaultErrorFallback error={error} resetError={reset} />
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
