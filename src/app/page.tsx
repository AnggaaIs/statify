"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import {
  BarChart3,
  Music,
  Mic,
  List,
  ArrowRight,
  Users,
  Headphones,
  Star,
  TrendingUp,
} from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const { user, signInWithSpotify, loading } = useAuth();

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const timestamp = searchParams.get("ts");

    if (error) {
      const currentTime = Date.now();
      const errorTime = timestamp ? parseInt(timestamp) : 0;
      const timeDiff = currentTime - errorTime;

      if (!timestamp || timeDiff > 10000 || timeDiff < 0) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("error");
        newUrl.searchParams.delete("error_description");
        newUrl.searchParams.delete("ts");
        window.history.replaceState({}, "", newUrl.toString());
        return;
      }

      let errorMessage = "Something went wrong";

      switch (error) {
        case "authentication_failed":
          errorMessage = "Authentication failed";
          break;
        case "access_denied":
          errorMessage = "Access denied";
          break;
        case "invalid_request":
          errorMessage = "Invalid request";
          break;
        case "token_expired":
        case "session_expired":
          errorMessage = "Your session has expired";
          break;
        case "no_access_token":
          errorMessage = "Authentication required";
          break;
        case "invalid_token":
          errorMessage = "Invalid authentication token";
          break;
        default:
          errorMessage = error.replace(/_/g, " ");
      }

      toast.error(errorMessage, {
        description: errorDescription || "Please try again",
        duration: 5000,
      });

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      newUrl.searchParams.delete("error_description");
      newUrl.searchParams.delete("ts");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  const features = [
    {
      icon: BarChart3,
      title: "Personal Dashboard",
      description:
        "Get a comprehensive overview of your music listening habits and statistics",
    },
    {
      icon: Music,
      title: "Top Tracks",
      description:
        "Discover your most played songs across different time periods",
    },
    {
      icon: Mic,
      title: "Favorite Artists",
      description:
        "See which artists dominate your playlists and listening history",
    },
    {
      icon: List,
      title: "Playlist Analytics",
      description:
        "Analyze your playlists and discover patterns in your music taste",
    },
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "10K+" },
    { icon: Headphones, label: "Songs Analyzed", value: "2M+" },
    { icon: Star, label: "User Rating", value: "4.9/5" },
    { icon: TrendingUp, label: "Growth Rate", value: "150%" },
  ];

  if (user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-6">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected to Spotify
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome back,{" "}
              {user.user_metadata?.full_name?.split(" ")[0] || "Music Lover"}
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Ready to dive into your music insights? Explore your listening
              habits and discover new patterns.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="px-8">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/top-tracks">
                <Button variant="outline" size="lg" className="px-8">
                  <Music className="mr-2 h-5 w-5" />
                  Top Tracks
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Music, Visualized
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover insights about your music taste. Analyze your listening
            habits, explore your top tracks and artists, and dive deep into your
            musical journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-8 py-3"
              onClick={signInWithSpotify}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
                fill="currentColor"
                className="mr-3"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              {loading ? "Connecting..." : "Connect with Spotify"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Free • No credit card required
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Unlock Your Music Insights
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get detailed analytics about your listening habits and discover
              new patterns in your music taste.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <Card className="p-8">
            <CardContent>
              <h3 className="text-2xl font-bold mb-4">
                Ready to explore your music journey?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                Connect your Spotify account now and start discovering insights
                about your listening habits.
              </p>
              <Button
                size="lg"
                className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-8"
                onClick={signInWithSpotify}
                disabled={loading}
              >
                <Music className="mr-2 h-5 w-5" />
                {loading ? "Connecting..." : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
