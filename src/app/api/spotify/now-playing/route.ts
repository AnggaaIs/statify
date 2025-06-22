import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";

export async function GET() {
  try {
    const spotify = new SpotifyAPI(true);
    const current_track = await spotify.getCurrentlyPlaying();

    if (!current_track) {
      return ApiResponseBuilder.success(
        {
          is_playing: false,
          current_track: null,
        },
        "No track currently playing"
      );
    }

    const response_data = {
      is_playing: current_track.is_playing,
      current_track: {
        name: current_track.item?.name,
        artist: current_track.item?.artists
          ?.map((artist: any) => artist.name)
          .join(", "),
        album: current_track.item?.album?.name,
        duration_ms: current_track.item?.duration_ms,
        progress_ms: current_track.progress_ms,
        external_urls: current_track.item?.external_urls,
        images: current_track.item?.album?.images,
        preview_url: current_track.item?.preview_url,
        track_id: current_track.item?.id,
        uri: current_track.item?.uri,
      },
      device: {
        name: current_track.device?.name,
        type: current_track.device?.type,
        volume_percent: current_track.device?.volume_percent,
      },
      context: current_track.context,
    };

    return ApiResponseBuilder.success(
      response_data,
      "Currently playing track retrieved successfully"
    );
  } catch (error) {
    console.error("Now playing error:", error);

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
          const requiredScope =
            errorMessage.split(":")[1] || "user-read-currently-playing";
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
            "No active Spotify device found. Please start playing music on Spotify.",
            404,
            "NO_ACTIVE_DEVICE"
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
            "An unexpected error occurred while fetching your current track."
          );
      }
    }

    return ApiResponseBuilder.error("Internal server error occurred");
  }
}
