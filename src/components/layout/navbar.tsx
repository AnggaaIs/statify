"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Grip,
  MoonStar,
  SunMoon,
  MonitorCog,
  LogOut,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, loading, signInWithSpotify, signOut } = useAuth();

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  //good morning, good afternoon, good evening, good night
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="navbar sticky w-full flex top-0 backdrop-blur-sm z-[9999999]">
      <div className="container mx-auto flex h-12 max-w-7xl items-center my-3 justify-between px-6">
        <span className="text-xl flex items-center">Statify</span>
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Grip className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-6 z-[999999999]">
              <SheetHeader>
                <SheetTitle className="text-xl">Control Center</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  {user
                    ? `${getGreeting()}, ${
                        user.user_metadata?.full_name || "Spotify User"
                      }`
                    : "Connect your Spotify to get started."}
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-4">
                {/* User Profile - only show when authenticated */}
                {user && (
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || "User"}
                      />
                      <AvatarFallback>
                        {user.user_metadata?.full_name ? (
                          getUserInitials(user.user_metadata.full_name)
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.user_metadata?.full_name || "Spotify User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Auth Button - only show Connect Spotify when not authenticated */}
                {!user && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 w-full"
                    onClick={signInWithSpotify}
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20px"
                      height="20px"
                      fill="#1DB954"
                    >
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Connect Spotify
                  </Button>
                )}

                {/* Navigation - only show when authenticated */}
                {user && (
                  <>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          //link to dashboard
                          window.location.href = "/dashboard";
                        }}
                        className="w-full justify-start"
                      >
                        📊 Dashboard
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        🎵 Top Tracks
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        🎤 Top Artists
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        📱 My Playlists
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <SheetFooter className="flex flex-col space-y-4">
                {/* Theme Switcher */}
                <div className="flex gap-2 justify-center w-full">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTheme("light")}
                  >
                    <SunMoon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTheme("dark")}
                  >
                    <MoonStar className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTheme("system")}
                  >
                    <MonitorCog className="h-5 w-5" />
                  </Button>
                </div>

                {/* Sign Out Button - only show when authenticated */}
                {user && (
                  <Button
                    variant="destructive"
                    className="flex items-center justify-center gap-2 w-full"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
