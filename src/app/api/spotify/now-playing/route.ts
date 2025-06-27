import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { handleSpotifyError } from "@/lib/utils";

export async function GET() {
  try {
    const spotify = new SpotifyAPI(true);
    const current_track = await spotify.getCurrentlyPlaying();

    console.log(
      "Raw Spotify API response:",
      JSON.stringify(current_track, null, 2)
    );

    if (!current_track) {
      return ApiResponseBuilder.success(
        {
          is_playing: false,
          current_track: null,
          device: null,
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
      device: current_track.device
        ? {
            name: current_track.device.name,
            type: current_track.device.type,
            volume_percent: current_track.device.volume_percent,
          }
        : null,
      context: current_track.context,
    };

    console.log("Device info from Spotify:", current_track.device);
    console.log("Processed response:", response_data);

    return ApiResponseBuilder.success(
      response_data,
      "Currently playing track retrieved successfully"
    );
  } catch (error) {
    console.error("Now playing error:", error);

    if (error instanceof Error) {
      return handleSpotifyError(error);
    }

    return ApiResponseBuilder.error("Internal server error occurred");
  }
}
