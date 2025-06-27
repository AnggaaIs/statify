import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { handleSpotifyError } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    const spotify = new SpotifyAPI(true);
    const recentlyPlayed = await spotify.getRecentlyPlayed(limit);

    return ApiResponseBuilder.success(
      recentlyPlayed,
      "Recently played tracks retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return handleSpotifyError(error as Error);
  }
}
