import { MyPlaylistsDetails } from "@/components/spotify/my-playlists";

export default function PlaylistsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">My Playlists</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Browse and manage your Spotify playlists with detailed information
            about tracks, privacy settings, and collaborators.
          </p>
        </div>

        <div className="w-full overflow-hidden">
          <MyPlaylistsDetails />
        </div>
      </div>
    </div>
  );
}
