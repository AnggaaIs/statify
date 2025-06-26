import { NowPlayingCard } from "@/components/spotify/now-playing";
import { TopTracksCard } from "@/components/spotify/top-tracks";
import { TopArtistsCard } from "@/components/spotify/top-artists";
import { MyPlaylistsCard } from "@/components/spotify/my-playlists";

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here's what's happening with your music.
          </p>
        </div>

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
