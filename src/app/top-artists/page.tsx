import { TopArtistsDetails } from "@/components/spotify/top-artists";

export default function TopArtistsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Top Artists</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Explore your most listened artists with detailed information about
            genres, popularity, and follower counts.
          </p>
        </div>

        <div className="w-full overflow-hidden">
          <TopArtistsDetails />
        </div>
      </div>
    </div>
  );
}
