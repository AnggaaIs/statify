"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useApiError } from "@/hooks/use-api-error";
import { NowPlayingCard } from "@/components/spotify/now-playing";
import { TopTracksCard } from "@/components/spotify/top-tracks";
import { TopArtistsCard } from "@/components/spotify/top-artists";
import { MyPlaylistsCard } from "@/components/spotify/my-playlists";

interface NowPlayingData {
  is_playing: boolean;
  current_track: {
    name: string;
    artist: string;
    duration_ms: number;
    progress_ms: number;
  } | null;
}

export default function DashboardPage() {
  const { get_now_playing } = useSpotify();
  const { handleApiError } = useApiError();
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [progress, setProgress] = useState(0);

  const fetchNowPlaying = async () => {
    try {
      const data = (await get_now_playing()) as NowPlayingData;
      setNowPlaying(data);
      if (data?.current_track?.progress_ms) {
        setProgress(data.current_track.progress_ms);
      }
    } catch (error) {
      console.error("Error fetching now playing for dashboard:", error);
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000); // Update setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (nowPlaying?.is_playing && nowPlaying?.current_track?.progress_ms) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1000;
          return Math.min(
            newProgress,
            nowPlaying.current_track?.duration_ms || 0
          );
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nowPlaying?.is_playing, nowPlaying?.current_track?.duration_ms]);

  useEffect(() => {
    if (nowPlaying?.current_track?.progress_ms !== undefined) {
      setProgress(nowPlaying.current_track.progress_ms);
    }
  }, [nowPlaying?.current_track]);

  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here's what's happening with your music.
          </p>
        </div>

        {/* Now Playing */}
        <div className="w-full overflow-hidden">
          <NowPlayingCard />
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          <div className="w-full overflow-hidden">
            <TopTracksCard />
          </div>
          <div className="w-full overflow-hidden">
            <TopArtistsCard />
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <MyPlaylistsCard />
        </div>
      </div>
    </div>
  );
}
