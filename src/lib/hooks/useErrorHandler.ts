"use client";

import { useCallback } from "react";
import { toast } from "sonner";

interface ErrorHandlerOptions {
  showToast?: boolean;
  fallback?: (error: Error) => void;
}

export function useErrorHandler() {
  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const { showToast = true, fallback } = options;

      console.error("Error handled:", error);

      let errorMessage = "An unexpected error occurred";
      let errorType: "error" | "warning" | "info" = "error";

      if (error instanceof Error) {
        errorMessage = error.message;

        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Unable to connect. Please check your internet connection.";
          errorType = "error";
        } else if (
          error.message.includes("auth") ||
          error.message.includes("unauthorized")
        ) {
          errorMessage = "Your session has expired. Please sign in again.";
          errorType = "warning";
        } else if (
          error.message.includes("403") ||
          error.message.includes("forbidden")
        ) {
          errorMessage = "You don't have permission to access this resource.";
          errorType = "warning";
        } else if (
          error.message.includes("404") ||
          error.message.includes("not found")
        ) {
          errorMessage = "The requested resource was not found.";
          errorType = "info";
        } else if (
          error.message.includes("429") ||
          error.message.includes("rate limit")
        ) {
          errorMessage = "Too many requests. Please wait and try again.";
          errorType = "warning";
        }
      }

      if (showToast) {
        switch (errorType) {
          case "error":
            toast.error(errorMessage, {
              duration: 5000,
              action: {
                label: "Dismiss",
                onClick: () => {},
              },
            });
            break;
          case "warning":
            toast.warning(errorMessage, {
              duration: 4000,
              action: {
                label: "Dismiss",
                onClick: () => {},
              },
            });
            break;
          case "info":
            toast.info(errorMessage, {
              duration: 3000,
            });
            break;
          default:
            toast.error(errorMessage);
        }
      }

      if (fallback) {
        fallback(error instanceof Error ? error : new Error(String(error)));
      }
    },
    []
  );

  const showSuccess = useCallback(
    (
      message: string,
      options?: {
        duration?: number;
        action?: { label: string; onClick: () => void };
      }
    ) => {
      toast.success(message, {
        duration: options?.duration || 3000,
        action: options?.action,
      });
    },
    []
  );

  const showInfo = useCallback(
    (message: string, options?: { duration?: number }) => {
      toast.info(message, {
        duration: options?.duration || 3000,
      });
    },
    []
  );

  const showWarning = useCallback(
    (message: string, options?: { duration?: number }) => {
      toast.warning(message, {
        duration: options?.duration || 4000,
      });
    },
    []
  );

  return {
    handleError,
    showSuccess,
    showInfo,
    showWarning,
  };
}
