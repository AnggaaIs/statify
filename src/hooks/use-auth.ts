"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { clearSessionAndRedirect } from "@/lib/utils";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_OUT") {
        toast("See you later!", {
          description: "You've been signed out",
        });
      }
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  const signInWithSpotify = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          scopes: [
            "user-read-email",
            "user-read-private",
            "playlist-read-private",
            "playlist-modify-public",
            "playlist-modify-private",
            "user-library-read",
            "user-library-modify",
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-read-currently-playing",
            "app-remote-control",
            "user-top-read",
            "user-follow-read",
            "streaming",
          ].join(" "),
          redirectTo: `${window.location.origin}/api/auth/callback`,

          queryParams: {
            show_dialog: "true",
          },
        },
      });

      if (error) {
        toast("Failed to connect", {
          id: "spotify-auth",
          description: error.message,
        });
      }
    } catch (error) {
      toast("Something went wrong", {
        id: "spotify-auth",
        description: "Please try again",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast("Failed to sign out", {
          id: "sign-out",
          description: error.message,
        });
      } else {
        toast("Signed out successfully", {
          id: "sign-out",
        });

        // Use the utility function to clear session and redirect
        clearSessionAndRedirect();
      }
    } catch (error) {
      toast("Something went wrong", {
        id: "sign-out",
      });
      // Even if signOut fails, clear local session
      clearSessionAndRedirect();
    }
  };

  // Function to handle session expiration
  const handleSessionExpired = () => {
    toast("Session expired", {
      description: "Your session has expired. Please login again.",
    });
    clearSessionAndRedirect();
  };

  return { user, loading, signInWithSpotify, signOut, handleSessionExpired };
}
