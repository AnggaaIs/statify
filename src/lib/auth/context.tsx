"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signInWithSpotify: () => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  handleSessionExpiry: () => Promise<void>;
  handleApiError: (error: any, response?: Response) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [lastSessionCheck, setLastSessionCheck] = useState<number>(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Safe session check with comprehensive error handling
  const checkSession = async (): Promise<boolean> => {
    if (isSigningOut || isSessionExpired) {
      return false;
    }

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        // Handle specific auth errors gracefully
        if (
          error.message?.includes("Auth session missing") ||
          error.message?.includes("session_not_found") ||
          error.name === "AuthSessionMissingError"
        ) {
          console.log("No session found - user not logged in");
          return false;
        }
        console.error("Session check error:", error);
        return false;
      }

      if (!session) {
        return false;
      }

      // Check session expiry
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        console.log("Session expired");
        return false;
      }

      // Validate Spotify token only if we have a session and not signing out
      if (session.provider_token && !isSigningOut) {
        try {
          const response = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${session.provider_token}` },
          });

          if (!response.ok) {
            console.log("Spotify token invalid:", response.status);
            return false;
          }
        } catch (error) {
          console.log("Spotify token validation failed:", error);
          return false;
        }
      }

      setLastSessionCheck(now);
      return true;
    } catch (error) {
      // Comprehensive error catching
      if (
        error instanceof Error &&
        (error.message?.includes("Auth session missing") ||
          error.message?.includes("session_not_found") ||
          error.name === "AuthSessionMissingError")
      ) {
        console.log("Auth session missing - user not logged in");
        return false;
      }
      console.error("Session validation error:", error);
      return false;
    }
  };

  // Session expiry handler
  const handleSessionExpiry = async () => {
    if (isSigningOut || isSessionExpired) return;

    console.log("Session expired, logging out...");
    setIsSessionExpired(true);
    setUser(null);
    setLoading(false);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during signout:", error);
    }

    router.push(
      "/auth/login?message=Your session has expired. Please sign in again."
    );

    setTimeout(() => setIsSessionExpired(false), 1000);
  };

  // API error handler
  const handleApiError = async (
    error: any,
    response?: Response
  ): Promise<boolean> => {
    if (isSigningOut || isSessionExpired) return false;

    if (response?.status === 401) {
      try {
        const errorData = await response.json();
        if (
          errorData.code === "SPOTIFY_TOKEN_EXPIRED" ||
          errorData.code === "SESSION_EXPIRED" ||
          errorData.code === "USER_NOT_FOUND" ||
          errorData.error === "Session expired" ||
          errorData.error === "Unauthorized"
        ) {
          await handleSessionExpiry();
          return true;
        }
      } catch (e) {
        await handleSessionExpiry();
        return true;
      }
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      const isValid = await checkSession();
      if (!isValid) {
        await handleSessionExpiry();
        return true;
      }
    }

    return false;
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (isSigningOut || isSessionExpired) return;

      try {
        // Use getUser with comprehensive error handling
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          // Handle auth session missing gracefully
          if (
            error.message?.includes("Auth session missing") ||
            error.message?.includes("session_not_found") ||
            error.name === "AuthSessionMissingError"
          ) {
            console.log("No user session - setting to null");
            setUser(null);
            setLoading(false);
            setInitialized(true);
            return;
          }
          console.error("Get user error:", error);
          setUser(null);
          setLoading(false);
          setInitialized(true);
          return;
        }

        if (user) {
          // Only validate session if we have a user
          const isValidSession = await checkSession();
          if (!isValidSession && !isSigningOut) {
            await handleSessionExpiry();
            return;
          }
        }

        setUser(user);
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        // Catch any unexpected errors
        if (
          error instanceof Error &&
          (error.message?.includes("Auth session missing") ||
            error.message?.includes("session_not_found") ||
            error.name === "AuthSessionMissingError")
        ) {
          console.log(
            "Auth session missing during init - setting user to null"
          );
        } else {
          console.error("Auth initialization error:", error);
        }

        setUser(null);
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    // Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      try {
        if (event === "SIGNED_OUT") {
          setUser(null);
          setIsSigningOut(false);
          setIsSessionExpired(false);
          setInitialized(true);
        } else if (event === "TOKEN_REFRESHED" && session && !isSigningOut) {
          const isValidSession = await checkSession();
          if (isValidSession) {
            setUser(session.user);
          } else {
            await handleSessionExpiry();
            return;
          }
          setInitialized(true);
        } else if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          setIsSigningOut(false);
          setIsSessionExpired(false);
          setInitialized(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error handling auth state change:", error);
        setLoading(false);
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Periodic session check
  useEffect(() => {
    if (!user || !initialized || isSigningOut || isSessionExpired) return;

    const interval = setInterval(async () => {
      if (isSigningOut || isSessionExpired) return;

      try {
        const now = Math.floor(Date.now() / 1000);
        if (now - lastSessionCheck > 300) {
          const isValidSession = await checkSession();
          if (!isValidSession && !isSigningOut) {
            await handleSessionExpiry();
          }
        }
      } catch (error) {
        console.error("Error during periodic session check:", error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user, initialized, lastSessionCheck, isSigningOut, isSessionExpired]);

  const signInWithSpotify = async () => {
    setLoading(true);
    setIsSigningOut(false);
    setIsSessionExpired(false);

    try {
      toast.info("Redirecting to Spotify...", { duration: 2000 });

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: [
            "user-read-private",
            "user-read-email",
            "user-read-currently-playing",
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-read-recently-played",
            "user-library-read",
            "user-library-modify",
            "user-read-playback-position",
            "playlist-read-private",
            "playlist-read-collaborative",
            "playlist-modify-private",
            "playlist-modify-public",
            "user-follow-read",
            "user-follow-modify",
            "user-top-read",
            "streaming",
            "app-remote-control",
            "ugc-image-upload",
          ].join(" "),
          queryParams: {
            show_dialog: "true",
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      setLoading(false);
      toast.error("Failed to connect to Spotify. Please try again.", {
        duration: 5000,
        action: {
          label: "Retry",
          onClick: () => signInWithSpotify(),
        },
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      toast.info("Signing out...", { duration: 2000 });

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Successfully signed out!", { duration: 3000 });
    } catch (error) {
      toast.error("Error signing out. Please try again.", { duration: 4000 });
      throw error;
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        signInWithSpotify,
        signOut,
        checkSession,
        handleSessionExpiry,
        handleApiError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
