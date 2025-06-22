import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("time_range") || "medium_term";
    const limit = parseInt(searchParams.get("limit") || "20");

    // Validate time_range parameter
    const validTimeRanges = ["short_term", "medium_term", "long_term"];
    if (!validTimeRanges.includes(timeRange)) {
      return ApiResponseBuilder.badRequest(
        "Invalid time_range parameter. Must be one of: short_term, medium_term, long_term"
      );
    }

    // Validate limit parameter
    if (limit < 1 || limit > 50) {
      return ApiResponseBuilder.badRequest(
        "Invalid limit parameter. Must be between 1 and 50"
      );
    }

    const spotify = new SpotifyAPI(true);
    const topTracks = await spotify.getTopTracks(
      timeRange as "short_term" | "medium_term" | "long_term",
      limit
    );

    if (!topTracks) {
      return ApiResponseBuilder.success(
        {
          items: [],
          total: 0,
          limit,
          offset: 0,
          next: null,
          previous: null,
        },
        "No top tracks found"
      );
    }

    return ApiResponseBuilder.success(
      topTracks,
      "Top tracks retrieved successfully"
    );
  } catch (error) {
    console.error("Top tracks error:", error);

    if (error instanceof Error) {
      const errorMessage = error.message;

      switch (true) {
        case errorMessage === "NO_ACCESS_TOKEN":
          return ApiResponseBuilder.unauthorized(
            "Spotify access token not found. Please login again."
          );

        case errorMessage === "TOKEN_EXPIRED":
          return ApiResponseBuilder.tokenExpired(
            "Your Spotify session has expired. Please login again to continue."
          );

        case errorMessage === "INVALID_TOKEN":
          return ApiResponseBuilder.unauthorized(
            "Invalid Spotify token. Please login again."
          );

        case errorMessage.startsWith("INSUFFICIENT_SCOPE"):
          const requiredScope = errorMessage.split(":")[1] || "user-top-read";
          return ApiResponseBuilder.forbidden(
            `Missing required Spotify permission: ${requiredScope}. Please reconnect your account with proper permissions.`
          );

        case errorMessage === "PREMIUM_REQUIRED":
          return ApiResponseBuilder.error(
            "This feature requires Spotify Premium subscription.",
            402,
            "PREMIUM_REQUIRED"
          );

        case errorMessage === "RESOURCE_NOT_FOUND":
          return ApiResponseBuilder.error(
            "No top tracks found for your account.",
            404,
            "NO_TOP_TRACKS"
          );

        case errorMessage.startsWith("RATE_LIMITED"):
          const retryAfter = errorMessage.split(":")[1] || "60";
          return ApiResponseBuilder.error(
            `Spotify API rate limit exceeded. Please try again in ${retryAfter} seconds.`,
            429,
            "RATE_LIMITED",
            { retry_after: parseInt(retryAfter) }
          );

        case errorMessage === "SPOTIFY_SERVER_ERROR":
          return ApiResponseBuilder.error(
            "Spotify servers are currently experiencing issues. Please try again later.",
            503,
            "SPOTIFY_SERVER_ERROR"
          );

        case errorMessage.startsWith("SPOTIFY_API_ERROR_"):
          const statusCode = errorMessage.split("_").pop();
          return ApiResponseBuilder.spotifyError(
            `Spotify API returned error ${statusCode}`,
            { spotify_status: statusCode }
          );

        default:
          return ApiResponseBuilder.error(
            "An unexpected error occurred while fetching your top tracks."
          );
      }
    }

    return ApiResponseBuilder.error("Internal server error occurred");
  }
}
