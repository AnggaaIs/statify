import { NowPlayingCard } from "@/components/spotify/now-playing";
import { TopTracksCard } from "@/components/spotify/top-tracks";

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-4 md:gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here's what's happening with your music.
          </p>
        </div>

        {/* Full width cards */}
        <div className="w-full overflow-hidden">
          <NowPlayingCard />
        </div>
        <div className="w-full overflow-hidden">
          <TopTracksCard />
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Other dashboard components */}
        </div>
      </div>
    </div>
  );
}
