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
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedRoutes = ["/dashboard", "/top-tracks"];

  if (
    !user &&
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    // Add timestamp to track when the redirect happened
    const redirectUrl = new URL("/access-denied", request.url);
    redirectUrl.searchParams.set("reason", "no_auth");
    redirectUrl.searchParams.set("ts", Date.now().toString());
    return NextResponse.redirect(redirectUrl);
  }

  // Check if user session might be expired
  if (user) {
    try {
      // Try to refresh the session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.log("Session refresh failed:", error?.message);
        // Clear the session and redirect to home
        const redirectUrl = new URL("/", request.url);
        redirectUrl.searchParams.set("error", "session_expired");
        redirectUrl.searchParams.set("ts", Date.now().toString());

        const response = NextResponse.redirect(redirectUrl);

        // Clear auth cookies
        response.cookies.delete("sb-access-token");
        response.cookies.delete("sb-refresh-token");

        return response;
      }
    } catch (error) {
      console.error("Session check error:", error);
      // On error, allow the request to continue but log the issue
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
