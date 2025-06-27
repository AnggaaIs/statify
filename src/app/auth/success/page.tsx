"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Get redirect URL from URL params or localStorage
      const redirectFromUrl = searchParams.get("redirect");
      const redirectFromStorage = localStorage.getItem("auth_redirect");

      // Clear stored redirect
      localStorage.removeItem("auth_redirect");

      // Use redirect URL in priority order: URL param, localStorage, default
      const redirectTo = redirectFromUrl || redirectFromStorage || "/dashboard";

      console.log("Auth success redirect:", {
        redirectFromUrl,
        redirectFromStorage,
        redirectTo,
      });

      // Small delay to ensure auth state is properly set
      setTimeout(() => {
        router.replace(redirectTo);
      }, 100);
    } else if (!loading && !user) {
      // If not authenticated, redirect to home
      router.replace("/");
    }
  }, [user, loading, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
