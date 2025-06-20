import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const protectedApiRoutes = ["/api/spotify"];
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute || isProtectedApiRoute) {
    if (userError || !user) {
      console.log("No user found, redirecting to login");

      if (isProtectedApiRoute) {
        return NextResponse.json(
          {
            error: "Unauthorized",
            code: "USER_NOT_FOUND",
            message: "Please sign in to access this resource",
          },
          { status: 401 }
        );
      }

      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("message", "Please sign in to access this page");
      return NextResponse.redirect(url);
    }

    if (sessionError || !session) {
      console.log("No valid session found, redirecting to login");

      if (isProtectedApiRoute) {
        return NextResponse.json(
          {
            error: "Session expired",
            code: "SESSION_EXPIRED",
            message: "Your session has expired. Please sign in again.",
          },
          { status: 401 }
        );
      }

      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set(
        "message",
        "Your session has expired. Please sign in again."
      );
      return NextResponse.redirect(url);
    }

    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
      console.log("Session expired, redirecting to login");

      if (isProtectedApiRoute) {
        return NextResponse.json(
          {
            error: "Session expired",
            code: "SESSION_EXPIRED",
            message: "Your session has expired. Please sign in again.",
          },
          { status: 401 }
        );
      }

      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set(
        "message",
        "Your session has expired. Please sign in again."
      );
      return NextResponse.redirect(url);
    }

    if (isProtectedApiRoute && session.provider_token) {
      try {
        const spotifyResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${session.provider_token}`,
          },
        });

        if (!spotifyResponse.ok) {
          console.log("Spotify token invalid:", spotifyResponse.status);
          return NextResponse.json(
            {
              error: "Spotify token expired",
              code: "SPOTIFY_TOKEN_EXPIRED",
              message:
                "Your Spotify authentication has expired. Please sign in again.",
            },
            { status: 401 }
          );
        }
      } catch (error) {
        console.log("Spotify token check failed:", error);
        return NextResponse.json(
          {
            error: "Spotify token validation failed",
            code: "SPOTIFY_TOKEN_ERROR",
            message:
              "Unable to validate your Spotify authentication. Please sign in again.",
          },
          { status: 401 }
        );
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && session && ["/auth/login", "/"].includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
