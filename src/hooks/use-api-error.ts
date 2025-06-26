"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { clearSessionAndRedirect } from "@/lib/utils";

export function useApiError() {
  const handleApiError = useCallback((error: any) => {
    if (typeof error === "string") {
      // Handle error messages from API responses
      if (error.includes("TOKEN_EXPIRED") || error.includes("token_expired")) {
        toast.error("Session expired", {
          description: "Your session has expired. Please login again.",
        });
        clearSessionAndRedirect();
        return;
      }

      if (
        error.includes("NO_ACCESS_TOKEN") ||
        error.includes("no_access_token")
      ) {
        toast.error("Authentication required", {
          description: "Please login to continue.",
        });
        clearSessionAndRedirect();
        return;
      }

      if (error.includes("INVALID_TOKEN") || error.includes("invalid_token")) {
        toast.error("Invalid session", {
          description: "Your session is invalid. Please login again.",
        });
        clearSessionAndRedirect();
        return;
      }
    }

    // Handle error objects
    if (error?.message) {
      if (
        error.message === "TOKEN_EXPIRED" ||
        error.message === "NO_ACCESS_TOKEN" ||
        error.message === "INVALID_TOKEN"
      ) {
        clearSessionAndRedirect();
        return;
      }
    }

    // Handle HTTP responses
    if (error?.status === 401) {
      toast.error("Authentication required", {
        description: "Please login to continue.",
      });
      clearSessionAndRedirect();
      return;
    }

    // Default error handling
    console.error("API Error:", error);
    toast.error("Something went wrong", {
      description: "Please try again later.",
    });
  }, []);

  return { handleApiError };
}
