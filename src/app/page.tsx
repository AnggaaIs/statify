"use client";

import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  MusicIcon,
  TrendingUpIcon,
  BarChart3Icon,
  PlayIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
} from "lucide-react";

export default function Home() {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, initialized, router]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-green-50/30 dark:from-green-950/20 dark:via-background dark:to-green-950/10">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-green-50/30 dark:from-green-950/20 dark:via-background dark:to-green-950/10">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-green-500/10 text-green-600 border-green-500/20"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Free Forever • Real-time Analytics
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Spotify Journey,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                Beautifully Visualized
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover insights about your music taste, track your listening
              habits, and get personalized analytics from your Spotify data in
              real-time. Completely free, no subscriptions needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <a href="/auth/login" className="flex items-center gap-2">
                  <PlayIcon className="h-5 w-5" />
                  Start Analyzing Free
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <a href="#demo" className="flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5" />
                  View Demo
                </a>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                100% Free Forever
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                Real-time Updates
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                Privacy Focused
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to understand your music
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get deep insights into your listening patterns with our
              comprehensive analytics suite. All features included, no premium
              tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-500/20 hover:border-green-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-4">
                  <TrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Top Tracks & Artists
                </h3>
                <p className="text-muted-foreground mb-4">
                  Discover your most played songs and favorite artists with
                  detailed rankings and statistics.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-green-600" />
                    Unlimited history tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-green-600" />
                    Detailed popularity scores
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 hover:border-blue-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
                  <PlayIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Now Playing
                </h3>
                <p className="text-muted-foreground mb-4">
                  See what you're currently listening to with real-time progress
                  tracking and device info.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-blue-600" />
                    Live progress bar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-blue-600" />
                    Device information
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-purple-500/10 rounded-lg w-fit mb-4">
                  <BarChart3Icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Listening Analytics
                </h3>
                <p className="text-muted-foreground mb-4">
                  Analyze your listening patterns with comprehensive charts and
                  statistics.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-purple-600" />
                    Genre distribution
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-purple-600" />
                    Listening time tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 hover:border-orange-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-orange-500/10 rounded-lg w-fit mb-4">
                  <UsersIcon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Profile Insights
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get detailed information about your Spotify profile and social
                  stats.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-orange-600" />
                    Complete profile analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-orange-600" />
                    Account insights
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-pink-500/10 rounded-lg w-fit mb-4">
                  <SparklesIcon className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Recently Played
                </h3>
                <p className="text-muted-foreground mb-4">
                  Keep track of your recent listening history with timestamps
                  and context.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-pink-600" />
                    Unlimited recent tracks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-pink-600" />
                    Detailed timestamps
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-cyan-500/10 rounded-lg w-fit mb-4">
                  <MusicIcon className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Music Discovery
                </h3>
                <p className="text-muted-foreground mb-4">
                  Explore new genres and discover patterns in your music taste
                  over time.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-cyan-600" />
                    Advanced genre analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-3 w-3 text-cyan-600" />
                    Trend tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              See Statify in action
            </h2>
            <p className="text-lg text-muted-foreground">
              Get a preview of your personalized music analytics dashboard
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur-xl opacity-20"></div>
            <Card className="relative border-2 border-green-500/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Now Playing Preview */}
                    <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-600">
                            Now Playing
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"></div>
                          <div className="flex-1">
                            <h4 className="font-semibold">Song Title</h4>
                            <p className="text-sm text-muted-foreground">
                              Artist Name
                            </p>
                            <div className="w-full bg-muted rounded-full h-1 mt-2">
                              <div className="bg-green-500 h-1 rounded-full w-1/3"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Stats Preview */}
                    <div className="space-y-4">
                      <Card className="bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUpIcon className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium">
                              TOP TRACKS
                            </span>
                          </div>
                          <p className="text-2xl font-bold">∞</p>
                          <p className="text-xs text-muted-foreground">
                            Unlimited
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3Icon className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium">
                              ALL FREE
                            </span>
                          </div>
                          <p className="text-2xl font-bold">$0</p>
                          <p className="text-xs text-muted-foreground">
                            Forever
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to explore your music journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of music lovers who are already discovering insights
            about their listening habits. No credit card required, no hidden
            fees.
          </p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
            asChild
          >
            <a href="/auth/login" className="flex items-center gap-2">
              <PlayIcon className="h-5 w-5" />
              Start Your Free Analysis
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
