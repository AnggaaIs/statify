import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { clearSessionAndRedirect } from "@/lib/utils";

export class SpotifyAPI {
  private baseURL = "https://api.spotify.com/v1";
  private isApiRoute: boolean;

  constructor(isApiRoute: boolean = false) {
    this.isApiRoute = isApiRoute;
  }

  async getAccessToken() {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.provider_token) {
      if (this.isApiRoute) {
        throw new Error("NO_ACCESS_TOKEN");
      } else {
        // Clear session and redirect to home
        await this.handleTokenExpired();
        return;
      }
    }

    return session.provider_token;
  }

  async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      // Handle 204 No Content responses (common for Spotify API)
      if (response.status === 204) {
        return null;
      }

      let jsonResponse;
      try {
        jsonResponse = await response.json();
      } catch (parseError) {
        // Some endpoints might not return JSON
        if (response.ok) {
          return null;
        }
        throw new Error(`PARSE_ERROR_${response.status}`);
      }

      if (!response.ok) {
        await this.handleSpotifyError(response.status, jsonResponse, endpoint);
      }

      return jsonResponse;
    } catch (error) {
      // Handle redirect errors (jika bukan API route)
      if (
        error instanceof Error &&
        this.shouldRedirectError(error.message) &&
        !this.isApiRoute
      ) {
        this.handleErrorRedirect(error.message);
        return;
      }

      // Re-throw known errors
      if (error instanceof Error && this.isKnownError(error.message)) {
        throw error;
      }

      // Handle unknown errors
      console.error("Unknown Spotify API error:", error);
      throw new Error("UNKNOWN_ERROR");
    }
  }

  private async handleSpotifyError(
    status: number,
    errorResponse: any,
    endpoint: string
  ) {
    const errorMessage =
      errorResponse?.error?.message || "Unknown Spotify error";
    const errorReason = errorResponse?.error?.reason;

    switch (status) {
      case 401:
        // Check if it's actually a token expiration vs other auth issues
        if (this.isTokenExpiredError(errorResponse)) {
          if (this.isApiRoute) {
            throw new Error("TOKEN_EXPIRED");
          } else {
            await this.handleTokenExpired();
            return;
          }
        } else {
          // Other auth issues (invalid token format, etc.)
          if (this.isApiRoute) {
            throw new Error("INVALID_TOKEN");
          } else {
            redirect("/?error=invalid_token");
          }
        }

      case 403:
        // Check specific permission issues
        if (this.isInsufficientScopeError(errorResponse)) {
          if (this.isApiRoute) {
            throw new Error("INSUFFICIENT_SCOPE");
          } else {
            redirect("/?error=insufficient_scope");
          }
        } else if (this.isPremiumRequiredError(errorResponse)) {
          if (this.isApiRoute) {
            throw new Error("PREMIUM_REQUIRED");
          } else {
            redirect("/?error=premium_required");
          }
        } else {
          if (this.isApiRoute) {
            throw new Error("FORBIDDEN");
          } else {
            redirect("/?error=forbidden");
          }
        }

      case 404:
        if (this.isApiRoute) {
          throw new Error("RESOURCE_NOT_FOUND");
        } else {
          redirect("/?error=resource_not_found");
        }

      case 429:
        // Rate limiting with retry-after header
        const retryAfter = errorResponse?.retry_after || 1;
        if (this.isApiRoute) {
          throw new Error(`RATE_LIMITED:${retryAfter}`);
        } else {
          redirect(`/?error=rate_limited&retry_after=${retryAfter}`);
        }

      case 500:
      case 502:
      case 503:
        if (this.isApiRoute) {
          throw new Error("SPOTIFY_SERVER_ERROR");
        } else {
          redirect("/?error=server_error");
        }

      default:
        if (this.isApiRoute) {
          throw new Error(`SPOTIFY_API_ERROR_${status}`);
        } else {
          redirect(`/?error=api_error&status=${status}`);
        }
    }
  }

  private shouldRedirectError(errorMessage: string): boolean {
    const redirectErrors = [
      "NO_ACCESS_TOKEN",
      "TOKEN_EXPIRED",
      "INVALID_TOKEN",
      "INSUFFICIENT_SCOPE",
      "PREMIUM_REQUIRED",
      "FORBIDDEN",
    ];

    return redirectErrors.some((error) => errorMessage.includes(error));
  }

  private handleErrorRedirect(errorMessage: string) {
    if (errorMessage.includes("NO_ACCESS_TOKEN")) {
      redirect("/?error=no_access_token");
    } else if (errorMessage.includes("TOKEN_EXPIRED")) {
      redirect("/?error=token_expired");
    } else if (errorMessage.includes("INVALID_TOKEN")) {
      redirect("/?error=invalid_token");
    } else if (errorMessage.includes("INSUFFICIENT_SCOPE")) {
      redirect("/?error=insufficient_scope");
    } else if (errorMessage.includes("PREMIUM_REQUIRED")) {
      redirect("/?error=premium_required");
    } else if (errorMessage.includes("FORBIDDEN")) {
      redirect("/?error=forbidden");
    }
  }

  private isTokenExpiredError(errorResponse: any): boolean {
    const message = errorResponse?.error?.message?.toLowerCase() || "";
    const reason = errorResponse?.error?.reason?.toLowerCase() || "";

    return (
      message.includes("token expired") ||
      message.includes("access token expired") ||
      reason === "token_expired" ||
      message.includes("invalid access token")
    );
  }

  private isInsufficientScopeError(errorResponse: any): boolean {
    const message = errorResponse?.error?.message?.toLowerCase() || "";
    const reason = errorResponse?.error?.reason?.toLowerCase() || "";

    return (
      message.includes("insufficient scope") ||
      message.includes("scope") ||
      reason === "insufficient_scope"
    );
  }

  private isPremiumRequiredError(errorResponse: any): boolean {
    const message = errorResponse?.error?.message?.toLowerCase() || "";
    const reason = errorResponse?.error?.reason?.toLowerCase() || "";

    return (
      message.includes("premium") ||
      message.includes("subscription") ||
      reason === "premium_required"
    );
  }

  private isKnownError(errorMessage: string): boolean {
    const knownErrors = [
      "NO_ACCESS_TOKEN",
      "TOKEN_EXPIRED",
      "INVALID_TOKEN",
      "INSUFFICIENT_SCOPE",
      "PREMIUM_REQUIRED",
      "FORBIDDEN",
      "RESOURCE_NOT_FOUND",
      "SPOTIFY_SERVER_ERROR",
      "UNKNOWN_ERROR",
    ];

    return (
      knownErrors.includes(errorMessage) ||
      errorMessage.startsWith("RATE_LIMITED:") ||
      errorMessage.startsWith("SPOTIFY_API_ERROR_") ||
      errorMessage.startsWith("PARSE_ERROR_")
    );
  }

  private async handleTokenExpired() {
    console.log("Token expired, signing out user and clearing session");
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/?error=token_expired&ts=" + Date.now());
  }

  // Utility method to check if user has required scopes
  async checkRequiredScopes(requiredScopes: string[]): Promise<boolean> {
    try {
      // Try to get user profile to test basic access
      await this.makeRequest("/me");
      return true;
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        return false;
      }
      throw error;
    }
  }

  // Enhanced methods with better error context
  async getCurrentlyPlaying() {
    try {
      return await this.makeRequest("/me/player/currently-playing");
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        throw new Error("INSUFFICIENT_SCOPE:user-read-currently-playing");
      }
      throw error;
    }
  }

  async getTopTracks(
    timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
    limit = 20
  ) {
    try {
      return await this.makeRequest(
        `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
      );
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        throw new Error("INSUFFICIENT_SCOPE:user-top-read");
      }
      throw error;
    }
  }

  async getTopArtists(
    timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
    limit = 20
  ) {
    try {
      return await this.makeRequest(
        `/me/top/artists?time_range=${timeRange}&limit=${limit}`
      );
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        throw new Error("INSUFFICIENT_SCOPE:user-top-read");
      }
      throw error;
    }
  }

  async getUserProfile() {
    try {
      return await this.makeRequest("/me");
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        throw new Error("INSUFFICIENT_SCOPE:user-read-private");
      }
      throw error;
    }
  }

  async getRecentlyPlayed(limit = 20) {
    try {
      return await this.makeRequest(
        `/me/player/recently-played?limit=${limit}`
      );
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        throw new Error("INSUFFICIENT_SCOPE:user-read-recently-played");
      }
      throw error;
    }
  }

  async getUserPlaylists(limit = 20, offset = 0) {
    try {
      return await this.makeRequest(
        `/me/playlists?limit=${limit}&offset=${offset}`
      );
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        throw new Error("INSUFFICIENT_SCOPE:playlist-read-private");
      }
      throw error;
    }
  }

  // Get available devices
  async getAvailableDevices() {
    try {
      return await this.makeRequest("/me/player/devices");
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        throw new Error("INSUFFICIENT_SCOPE:user-read-playback-state");
      }
      throw error;
    }
  }

  // Playback control methods (require premium)
  async pausePlayback() {
    return await this.makeRequest("/me/player/pause", { method: "PUT" });
  }

  async resumePlayback() {
    return await this.makeRequest("/me/player/play", { method: "PUT" });
  }

  async skipToNext() {
    return await this.makeRequest("/me/player/next", { method: "POST" });
  }

  async skipToPrevious() {
    return await this.makeRequest("/me/player/previous", { method: "POST" });
  }

  async getCurrentPlayback() {
    try {
      return await this.makeRequest("/me/player");
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_SCOPE") {
        throw new Error("INSUFFICIENT_SCOPE:user-read-playback-state");
      }
      throw error;
    }
  }
}
