"use client";

import { clearSessionAndRedirect } from "@/lib/utils";
import { toast } from "sonner";

// Client-side API utility with automatic error handling
export class ClientAPI {
  static async fetch(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      // Handle different response statuses
      if (response.status === 401) {
        // Check response body for more specific error
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If can't parse JSON, treat as generic auth error
        }

        if (
          errorData?.error?.code === "TOKEN_EXPIRED" ||
          errorData?.message?.includes("TOKEN_EXPIRED") ||
          errorData?.message?.includes("token_expired")
        ) {
          toast.error("Session expired", {
            description: "Your session has expired. Please login again.",
          });
        } else {
          toast.error("Authentication required", {
            description: "Please login to continue.",
          });
        }

        clearSessionAndRedirect();
        return null;
      }

      if (response.status === 403) {
        toast.error("Access denied", {
          description: "You don't have permission to access this resource.",
        });
        return null;
      }

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Something went wrong";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If can't parse JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }

        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);

      // Handle specific error messages
      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (
          message.includes("token_expired") ||
          message.includes("no_access_token") ||
          message.includes("invalid_token")
        ) {
          clearSessionAndRedirect();
          return null;
        }

        // Handle network errors
        if (message.includes("fetch")) {
          toast.error("Network error", {
            description: "Please check your internet connection and try again.",
          });
          return null;
        }
      }

      throw error;
    }
  }

  // Convenience methods for common HTTP methods
  static async get(url: string, options: RequestInit = {}) {
    return this.fetch(url, { ...options, method: "GET" });
  }

  static async post(url: string, body?: any, options: RequestInit = {}) {
    return this.fetch(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static async put(url: string, body?: any, options: RequestInit = {}) {
    return this.fetch(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static async delete(url: string, options: RequestInit = {}) {
    return this.fetch(url, { ...options, method: "DELETE" });
  }
}
