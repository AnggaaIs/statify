import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { handleSpotifyError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("time_range") || "medium_term";
    const limit = parseInt(searchParams.get("limit") || "20");

    const validTimeRanges = ["short_term", "medium_term", "long_term"];
    if (!validTimeRanges.includes(timeRange)) {
      return ApiResponseBuilder.badRequest(
        "Invalid time_range parameter. Must be one of: short_term, medium_term, long_term"
      );
    }

    if (limit < 1 || limit > 50) {
      return ApiResponseBuilder.badRequest(
        "Invalid limit parameter. Must be between 1 and 50"
      );
    }

    const spotify = new SpotifyAPI(true);
    const topArtists = await spotify.getTopArtists(
      timeRange as "short_term" | "medium_term" | "long_term",
      limit
    );

    if (!topArtists) {
      return ApiResponseBuilder.success(
        {
          items: [],
          total: 0,
          limit,
          offset: 0,
          next: null,
          previous: null,
        },
        "No top artists found"
      );
    }

    return ApiResponseBuilder.success(
      topArtists,
      "Top artists retrieved successfully"
    );
  } catch (error) {
    console.error("Top artists error:", error);
    return handleSpotifyError(error as Error);
  }
}
