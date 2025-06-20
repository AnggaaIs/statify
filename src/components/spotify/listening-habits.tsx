"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClockIcon,
  CalendarIcon,
  SunIcon,
  MoonIcon,
  CoffeeIcon,
  SunsetIcon,
} from "lucide-react";
import { RecentlyPlayedItem, useRecentlyPlayed } from "@/lib/hooks/spotify";
import { useMemo } from "react";

export function ListeningHabits() {
  const { recentlyPlayed, loading, error } = useRecentlyPlayed();

  const habitStats = useMemo(() => {
    if (!recentlyPlayed || recentlyPlayed.length === 0) {
      return {
        weeklyData: [],
        timeSlots: [],
        totalTracks: 0,
        uniqueDays: 0,
      };
    }

    const weekData: { [key: number]: RecentlyPlayedItem[] } = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    const timeData: {
      morning: RecentlyPlayedItem[];
      afternoon: RecentlyPlayedItem[];
      evening: RecentlyPlayedItem[];
      night: RecentlyPlayedItem[];
    } = {
      morning: [],
      afternoon: [],
      evening: [],
      night: [],
    };

    recentlyPlayed.forEach((item) => {
      const date = new Date(item.played_at);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      weekData[dayOfWeek as keyof typeof weekData].push(item);

      if (hour >= 6 && hour < 12) {
        timeData.morning.push(item);
      } else if (hour >= 12 && hour < 18) {
        timeData.afternoon.push(item);
      } else if (hour >= 18 && hour < 22) {
        timeData.evening.push(item);
      } else {
        timeData.night.push(item);
      }
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = Object.entries(weekData).map(([day, tracks]) => ({
      day: dayNames[parseInt(day)],
      tracks: tracks.length,
    }));

    const total = recentlyPlayed.length;
    const timeSlots = [
      {
        period: "Morning",
        icon: CoffeeIcon,
        time: "6AM - 12PM",
        count: timeData.morning.length,
        percentage:
          total > 0 ? Math.round((timeData.morning.length / total) * 100) : 0,
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
      },
      {
        period: "Afternoon",
        icon: SunIcon,
        time: "12PM - 6PM",
        count: timeData.afternoon.length,
        percentage:
          total > 0 ? Math.round((timeData.afternoon.length / total) * 100) : 0,
        color: "text-orange-600",
        bgColor: "bg-orange-500",
      },
      {
        period: "Evening",
        icon: SunsetIcon,
        time: "6PM - 10PM",
        count: timeData.evening.length,
        percentage:
          total > 0 ? Math.round((timeData.evening.length / total) * 100) : 0,
        color: "text-purple-600",
        bgColor: "bg-purple-500",
      },
      {
        period: "Night",
        icon: MoonIcon,
        time: "10PM - 6AM",
        count: timeData.night.length,
        percentage:
          total > 0 ? Math.round((timeData.night.length / total) * 100) : 0,
        color: "text-blue-600",
        bgColor: "bg-blue-500",
      },
    ];

    const uniqueDays = new Set(
      recentlyPlayed.map((item) => new Date(item.played_at).toDateString())
    ).size;

    return {
      weeklyData,
      timeSlots,
      totalTracks: total,
      uniqueDays,
    };
  }, [recentlyPlayed]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-600" />
              Listening Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || habitStats.totalTracks === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-600" />
            Listening Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {error || "No recent listening data available"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const peakDay = habitStats.weeklyData.reduce(
    (max, day) => (day.tracks > max.tracks ? day : max),
    habitStats.weeklyData[0]
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-600" />
            Weekly Pattern
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your music listening throughout the week
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {habitStats.weeklyData.map((day, index) => (
                <div key={day.day} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {day.day}
                  </div>
                  <div
                    className="bg-blue-500 rounded-sm mx-auto"
                    style={{
                      height: `${Math.max(
                        4,
                        (day.tracks /
                          Math.max(
                            ...habitStats.weeklyData.map((d) => d.tracks)
                          )) *
                          40
                      )}px`,
                      width: "20px",
                    }}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {day.tracks}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 pt-4 border-t">
              <Badge variant="secondary">
                Peak: {peakDay.day} - {peakDay.tracks} tracks
              </Badge>
              <Badge variant="outline">
                {habitStats.uniqueDays} active days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border-orange-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-orange-600" />
            Daily Listening Pattern
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            When you listen to music throughout the day
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {habitStats.timeSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <slot.icon className={`h-4 w-4 ${slot.color}`} />
                  <div>
                    <span className="text-sm font-medium">{slot.period}</span>
                    <p className="text-xs text-muted-foreground">{slot.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {slot.count} tracks
                  </span>
                  <span className="text-sm font-medium">
                    {slot.percentage}%
                  </span>
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div
                      className={`${slot.bgColor} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${slot.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
