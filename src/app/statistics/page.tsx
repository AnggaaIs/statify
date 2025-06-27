"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { StatisticsOverview } from "@/components/spotify/statistics-overview";
import { ListeningHabitsAnalysis } from "@/components/spotify/listening-habits";
import { MusicDiscoveryInsights } from "@/components/spotify/music-discovery";

export default function StatisticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/access-denied?reason=no_auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }
  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Music Statistics</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Comprehensive analysis of your music listening habits, preferences,
            and detailed statistics across all time periods.
          </p>
        </div>

        <div className="w-full overflow-hidden">
          <StatisticsOverview />
        </div>

        <div className="w-full overflow-hidden">
          <ListeningHabitsAnalysis />
        </div>

        <div className="w-full overflow-hidden">
          <MusicDiscoveryInsights />
        </div>
      </div>
    </div>
  );
}
