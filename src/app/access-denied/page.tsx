"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ShieldX, Timer, LogIn } from "lucide-react";

export default function AccessDeniedPage() {
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();
  const { signInWithSpotify, loading } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Use setTimeout to avoid setState during render
          setTimeout(() => {
            router.push("/");
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [router]);

  const handleLogin = async () => {
    // Clear timer when user clicks login
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    await signInWithSpotify();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950/20 dark:via-background dark:to-gray-950/20 p-4">
      <Card className="w-full max-w-md border-red-100 dark:border-red-900/30 shadow-xl bg-gradient-to-br from-red-50/20 via-background to-red-50/10 dark:from-red-950/20 dark:via-background dark:to-red-900/10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            Access Denied
          </CardTitle>
          <p className="text-muted-foreground">
            You need to be logged in to access this page
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="bg-red-25 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-red-500 dark:text-red-400" />
              <span className="text-sm font-medium text-red-600 dark:text-red-300">
                Redirecting in
              </span>
            </div>
            <div className="text-3xl font-bold text-red-500 dark:text-red-400">
              {countdown}
            </div>
            <div className="text-sm text-muted-foreground mt-1">seconds</div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            size="lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Connecting..." : "Login with Spotify"}
          </Button>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Connect your Spotify account to access your music statistics and
              personalized insights.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
