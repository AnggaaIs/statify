import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApiResponseBuilder } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clearSessionAndRedirect() {
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (
        name.includes("supabase") ||
        name.includes("auth") ||
        name.includes("sb-")
      ) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });

    window.location.href = "/?error=session_expired&ts=" + Date.now();
  }
}

export function handleTokenExpiration() {
  if (typeof window !== "undefined") {
    clearSessionAndRedirect();
  }
}

export function handleSpotifyError(error: Error) {
  const errorMessage = error.message;

  switch (errorMessage) {
    case "NO_ACCESS_TOKEN":
      if (typeof window !== "undefined") {
        clearSessionAndRedirect();
      }
      return ApiResponseBuilder.unauthorized(
        "Spotify access token not found. Please login again."
      );
    case "TOKEN_EXPIRED":
      if (typeof window !== "undefined") {
        clearSessionAndRedirect();
      }
      return ApiResponseBuilder.tokenExpired(
        "Your Spotify session has expired. Please login again to continue."
      );
    case "INVALID_TOKEN":
      if (typeof window !== "undefined") {
        clearSessionAndRedirect();
      }
      return ApiResponseBuilder.unauthorized(
        "Invalid Spotify token. Please login again."
      );
    case "PREMIUM_REQUIRED":
      return ApiResponseBuilder.error(
        "This feature requires Spotify Premium subscription.",
        402,
        "PREMIUM_REQUIRED"
      );
    case "RESOURCE_NOT_FOUND":
      return ApiResponseBuilder.error(
        "No active Spotify device found. Please start playing music on Spotify.",
        404,
        "NO_ACTIVE_DEVICE"
      );
    case "SPOTIFY_SERVER_ERROR":
      return ApiResponseBuilder.error(
        "Spotify servers are currently experiencing issues. Please try again later.",
        503,
        "SPOTIFY_SERVER_ERROR"
      );
    default:
      if (errorMessage.startsWith("INSUFFICIENT_SCOPE:")) {
        const requiredScope =
          errorMessage.split(":")[1] || "user-read-currently-playing";
        return ApiResponseBuilder.forbidden(
          `Missing required Spotify permission: ${requiredScope}. Please reconnect your account with proper permissions.`
        );
      }
      if (errorMessage.startsWith("RATE_LIMITED:")) {
        const retryAfter = errorMessage.split(":")[1] || "60";
        return ApiResponseBuilder.error(
          `Spotify API rate limit exceeded. Please try again in ${retryAfter} seconds.`,
          429,
          "RATE_LIMITED",
          { retry_after: parseInt(retryAfter) }
        );
      }
      if (errorMessage.startsWith("SPOTIFY_API_ERROR_")) {
        const statusCode = errorMessage.split("_").pop();
        return ApiResponseBuilder.spotifyError(
          `Spotify API returned error ${statusCode}`,
          { spotify_status: statusCode }
        );
      }

      return ApiResponseBuilder.error(
        "An unexpected error occurred while fetching your current track."
      );
  }
}
