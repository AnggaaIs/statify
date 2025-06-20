"use client";

import { Suspense } from "react";
import { useAuth } from "@/lib/auth/context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  SparklesIcon,
  MusicIcon,
  ShieldCheckIcon,
  UserIcon,
  TrendingUpIcon,
  PlayIcon,
} from "lucide-react";

function LoginContent() {
  const { user, loading, signInWithSpotify } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const error = searchParams.get("error");
  const message = searchParams.get("message");

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithSpotify();
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-green-50/30 dark:from-green-950/20 dark:via-background dark:to-green-950/10">
        <Navbar variant="landing" />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-green-50/30 dark:from-green-950/20 dark:via-background dark:to-green-950/10">
      <Navbar variant="landing" />

      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Login Form */}
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left mb-8">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-green-500/10 text-green-600 border-green-500/20"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Free Forever
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Welcome to
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400 ml-2">
                    Statify
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground mb-2">
                  Discover your music journey with beautiful analytics
                </p>
                <p className="text-sm text-muted-foreground">
                  Connect your Spotify account to get started
                </p>
              </div>

              {(error || message) && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {message ||
                      "An error occurred during sign in. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <Card className="border-green-500/20 shadow-lg">
                <CardContent className="p-6">
                  <button
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="w-full flex justify-center items-center gap-3 py-4 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSigningIn ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    )}
                    <span className="text-lg">
                      {isSigningIn ? "Connecting..." : "Continue with Spotify"}
                    </span>
                    {!isSigningIn && (
                      <PlayIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ShieldCheckIcon className="h-3 w-3 mr-2 text-green-600" />
                      Your data is secure and private
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <UserIcon className="h-3 w-3 mr-2 text-green-600" />
                      Spotify Premium or Free account supported
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUpIcon className="h-3 w-3 mr-2 text-green-600" />
                      Real-time analytics and insights
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      By continuing, you agree to our{" "}
                      <a
                        href="#"
                        className="text-green-600 hover:text-green-700 underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-green-600 hover:text-green-700 underline"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Features Preview */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur-xl opacity-20"></div>
                <Card className="relative border-2 border-green-500/20 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-8">
                      <div className="mb-6">
                        <Badge
                          variant="secondary"
                          className="bg-green-500/10 text-green-600 border-green-500/20 mb-4"
                        >
                          <MusicIcon className="h-3 w-3 mr-1" />
                          Live Preview
                        </Badge>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          What you'll get
                        </h3>
                        <p className="text-muted-foreground">
                          Comprehensive analytics for your music taste
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Now Playing Preview */}
                        <Card className="bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-green-600">
                                Now Playing
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"></div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">
                                  Your Favorite Song
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Your Favorite Artist
                                </p>
                                <div className="w-full bg-muted rounded-full h-1 mt-2">
                                  <div className="bg-green-500 h-1 rounded-full w-1/3 transition-all duration-1000"></div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Stats Preview */}
                        <div className="grid grid-cols-2 gap-3">
                          <Card className="bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-1 mb-1">
                                <TrendingUpIcon className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-medium text-green-600">
                                  TOP TRACKS
                                </span>
                              </div>
                              <p className="text-lg font-bold">∞</p>
                              <p className="text-xs text-muted-foreground">
                                Unlimited
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-1 mb-1">
                                <SparklesIcon className="h-3 w-3 text-purple-600" />
                                <span className="text-xs font-medium text-purple-600">
                                  ALL FREE
                                </span>
                              </div>
                              <p className="text-lg font-bold">$0</p>
                              <p className="text-xs text-muted-foreground">
                                Forever
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Features List */}
                        <div className="space-y-2 mt-6">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground">
                              Real-time music tracking
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground">
                              Top tracks & artists analysis
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground">
                              Listening history insights
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground">
                              Beautiful visualizations
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-green-50/30 dark:from-green-950/20 dark:via-background dark:to-green-950/10">
      <Navbar variant="landing" />

      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Login Form Skeleton */}
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left mb-8">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <Card className="border-green-500/20 shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="h-14 w-full mb-6" />

                  <div className="space-y-3 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Skeleton className="h-3 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Features Preview Skeleton */}
            <div className="hidden lg:block">
              <Card className="border-2 border-green-500/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-8">
                    <div className="mb-6">
                      <Skeleton className="h-6 w-24 mb-4" />
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-5 w-full" />
                    </div>

                    <div className="space-y-4">
                      {/* Now Playing Preview Skeleton */}
                      <Card className="bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <Skeleton className="h-5 w-24 mb-3" />
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-24 mb-2" />
                              <Skeleton className="h-1 w-full" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Stats Preview Skeleton */}
                      <div className="grid grid-cols-2 gap-3">
                        <Card className="bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-3">
                            <Skeleton className="h-3 w-16 mb-1" />
                            <Skeleton className="h-6 w-8 mb-1" />
                            <Skeleton className="h-3 w-12" />
                          </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-3">
                            <Skeleton className="h-3 w-16 mb-1" />
                            <Skeleton className="h-6 w-8 mb-1" />
                            <Skeleton className="h-3 w-12" />
                          </CardContent>
                        </Card>
                      </div>

                      {/* Features List Skeleton */}
                      <div className="space-y-2 mt-6">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-4 w-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
