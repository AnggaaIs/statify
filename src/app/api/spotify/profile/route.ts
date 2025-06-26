import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { handleSpotifyError } from "@/lib/utils";

export async function GET() {
  try {
    const spotify = new SpotifyAPI(true);
    const profile = await spotify.getUserProfile();

    return ApiResponseBuilder.success(
      {
        id: profile.id,
        display_name: profile.display_name,
        email: profile.email,
        country: profile.country,
        followers: profile.followers?.total,
        images: profile.images,
        product: profile.product,
        external_urls: profile.external_urls,
      },
      "User profile retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return handleSpotifyError(error as Error);
  }
}

export async function HEAD() {
  try {
    const spotify = new SpotifyAPI(true);
    await spotify.getUserProfile();

    // If we reach here, the session is valid
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Profile HEAD check failed:", error);

    // Return appropriate error status
    if (error instanceof Error) {
      const errorMessage = error.message;
      if (
        errorMessage === "NO_ACCESS_TOKEN" ||
        errorMessage === "TOKEN_EXPIRED"
      ) {
        return new Response(null, { status: 401 });
      }
      if (errorMessage === "INVALID_TOKEN") {
        return new Response(null, { status: 401 });
      }
    }

    return new Response(null, { status: 500 });
  }
}
