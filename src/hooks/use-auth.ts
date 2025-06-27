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

  const signInWithSpotify = async (redirectTo?: string) => {
    try {
      // Store redirect URL in localStorage if provided
      if (redirectTo) {
        localStorage.setItem("auth_redirect", redirectTo);
      }

      // Create redirect URL with next parameter
      const callbackUrl = new URL(
        `${window.location.origin}/api/auth/callback`
      );
      if (redirectTo) {
        callbackUrl.searchParams.set("next", redirectTo);
      }

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
            "user-read-recently-played",
            "app-remote-control",
            "user-top-read",
            "user-follow-read",
            "streaming",
          ].join(" "),
          redirectTo: callbackUrl.toString(),

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

        clearSessionAndRedirect();
      }
    } catch (error) {
      toast("Something went wrong", {
        id: "sign-out",
      });
      clearSessionAndRedirect();
    }
  };

  const handleSessionExpired = () => {
    toast("Session expired", {
      description: "Your session has expired. Please login again.",
    });
    clearSessionAndRedirect();
  };

  return { user, loading, signInWithSpotify, signOut, handleSessionExpired };
}
