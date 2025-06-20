"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  const getErrorMessage = () => {
    switch (errorCode) {
      case "provider_email_needs_verification":
        return {
          title: "Email Verification Required",
          description:
            "Your Spotify email needs to be verified before you can sign in.",
          action: "Check your email for a verification link from Supabase.",
          icon: <Mail className="h-5 w-5 text-blue-500" />,
          variant: "default" as const,
        };
      case "access_denied":
        return {
          title: "Access Denied",
          description:
            "You denied access to the application or cancelled the login process.",
          action:
            "Please try signing in again and allow the required permissions.",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          variant: "destructive" as const,
        };
      case "invalid_request":
        return {
          title: "Invalid Request",
          description: "The authentication request was invalid or malformed.",
          action: "Please try signing in again.",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          variant: "destructive" as const,
        };
      case "unauthorized_client":
        return {
          title: "App Configuration Error",
          description:
            "The application is not authorized to use this authentication method.",
          action: "Please contact support if this issue persists.",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          variant: "destructive" as const,
        };
      case "server_error":
        return {
          title: "Server Error",
          description:
            "A temporary server error occurred during authentication.",
          action: "Please wait a moment and try signing in again.",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          variant: "destructive" as const,
        };
      default:
        return {
          title: "Authentication Error",
          description:
            errorDescription ||
            "An unknown error occurred during authentication.",
          action: "Please try signing in again.",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          variant: "destructive" as const,
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50/50 via-background to-orange-50/30 dark:from-red-950/20 dark:via-background dark:to-orange-950/10 p-4">
      <Card className="w-full max-w-md border-red-200 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{errorInfo.icon}</div>
          <CardTitle className="text-xl font-semibold">
            {errorInfo.title}
          </CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant={errorInfo.variant}>
            <AlertDescription>{errorInfo.action}</AlertDescription>
          </Alert>

          {errorCode === "provider_email_needs_verification" && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Check your Spotify email inbox</li>
                <li>2. Look for an email from Supabase</li>
                <li>3. Click the verification link</li>
                <li>4. Return here and try signing in again</li>
              </ol>
            </div>
          )}

          {errorCode === "access_denied" && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">What happened?</h4>
              <p className="text-sm text-muted-foreground">
                You cancelled the Spotify authorization or denied the app access
                to your Spotify data. To use Statify, we need permission to read
                your listening history and preferences.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>

            {errorCode === "provider_email_needs_verification" && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                I've verified my email
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Debug Info (Development Only)
              </summary>
              <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(
                  {
                    error,
                    errorCode,
                    errorDescription,
                    searchParamsAll: Object.fromEntries(searchParams.entries()),
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AuthCodeErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50/50 via-background to-orange-50/30 dark:from-red-950/20 dark:via-background dark:to-orange-950/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-5 w-5" />
          </div>
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<AuthCodeErrorFallback />}>
      <AuthCodeErrorContent />
    </Suspense>
  );
}
