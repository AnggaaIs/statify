import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { handleSpotifyError } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get("theme") || "dark";
    const userId = searchParams.get("user_id");
    const embedId = searchParams.get("embed_id");

    // For public embeds, we need to validate the embed_id and user_id
    if (!userId || !embedId) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or embed_id" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Validate embed_id against database to ensure it's authorized
    // For now, we'll use the current user's session
    const spotify = new SpotifyAPI(true);
    const data = await spotify.getCurrentPlayback();

    // Generate embed HTML even if nothing is playing
    const embedHtml = generateEmbedHtml(data, { theme });

    return new Response(embedHtml, {
      headers: {
        "Content-Type": "text/html",
        "X-Frame-Options": "ALLOWALL",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=30", // Cache for 30 seconds for real-time feel
      },
    });
  } catch (error) {
    console.error("Error in now-playing embed endpoint:", error);

    const theme = new URL(request.url).searchParams.get("theme") || "dark";
    const isDark = theme === "dark";
    const bgColor = isDark ? "#1a1a1a" : "#ffffff";

    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Statify Embed - Error</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 16px; text-align: center; background: ${bgColor}; color: #fff;">
          <div style="max-width: 400px; margin: 0 auto;">
            <h3 style="color: #ef4444; margin: 0 0 8px 0;">Unable to load playback</h3>
            <p style="color: #888; font-size: 14px; margin: 0;">Please check your embed configuration or try again later.</p>
          </div>
        </body>
      </html>
    `;

    return new Response(errorHtml, {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}

function generateEmbedHtml(data: any, options: { theme: string }) {
  const { theme } = options;

  const isDark = theme === "dark";
  const bgColor = isDark ? "#1a1a1a" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";
  const cardBg = isDark ? "#2a2a2a" : "#f8f9fa";
  const borderColor = isDark ? "#404040" : "#e5e7eb";
  const mutedColor = isDark ? "#888888" : "#6b7280";

  // Check if user is currently playing something
  const isPlaying = data?.is_playing && data?.item;

  let contentHtml = "";

  if (isPlaying) {
    const track = data.item;
    const duration = Math.floor(track.duration_ms / 1000);
    const progress = Math.floor(data.progress_ms / 1000);
    const progressPercent = (progress / duration) * 100;

    const durationFormatted = formatTime(duration);
    const progressFormatted = formatTime(progress);

    const artistNames = track.artists
      .map((artist: any) => artist.name)
      .join(", ");
    const imageUrl =
      track.album.images[1]?.url || track.album.images[0]?.url || "";

    contentHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
        <div style="position: relative; margin-bottom: 16px;">
          <img 
            src="${imageUrl}" 
            alt="${track.album.name}"
            style="width: 120px; height: 120px; border-radius: 12px; object-fit: cover; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"
            onerror="this.style.display='none'"
          />
          <div style="position: absolute; bottom: -8px; right: -8px; width: 24px; height: 24px; background: #1db954; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid ${bgColor};">
            <div style="width: 0; height: 0; border-left: 6px solid white; border-top: 3px solid transparent; border-bottom: 3px solid transparent; margin-left: 1px;"></div>
          </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 16px; width: 100%;">
          <div style="font-weight: 700; font-size: 16px; color: ${textColor}; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${track.name}
          </div>
          <div style="font-size: 14px; color: ${mutedColor}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${artistNames}
          </div>
          <div style="font-size: 12px; color: ${mutedColor}; margin-top: 4px;">
            ${track.album.name}
          </div>
        </div>
        
        <div style="width: 100%; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 11px; color: ${mutedColor};">${progressFormatted}</span>
            <span style="font-size: 11px; color: ${mutedColor};">${durationFormatted}</span>
          </div>
          <div style="width: 100%; height: 4px; background: ${borderColor}; border-radius: 2px; overflow: hidden;">
            <div style="width: ${progressPercent}%; height: 100%; background: #1db954; transition: width 1s ease;"></div>
          </div>
        </div>
        
        <a href="${track.external_urls.spotify}" target="_blank" rel="noopener noreferrer" style="color: #1db954; text-decoration: none; font-size: 12px; padding: 8px 16px; border: 1px solid #1db954; border-radius: 20px; transition: all 0.2s;">
          Open in Spotify
        </a>
      </div>
    `;
  } else {
    contentHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: ${cardBg}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border: 2px solid ${borderColor};">
          <span style="font-size: 32px;">🎵</span>
        </div>
        <div style="font-weight: 600; font-size: 16px; color: ${textColor}; margin-bottom: 8px;">
          Not playing
        </div>
        <div style="font-size: 14px; color: ${mutedColor}; max-width: 200px;">
          Start playing music on Spotify to see it here
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Statify Embed - Now Playing</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: ${bgColor};
            color: ${textColor};
            line-height: 1.4;
            padding: 16px;
          }
          
          .embed-container {
            max-width: 100%;
            margin: 0 auto;
            background: ${cardBg};
            border-radius: 12px;
            border: 1px solid ${borderColor};
            overflow: hidden;
          }
          
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid ${borderColor};
            background: ${bgColor};
          }
          
          .title {
            font-size: 14px;
            font-weight: 600;
            color: ${textColor};
            margin: 0;
          }
          
          .logo {
            font-size: 12px;
            font-weight: 600;
            color: #1db954;
            text-decoration: none;
          }
          
          .refresh-note {
            font-size: 10px;
            color: ${mutedColor};
            text-align: center;
            padding: 8px 16px;
            border-top: 1px solid ${borderColor};
            background: ${bgColor};
          }
        </style>
        <script>
          // Auto-refresh every 30 seconds for real-time updates
          setTimeout(() => {
            window.location.reload();
          }, 30000);
        </script>
      </head>
      <body>
        <div class="embed-container">
          <div class="header">
            <div class="title">▶️ Now Playing</div>
            <a href="https://statify.app" target="_blank" class="logo">Statify</a>
          </div>
          
          ${contentHtml}
          
          <div class="refresh-note">
            Updates every 30 seconds • Powered by Statify
          </div>
        </div>
      </body>
    </html>
  `;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
