"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function HomeContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const timestamp = searchParams.get("ts");

    if (error) {
      const currentTime = Date.now();
      const errorTime = timestamp ? parseInt(timestamp) : 0;
      const timeDiff = currentTime - errorTime;

      if (!timestamp || timeDiff > 10000 || timeDiff < 0) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("error");
        newUrl.searchParams.delete("error_description");
        newUrl.searchParams.delete("ts");
        window.history.replaceState({}, "", newUrl.toString());
        return;
      }

      let errorMessage = "Something went wrong";

      switch (error) {
        case "authentication_failed":
          errorMessage = "Authentication failed";
          break;
        case "access_denied":
          errorMessage = "Access denied";
          break;
        case "invalid_request":
          errorMessage = "Invalid request";
          break;
        default:
          errorMessage = error.replace(/_/g, " ");
      }

      toast.error(errorMessage, {
        description: errorDescription || "Please try again",
        duration: 5000,
      });

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      newUrl.searchParams.delete("error_description");
      newUrl.searchParams.delete("ts");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to Statify</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Your music statistics app.
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
