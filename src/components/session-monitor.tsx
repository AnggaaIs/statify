"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { clearSessionAndRedirect } from "@/lib/utils";

export function SessionMonitor() {
  const { user } = useAuth();

  useEffect(() => {
    const handleSessionExpired = () => {
      console.log("Session expired event received");
      clearSessionAndRedirect();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes("supabase") && e.newValue === null) {
        console.log("Session cleared from storage");
        clearSessionAndRedirect();
      }
    };

    window.addEventListener("session-expired", handleSessionExpired);
    window.addEventListener("storage", handleStorageChange);

    const sessionCheckInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/spotify/profile", {
          method: "HEAD", // Use HEAD to avoid fetching data
        });

        if (response.status === 401) {
          console.log("Session check failed - 401 response");
          clearSessionAndRedirect();
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(sessionCheckInterval);
    };
  }, [user]);

  return null;
}

export function triggerSessionExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("session-expired"));
  }
}
