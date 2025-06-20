"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangleIcon,
  RefreshCwIcon,
  HomeIcon,
  BugIcon,
  WifiOffIcon,
  CompassIcon,
} from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  userContext?: {
    isAuthenticated: boolean;
    user?: any;
  };
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
  userContext?: {
    isAuthenticated: boolean;
    user?: any;
  };
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          userContext={this.props.userContext}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  resetError,
  userContext,
}: ErrorFallbackProps) {
  const getErrorType = (error: Error | null) => {
    if (!error) return "unknown";

    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "network";
    } else if (message.includes("auth") || message.includes("unauthorized")) {
      return "auth";
    } else if (message.includes("not found") || message.includes("404")) {
      return "notFound";
    } else if (message.includes("rate limit")) {
      return "rateLimit";
    }

    return "generic";
  };

  const errorType = getErrorType(error);
  const isAuthenticated = userContext?.isAuthenticated || false;

  // Smart navigation based on user context
  const navigateHome = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/";
    }
  };

  const navigateToAuth = () => {
    window.location.href = "/auth/login";
  };

  const getHomeLabel = () => {
    return isAuthenticated ? "Go to Dashboard" : "Go Home";
  };

  const getHomeIcon = (): React.ElementType => {
    return isAuthenticated ? CompassIcon : HomeIcon;
  };

  const HomeIcon = getHomeIcon();

  const errorConfig = {
    network: {
      icon: WifiOffIcon,
      title: "Connection Error",
      description:
        "Unable to connect to the server. Please check your internet connection.",
      badge: "Network Error",
      badgeVariant: "destructive" as const,
      actions: [
        {
          label: "Retry",
          action: resetError,
          icon: RefreshCwIcon,
          variant: "default" as const,
        },
        {
          label: getHomeLabel(),
          action: navigateHome,
          icon: HomeIcon,
          variant: "outline" as const,
        },
      ],
    },
    auth: {
      icon: AlertTriangleIcon,
      title: "Authentication Error",
      description:
        "Your session has expired or you don't have permission to access this resource.",
      badge: "Auth Error",
      badgeVariant: "destructive" as const,
      actions: isAuthenticated
        ? [
            {
              label: "Try Again",
              action: resetError,
              icon: RefreshCwIcon,
              variant: "default" as const,
            },
            {
              label: getHomeLabel(),
              action: navigateHome,
              icon: HomeIcon,
              variant: "outline" as const,
            },
          ]
        : [
            {
              label: "Sign In",
              action: navigateToAuth,
              icon: RefreshCwIcon,
              variant: "default" as const,
            },
            {
              label: "Go Home",
              action: navigateHome,
              icon: HomeIcon,
              variant: "outline" as const,
            },
          ],
    },
    rateLimit: {
      icon: AlertTriangleIcon,
      title: "Rate Limit Exceeded",
      description: "Too many requests. Please wait a moment and try again.",
      badge: "Rate Limited",
      badgeVariant: "secondary" as const,
      actions: [
        {
          label: "Try Again",
          action: resetError,
          icon: RefreshCwIcon,
          variant: "default" as const,
        },
        {
          label: getHomeLabel(),
          action: navigateHome,
          icon: HomeIcon,
          variant: "outline" as const,
        },
      ],
    },
    generic: {
      icon: BugIcon,
      title: "Something went wrong",
      description: "An unexpected error occurred. Our team has been notified.",
      badge: "Error",
      badgeVariant: "destructive" as const,
      actions: [
        {
          label: "Try Again",
          action: resetError,
          icon: RefreshCwIcon,
          variant: "default" as const,
        },
        {
          label: getHomeLabel(),
          action: navigateHome,
          icon: HomeIcon,
          variant: "outline" as const,
        },
      ],
    },
    notFound: {
      icon: AlertTriangleIcon,
      title: "Resource Not Found",
      description: "The requested resource could not be found.",
      badge: "Not Found",
      badgeVariant: "secondary" as const,
      actions: [
        {
          label: getHomeLabel(),
          action: navigateHome,
          icon: HomeIcon,
          variant: "default" as const,
        },
      ],
    },
  };

  type ErrorType = keyof typeof errorConfig;
  const safeErrorType: ErrorType =
    errorType in errorConfig ? (errorType as ErrorType) : "generic";
  const config = errorConfig[safeErrorType];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50/50 via-background to-orange-50/30 dark:from-red-950/20 dark:via-background dark:to-orange-950/10 p-4">
      <Card className="w-full max-w-md border-red-200 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <config.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-xl">{config.title}</CardTitle>
            <Badge variant={config.badgeVariant}>{config.badge}</Badge>
          </div>
          <p className="text-muted-foreground">{config.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User Context Info */}
          {userContext && (
            <div className="flex items-center justify-center gap-2 p-2 bg-muted/30 rounded-lg">
              <div
                className={`w-2 h-2 rounded-full ${
                  isAuthenticated ? "bg-green-500" : "bg-orange-500"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {isAuthenticated
                  ? `Signed in as ${
                      userContext.user?.user_metadata?.full_name ||
                      userContext.user?.email
                    }`
                  : "Not signed in"}
              </span>
            </div>
          )}

          {process.env.NODE_ENV === "development" && error && (
            <details className="text-xs bg-muted p-3 rounded-lg">
              <summary className="cursor-pointer font-medium mb-2">
                Error Details (Development)
              </summary>
              <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400">
                {error.message}
              </pre>
              {error.stack && (
                <pre className="whitespace-pre-wrap text-xs text-muted-foreground mt-2">
                  {error.stack}
                </pre>
              )}
            </details>
          )}

          <div className="flex flex-col gap-2">
            {config.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.action}
                className="w-full flex items-center gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ErrorBoundary;
export { DefaultErrorFallback };
export type { ErrorFallbackProps };
