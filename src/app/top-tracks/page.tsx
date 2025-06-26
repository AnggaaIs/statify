import { NowPlayingCard } from "@/components/spotify/now-playing";
import {
  TopTracksCard,
  TopTracksDetails,
} from "@/components/spotify/top-tracks";

export default function TopTracksPage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Top Tracks</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Discover your most played songs with detailed statistics and
            insights from your Spotify listening history.
          </p>
        </div>

        <div className="w-full overflow-hidden">
          <TopTracksDetails />
        </div>
      </div>
    </div>
  );
}
