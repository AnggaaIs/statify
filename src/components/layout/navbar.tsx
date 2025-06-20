"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MusicIcon,
  MoonIcon,
  SunIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth/context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface NavbarProps {
  variant?: "landing" | "authenticated" | "default";
}

export function Navbar({ variant = "landing" }: NavbarProps) {
  if (variant === "authenticated") {
    return <AuthenticatedNavbar />;
  }

  return <LandingNavbar />;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 p-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <SunIcon className="h-4 w-4 text-yellow-500" />
      ) : (
        <MoonIcon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/auth/login?message=Sign out failed. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {user?.user_metadata?.avatar_url && (
        <div className="relative">
          <Image
            src={user.user_metadata.avatar_url}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full ring-2 ring-green-500/20"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
        </div>
      )}

      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-foreground">
          {user?.user_metadata?.full_name || "Spotify User"}
        </p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSignOut} variant="destructive">
            <LogOutIcon className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LandingNavbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <nav className="border-b border-border/50 bg-card/80 backdrop-blur-lg sticky top-0 z-50 pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 py-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <MusicIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Statify</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Your Spotify Analytics
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Only show Features and Demo buttons on home page */}
            {isHomePage && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href="#features">Features</a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="#demo">Demo</a>
                </Button>
              </>
            )}

            <ThemeToggle />

            <Button size="sm" asChild className="ml-2">
              <Link href="/auth/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AuthenticatedNavbar() {
  return (
    <nav className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 py-10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <MusicIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Statify</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Your Spotify Analytics
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
