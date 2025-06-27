import { SpotifyAPI } from "@/lib/spotify/client";
import { ApiResponseBuilder } from "@/lib/api/response";
import { handleSpotifyError } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("time_range") || "medium_term";
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 20);
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
    const data = await spotify.getTopTracks(
      timeRange as "short_term" | "medium_term" | "long_term",
      limit
    );

    if (!data?.items) {
      return new Response(JSON.stringify({ error: "No tracks found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Transform data for embed
    const tracks = data.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => ({
        name: artist.name,
        external_urls: artist.external_urls,
      })),
      album: {
        name: track.album.name,
        images: track.album.images,
      },
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      external_urls: track.external_urls,
      preview_url: track.preview_url,
    }));

    // Generate embed HTML
    const embedHtml = generateEmbedHtml(tracks, { theme, timeRange, limit });

    return new Response(embedHtml, {
      headers: {
        "Content-Type": "text/html",
        "X-Frame-Options": "ALLOWALL",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error in embed endpoint:", error);

    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Statify Embed - Error</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; text-align: center; background: #1a1a1a; color: #fff;">
          <div style="max-width: 400px; margin: 0 auto;">
            <h3 style="color: #ef4444;">Unable to load tracks</h3>
            <p style="color: #888; font-size: 14px;">Please check your embed configuration or try again later.</p>
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

function generateEmbedHtml(
  tracks: any[],
  options: { theme: string; timeRange: string; limit: number }
) {
  const { theme, timeRange, limit } = options;

  const isDark = theme === "dark";
  const bgColor = isDark ? "#1a1a1a" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";
  const cardBg = isDark ? "#2a2a2a" : "#f8f9fa";
  const borderColor = isDark ? "#404040" : "#e5e7eb";
  const mutedColor = isDark ? "#888888" : "#6b7280";

  const timeRangeLabels = {
    short_term: "Last 4 Weeks",
    medium_term: "Last 6 Months",
    long_term: "All Time",
  };

  const tracksHtml = tracks
    .map((track, index) => {
      const duration = Math.floor(track.duration_ms / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const formattedDuration = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      const artistNames = track.artists
        .map((artist: any) => artist.name)
        .join(", ");
      const imageUrl =
        track.album.images[2]?.url || track.album.images[0]?.url || "";

      return `
        <div style="display: flex; align-items: center; padding: 12px; border-radius: 8px; background: ${cardBg}; margin-bottom: 8px; transition: all 0.2s; border: 1px solid ${borderColor};">
          <div style="font-weight: 600; font-size: 14px; color: ${mutedColor}; min-width: 24px; margin-right: 12px;">
            ${index + 1}
          </div>
          <img 
            src="${imageUrl}" 
            alt="${track.album.name}"
            style="width: 48px; height: 48px; border-radius: 6px; margin-right: 12px; object-fit: cover; border: 1px solid ${borderColor};"
            onerror="this.style.display='none'"
          />
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 14px; color: ${textColor}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">
              ${track.name}
            </div>
            <div style="font-size: 12px; color: ${mutedColor}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${artistNames}
            </div>
          </div>
          <div style="font-size: 12px; color: ${mutedColor}; margin-left: 12px; margin-right: 8px;">
            ${formattedDuration}
          </div>
          <a href="${
            track.external_urls.spotify
          }" target="_blank" rel="noopener noreferrer" style="color: #1db954; text-decoration: none; font-size: 14px; padding: 4px;">
            ♪
          </a>
        </div>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Statify Embed - Top Tracks</title>
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
          }
          
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid ${borderColor};
          }
          
          .title {
            font-size: 18px;
            font-weight: 700;
            color: ${textColor};
            margin: 0;
          }
          
          .subtitle {
            font-size: 12px;
            color: ${mutedColor};
            margin: 2px 0 0 0;
          }
          
          .logo {
            font-size: 14px;
            font-weight: 600;
            color: #1db954;
            text-decoration: none;
          }
          
          .tracks-list {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 4px;
          }
          
          .tracks-list::-webkit-scrollbar {
            width: 6px;
          }
          
          .tracks-list::-webkit-scrollbar-track {
            background: ${borderColor};
            border-radius: 3px;
          }
          
          .tracks-list::-webkit-scrollbar-thumb {
            background: ${mutedColor};
            border-radius: 3px;
          }
          
          .tracks-list::-webkit-scrollbar-thumb:hover {
            background: #1db954;
          }
          
          .refresh-note {
            font-size: 11px;
            color: ${mutedColor};
            text-align: center;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid ${borderColor};
          }
        </style>
        <script>
          // Auto-refresh every 5 minutes
          setTimeout(() => {
            window.location.reload();
          }, 300000);
          
          // Add hover effects
          document.addEventListener('DOMContentLoaded', function() {
            const tracks = document.querySelectorAll('.track-item');
            tracks.forEach(track => {
              track.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              });
              track.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
              });
            });
          });
        </script>
      </head>
      <body>
        <div class="embed-container">
          <div class="header">
            <div>
              <div class="title">🎵 Top Tracks</div>
              <div class="subtitle">${
                timeRangeLabels[timeRange as keyof typeof timeRangeLabels]
              } • ${tracks.length} tracks</div>
            </div>
            <a href="https://statify.app" target="_blank" class="logo">Statify</a>
          </div>
          
          <div class="tracks-list">
            ${tracksHtml}
          </div>
          
          <div class="refresh-note">
            Updates every 5 minutes • Powered by Statify
          </div>
        </div>
      </body>
    </html>
  `;
}
