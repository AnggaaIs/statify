import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  if (error) {
    const errorParams = new URLSearchParams();
    errorParams.set("error", error);
    if (errorDescription) {
      errorParams.set("error_description", errorDescription);
    }
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?${errorParams.toString()}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Error exchanging code for session:", exchangeError);
      const errorParams = new URLSearchParams();
      errorParams.set("error", "exchange_failed");
      errorParams.set("error_description", exchangeError.message);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?${errorParams.toString()}`
      );
    }
  }

  const errorParams = new URLSearchParams();
  errorParams.set("error", "no_code");
  errorParams.set("error_description", "No authorization code provided");
  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?${errorParams.toString()}`
  );
}
