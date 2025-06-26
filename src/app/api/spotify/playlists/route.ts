import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { handleSpotifyError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (limit < 1 || limit > 50) {
      return ApiResponseBuilder.badRequest(
        "Invalid limit parameter. Must be between 1 and 50"
      );
    }

    if (offset < 0) {
      return ApiResponseBuilder.badRequest(
        "Invalid offset parameter. Must be 0 or greater"
      );
    }

    const spotify = new SpotifyAPI(true);
    const playlists = await spotify.getUserPlaylists(limit, offset);

    if (!playlists) {
      return ApiResponseBuilder.success(
        {
          items: [],
          total: 0,
          limit,
          offset: 0,
          next: null,
          previous: null,
        },
        "No playlists found"
      );
    }

    return ApiResponseBuilder.success(
      playlists,
      "User playlists retrieved successfully"
    );
  } catch (error) {
    console.error("User playlists error:", error);
    return handleSpotifyError(error as Error);
  }
}
