import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: session } = await supabase.auth.getSession();
    const provider_token = session.session?.provider_token;

    if (!provider_token) {
      return NextResponse.json(
        { error: "No Spotify token found" },
        { status: 401 }
      );
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        headers: {
          Authorization: `Bearer ${provider_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching recently played:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently played" },
      { status: 500 }
    );
  }
}
