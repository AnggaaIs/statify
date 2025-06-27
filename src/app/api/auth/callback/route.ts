import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? null;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Create a response that will handle the redirect on the client side
      const redirectUrl = new URL(`${origin}/auth/success`);
      if (next) {
        redirectUrl.searchParams.set("redirect", next);
      }
      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  return NextResponse.redirect(
    `${origin}/?error=authentication_failed&ts=${Date.now()}`
  );
}
