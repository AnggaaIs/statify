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
  BarChart3,
  Music,
  Mic,
  List,
  Settings,
  Home,
  Code,
  Activity,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, loading, signInWithSpotify, signOut } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    if (!mounted) return "Hello"; // Fallback for SSR
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/statistics", label: "Statistics", icon: Activity },
    { href: "/top-tracks", label: "Top Tracks", icon: Music },
    { href: "/top-artists", label: "Top Artists", icon: Mic },
    { href: "/playlists", label: "My Playlists", icon: List },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/embed", label: "Embed Generator", icon: Code },
  ];

  return (
    <header className="navbar sticky w-full flex top-0 backdrop-blur-sm z-[9999999] border-b">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-8 w-full">
        <Link
          href="/"
          className="text-xl flex items-center font-bold hover:opacity-80 transition-opacity"
        >
          <span>Statify</span>
        </Link>
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Settings className="h-4 w-4 mr-2" />
                Control Center
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0 z-[999999999] w-96">
              <div className="p-8 pb-0">
                <SheetHeader>
                  <SheetTitle className="text-xl flex items-center gap-2 mb-2">
                    <Settings className="h-5 w-5" />
                    Control Center
                  </SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    {user
                      ? `${getGreeting()}, ${
                          user.user_metadata?.full_name || "Spotify User"
                        }`
                      : "Connect your Spotify to unlock your music insights."}
                  </SheetDescription>
                </SheetHeader>
              </div>

              <div className="flex-1 px-8 py-6 space-y-8">
                {/* User Profile Section */}
                {user && (
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || "User"}
                      />
                      <AvatarFallback className="bg-green-500 text-white">
                        {user.user_metadata?.full_name ? (
                          getUserInitials(user.user_metadata.full_name)
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.user_metadata?.full_name || "Spotify User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Connected
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connect Spotify Section */}
                {!user && (
                  <div className="text-center p-8 bg-muted/50 rounded-lg">
                    <div className="mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-12 h-12 mx-auto mb-4"
                        fill="#1DB954"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      <h3 className="font-semibold text-lg mb-2">
                        Connect to Spotify
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Unlock your personalized music insights
                      </p>
                    </div>
                    <Button
                      className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white"
                      onClick={signInWithSpotify}
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20px"
                        height="20px"
                        fill="currentColor"
                        className="mr-2"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      {loading ? "Connecting..." : "Connect with Spotify"}
                    </Button>
                  </div>
                )}

                {/* Navigation Section */}
                {user && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Navigation
                    </h4>
                    <div className="space-y-1">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link key={item.href} href={item.href}>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              className={`w-full justify-start h-10 ${
                                isActive
                                  ? "bg-secondary border border-border"
                                  : "hover:bg-muted/50"
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 mr-3 ${
                                  isActive ? "text-primary" : ""
                                }`}
                              />
                              <span className={isActive ? "font-medium" : ""}>
                                {item.label}
                              </span>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <SheetFooter className="px-8 py-6 border-t">
                {/* Theme Switcher */}
                <div className="w-full space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Appearance
                    </h4>
                    <div className="flex gap-2 w-full">
                      <Button
                        variant={
                          mounted && theme === "light" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setTheme("light")}
                        className="flex-1"
                      >
                        <SunMoon className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={
                          mounted && theme === "dark" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setTheme("dark")}
                        className="flex-1"
                      >
                        <MoonStar className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                      <Button
                        variant={
                          mounted && theme === "system" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setTheme("system")}
                        className="flex-1"
                      >
                        <MonitorCog className="h-4 w-4 mr-2" />
                        Auto
                      </Button>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  {user && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
