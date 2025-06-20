"use client";

import { useAuth } from "@/lib/auth/context";
import { useSpotify } from "@/lib/hooks/spotify";
import { NowPlaying } from "@/components/spotify/now-playing";
import { TopTracks } from "@/components/spotify/top-tracks";
import { RecentlyPlayed } from "@/components/spotify/recently-played";
import { UserStats } from "@/components/spotify/user-stats";
import { ListeningStats } from "@/components/spotify/listening-stats";
import { TopArtists } from "@/components/spotify/top-artists";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ParticleBackground } from "@/components/ui/particle-background";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUpIcon,
  ClockIcon,
  BarChart3Icon,
  SparklesIcon,
  MusicIcon,
  UsersIcon,
  ChevronDownIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ListeningHabits } from "@/components/spotify/listening-habits";

export default function DashboardPage() {
  const { user } = useAuth();
  const { nowPlaying } = useSpotify();
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "short_term":
        return "Last 4 weeks";
      case "medium_term":
        return "Last 6 months";
      case "long_term":
        return "All time";
      default:
        return "Last 6 months";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-background to-blue-50/30 dark:from-green-950/20 dark:via-background dark:to-blue-950/10 relative">
      {/* Particle Background - Lowest z-index */}
      {mounted && nowPlaying?.is_playing && (
        <ParticleBackground isPlaying={nowPlaying.is_playing} intensity={1.2} />
      )}

      {/* Navbar with User Menu - Highest z-index */}
      <Navbar variant="authenticated" />

      {/* Main Content - Above particles */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-20">
        {/* Hero Section */}
        <section className="mb-12 relative z-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <SparklesIcon className="h-6 w-6 text-green-600 animate-float" />
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 border-green-500/20 font-medium"
                >
                  Live Dashboard
                </Badge>
                {nowPlaying?.is_playing && (
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/20 font-medium animate-pulse"
                  >
                    🎵 Music Playing
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <h1 className="text-display-lg text-foreground leading-tight">
                  {getGreeting()},{" "}
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {user?.user_metadata?.full_name?.split(" ")[0] ||
                      "Music Lover"}
                  </span>
                  !
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  Your personalized music analytics dashboard with real-time
                  insights, detailed statistics, and beautiful visualizations.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Period:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      {getTimeRangeLabel(timeRange)}
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setTimeRange("short_term")}
                      className={timeRange === "short_term" ? "bg-accent" : ""}
                    >
                      Last 4 weeks
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTimeRange("medium_term")}
                      className={timeRange === "medium_term" ? "bg-accent" : ""}
                    >
                      Last 6 months
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTimeRange("long_term")}
                      className={timeRange === "long_term" ? "bg-accent" : ""}
                    >
                      All time
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </section>

        {/* Now Playing */}
        <section className="mb-12 relative z-20">
          <NowPlaying />
        </section>

        {/* Stats Grid */}
        <section className="mb-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUpIcon,
                label: "TOP TRACKS",
                value: "50",
                description: "This month",
                gradient: "from-green-500/10 to-green-600/5",
                border: "border-green-500/20",
                iconColor: "text-green-600",
                dotColor: "bg-green-500",
              },
              {
                icon: ClockIcon,
                label: "RECENTLY PLAYED",
                value: "127",
                description: "Last 24 hours",
                gradient: "from-blue-500/10 to-blue-600/5",
                border: "border-blue-500/20",
                iconColor: "text-blue-600",
                dotColor: "bg-blue-500",
              },
              {
                icon: BarChart3Icon,
                label: "LISTENING TIME",
                value: "24h",
                description: "This week",
                gradient: "from-purple-500/10 to-purple-600/5",
                border: "border-purple-500/20",
                iconColor: "text-purple-600",
                dotColor: "bg-purple-500",
              },
              {
                icon: UsersIcon,
                label: "TOP ARTISTS",
                value: "32",
                description: "This month",
                gradient: "from-orange-500/10 to-orange-600/5",
                border: "border-orange-500/20",
                iconColor: "text-orange-600",
                dotColor: "bg-orange-500",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className={`bg-gradient-to-br ${stat.gradient} ${stat.border} hover:border-opacity-40 transition-all duration-300 backdrop-blur-sm group cursor-pointer relative z-20`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                      <span
                        className={`text-xs font-bold tracking-wide ${stat.iconColor}`}
                      >
                        {stat.label}
                      </span>
                    </div>
                    <div
                      className={`w-2 h-2 ${stat.dotColor} rounded-full animate-pulse`}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground font-mono">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-20">
          {/* Main Content Area */}
          <div className="xl:col-span-8 space-y-8">
            {/* Tabbed Content */}
            <Card className="backdrop-blur-sm border-border/50 relative z-20">
              <Tabs defaultValue="tracks" className="w-full">
                <div className="border-b border-border/50 px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                    <TabsTrigger value="tracks">Top Tracks</TabsTrigger>
                    <TabsTrigger value="artists">Top Artists</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="habits">Habits</TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="tracks" className="mt-0">
                    <TopTracks timeRange={timeRange} />
                  </TabsContent>

                  <TabsContent value="artists" className="mt-0">
                    <TopArtists timeRange={timeRange} />
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-0">
                    <ListeningStats />
                  </TabsContent>

                  <TabsContent value="habits" className="mt-0">
                    <ListeningHabits />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>

            {/* Recently Played */}
            <div className="relative z-20">
              <RecentlyPlayed />
            </div>
          </div>

          {/* Sidebar - existing content */}
          <div className="xl:col-span-4 space-y-8">
            <div className="relative z-20">
              <UserStats />
            </div>

            {/* Activity Feed */}
            <Card className="backdrop-blur-sm border-border/50 relative z-20">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <SparklesIcon className="h-6 w-6 text-purple-600" />
                  <h3 className="text-display-sm text-foreground">
                    Activity Feed
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      color: "bg-green-500",
                      title: "New top track discovered",
                      time: "2 hours ago",
                    },
                    {
                      color: "bg-blue-500",
                      title: "5 hours of listening today",
                      time: "Updated now",
                    },
                    {
                      color: "bg-purple-500",
                      title: "Genre preference updated",
                      time: "1 day ago",
                    },
                    {
                      color: "bg-orange-500",
                      title: "Weekly report ready",
                      time: "2 days ago",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl backdrop-blur-sm hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                    >
                      <div
                        className={`w-3 h-3 ${activity.color} rounded-full animate-pulse flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
