import { UserProfileCard } from "@/components/spotify/user-profile";

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            View your Spotify account information, listening statistics, and
            personal details.
          </p>
        </div>

        <div className="w-full overflow-hidden">
          <UserProfileCard />
        </div>
      </div>
    </div>
  );
}
