import { EmbedGenerator } from "@/components/embed/embed-generator";

export default function EmbedPage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Embed Generator</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create embeddable widgets of your Spotify statistics to share on
            your website, blog, or social media.
          </p>
        </div>

        <div className="w-full overflow-hidden">
          <EmbedGenerator />
        </div>
      </div>
    </div>
  );
}
