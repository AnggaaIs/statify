"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiResponse } from "../api";
import { ClientAPI } from "../client-api";
import { clearSessionAndRedirect } from "../utils";

export function useSpotify() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApiCall = useCallback(
    async <T>(endpoint: string): Promise<T | null> => {
      setLoading(true);

      try {
        const result = await ClientAPI.get(endpoint);

        // ClientAPI.get already handles errors and returns null on error
        if (result === null) {
          return null;
        }

        // If result has ApiResponse structure, extract data
        if (result && typeof result === "object" && "data" in result) {
          return (result as ApiResponse<T>).data || null;
        }

        // Otherwise return result directly
        return result as T;
      } catch (error) {
        console.error("API call error:", error);
        toast.error("Something went wrong. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleApiError = async (status: number, result: ApiResponse<any>) => {
    switch (result.error!.code) {
      case "TOKEN_EXPIRED":
        toast.error("Your session has expired. Redirecting to login...");
        setTimeout(() => router.push("/?error=token_expired"), 2000);
        break;

      case "INSUFFICIENT_SCOPE":
        toast.error(
          "Missing permissions. Please reconnect your Spotify account."
        );
        setTimeout(() => router.push("/?error=insufficient_permissions"), 2000);
        break;

      case "PREMIUM_REQUIRED":
        toast.error("This feature requires Spotify Premium subscription.");
        break;

      case "NO_ACTIVE_DEVICE":
        toast.warning(
          "No active Spotify device found. Please start playing music on Spotify."
        );
        break;

      case "RATE_LIMITED":
        const retryAfter = result.error!.details?.retry_after || 60;
        toast.error(
          `Rate limited. Please wait ${retryAfter} seconds before trying again.`
        );
        break;

      case "SPOTIFY_SERVER_ERROR":
        toast.error(
          "Spotify servers are having issues. Please try again later."
        );
        break;

      default:
        toast.error(result.message || "Something went wrong with Spotify API.");
    }
  };

  // Note: handleApiError is kept for backward compatibility but ClientAPI now handles most errors

  const get_now_playing = useCallback(() => {
    return handleApiCall("/api/spotify/now-playing");
  }, [handleApiCall]);

  const get_top_tracks = useCallback(
    (timeRange: string = "medium_term", limit: number = 20) => {
      return handleApiCall(
        `/api/spotify/top-tracks?time_range=${timeRange}&limit=${limit}`
      );
    },
    [handleApiCall]
  );

  const get_top_artists = useCallback(
    (timeRange: string = "medium_term", limit: number = 20) => {
      return handleApiCall(
        `/api/spotify/top-artists?time_range=${timeRange}&limit=${limit}`
      );
    },
    [handleApiCall]
  );

  const get_user_profile = useCallback(() => {
    return handleApiCall("/api/spotify/profile");
  }, [handleApiCall]);

  const get_recently_played = useCallback(
    (limit: number = 20) => {
      return handleApiCall(`/api/spotify/recently-played?limit=${limit}`);
    },
    [handleApiCall]
  );

  const get_user_playlists = useCallback(
    (limit: number = 20, offset: number = 0) => {
      return handleApiCall(
        `/api/spotify/playlists?limit=${limit}&offset=${offset}`
      );
    },
    [handleApiCall]
  );

  const get_available_devices = useCallback(() => {
    return handleApiCall("/api/spotify/devices");
  }, [handleApiCall]);

  return {
    loading,
    get_now_playing,
    get_top_tracks,
    get_top_artists,
    get_user_profile,
    get_recently_played,
    get_user_playlists,
    get_available_devices,
  };
}
