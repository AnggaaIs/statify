"use client";

import { clearSessionAndRedirect } from "@/lib/utils";
import { toast } from "sonner";

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

      if (response.status === 401) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {}

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
        let errorMessage = "Something went wrong";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }

        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);

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
