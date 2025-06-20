"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SearchXIcon,
  HomeIcon,
  ArrowLeftIcon,
  CompassIcon,
  MusicIcon,
} from "lucide-react";
import Link from "next/link";
import { ParticleBackground } from "@/components/ui/particle-background";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth/context";

export default function NotFound() {
  const { user, loading } = useAuth();

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Navigate based on auth status
      if (user) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    }
  };

  const getReturnDestination = () => {
    return user ? "/dashboard" : "/";
  };

  const getReturnLabel = () => {
    return user ? "Back to Dashboard" : "Back to Home";
  };

  const getReturnIcon = () => {
    return user ? CompassIcon : HomeIcon;
  };

  const ReturnIcon = getReturnIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-background to-blue-50/30 dark:from-purple-950/20 dark:via-background dark:to-blue-950/10 relative flex flex-col">
      <ParticleBackground isPlaying={false} intensity={0.3} />

      <div className="relative z-20">
        <Navbar variant={user ? "authenticated" : "landing"} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text animate-pulse">
              404
            </div>
            <div className="flex items-center justify-center gap-2">
              <SearchXIcon className="h-6 w-6 text-muted-foreground" />
              <Badge variant="outline" className="text-lg py-1 px-3">
                Page Not Found
              </Badge>
            </div>
          </div>

          <Card className="backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <MusicIcon className="h-6 w-6 text-green-600" />
                Looks like this track doesn't exist
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                The page you're looking for has gone off the playlist. Let's get
                you back to the music!
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {user ? "Your Destinations" : "Popular Destinations"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/">
                    <div className="p-4 rounded-lg border border-border/50 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <HomeIcon className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                          <div className="font-medium">Home</div>
                          <div className="text-sm text-muted-foreground">
                            Landing page
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {user ? (
                    <Link href="/dashboard">
                      <div className="p-4 rounded-lg border border-border/50 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <CompassIcon className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                          <div className="text-left">
                            <div className="font-medium">Dashboard</div>
                            <div className="text-sm text-muted-foreground">
                              Music analytics
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link href="/auth/login">
                      <div className="p-4 rounded-lg border border-border/50 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <MusicIcon className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                          <div className="text-left">
                            <div className="font-medium">Get Started</div>
                            <div className="text-sm text-muted-foreground">
                              Connect Spotify
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {!loading && (
                <div className="flex items-center justify-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user ? "bg-green-500" : "bg-orange-500"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {user
                      ? `Signed in as ${
                          user.user_metadata?.full_name || user.email
                        }`
                      : "Not signed in"}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={goBack}
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Go Back
                </Button>

                <Link href={getReturnDestination()} className="flex-1">
                  <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <ReturnIcon className="h-4 w-4" />
                    {getReturnLabel()}
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  🎵{" "}
                  <em>
                    {user
                      ? "Even Spotify algorithms can't find every track. Let's get you back to your music!"
                      : "Every song has its place, this page just hasn't found its rhythm yet."}
                  </em>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
