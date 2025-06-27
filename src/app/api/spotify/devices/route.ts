import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { handleSpotifyError } from "@/lib/utils";

export async function GET() {
  try {
    const spotify = new SpotifyAPI(true);
    const devices = await spotify.getAvailableDevices();

    console.log(
      "Available devices from Spotify:",
      JSON.stringify(devices, null, 2)
    );

    return ApiResponseBuilder.success(
      devices,
      "Available devices retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching devices:", error);
    return handleSpotifyError(error as Error);
  }
}
