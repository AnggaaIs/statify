"use client";

import { useUserProfile } from "@/lib/hooks/spotify";
import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersIcon, BarChart3Icon, SparklesIcon } from "lucide-react";

export function UserStats() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, error } = useUserProfile();

  if (!user || authLoading) {
    return null;
  }
  if (loading) {
    return (
      <Card className="relative z-30 backdrop-blur-md bg-card/95 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5 text-purple-600" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="relative z-30 backdrop-blur-md bg-card/95 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5 text-purple-600" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Stats coming soon...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative z-30 backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <BarChart3Icon className="h-5 w-5 text-purple-600" />
          Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Followers</span>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">
                {profile.followers?.total?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Country</span>
            <Badge variant="secondary" className="text-xs">
              {profile.country || "Unknown"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Product</span>
            <Badge
              variant="secondary"
              className={`text-xs ${
                profile.product === "premium"
                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  : "bg-gray-500/10 text-gray-600 border-gray-500/20"
              }`}
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              {profile.product || "Free"}
            </Badge>
          </div>

          {profile.explicit_content && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Explicit Filter
              </span>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  profile.explicit_content.filter_enabled
                    ? "bg-red-500/10 text-red-600 border-red-500/20"
                    : "bg-green-500/10 text-green-600 border-green-500/20"
                }`}
              >
                {profile.explicit_content.filter_enabled
                  ? "Enabled"
                  : "Disabled"}
              </Badge>
            </div>
          )}
        </div>

        {profile.external_urls?.spotify && (
          <div className="pt-3 border-t border-border">
            <a
              href={profile.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
            >
              View on Spotify →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
