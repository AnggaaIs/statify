"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useApiErrorHandler() {
  const router = useRouter();

  const handleApiError = useCallback(
    async (error: any, response?: Response) => {
      console.error("API Error:", error, response);

      if (response?.status === 401) {
        toast.error("Your session has expired", {
          description: "Please sign in again to continue",
          duration: 5000,
          action: {
            label: "Sign In",
            onClick: () => router.push("/auth/login"),
          },
        });
        return;
      }

      if (response?.status === 403) {
        toast.warning("Access denied", {
          description: "You don't have permission to access this resource",
          duration: 4000,
        });
        return;
      }

      if (response?.status === 429) {
        toast.warning("Rate limited", {
          description: "Too many requests. Please wait a moment and try again",
          duration: 4000,
        });
        return;
      }

      if (response?.status === 404) {
        toast.info("Resource not found", {
          description: "The requested data is not available",
          duration: 3000,
        });
        return;
      }

      if (typeof response?.status === "number" && response.status >= 500) {
        toast.error("Server error", {
          description:
            "Something went wrong on our end. Please try again later",
          duration: 5000,
          action: {
            label: "Retry",
            onClick: () => window.location.reload(),
          },
        });
        return;
      }

      toast.error("Something went wrong", {
        description: error?.message || "An unexpected error occurred",
        duration: 4000,
      });
    },
    [router]
  );

  return { handleApiError };
}
