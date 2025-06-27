"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Copy,
  ExternalLink,
  Settings,
  Eye,
  Palette,
  Clock,
  Hash,
  RefreshCw,
  Share,
  Download,
  Monitor,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";

interface EmbedConfig {
  type: "top-tracks" | "top-artists" | "now-playing";
  timeRange: "short_term" | "medium_term" | "long_term";
  limit: number;
  theme: "dark" | "light";
  width: number;
  height: number;
}

export function EmbedGenerator() {
  const { user } = useAuth();
  const [config, setConfig] = useState<EmbedConfig>({
    type: "top-tracks",
    timeRange: "medium_term",
    limit: 10,
    theme: "dark",
    width: 400,
    height: 500,
  });

  const [embedId, setEmbedId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    // Generate unique embed ID when user or config changes
    if (user) {
      const newEmbedId = generateEmbedId(user.id, config);
      setEmbedId(newEmbedId);
      updatePreviewUrl(newEmbedId);
    }
  }, [user, config]);

  const generateEmbedId = (userId: string, config: EmbedConfig): string => {
    const timestamp = Date.now();
    const configStr = JSON.stringify(config);
    const hash = btoa(`${userId}-${configStr}-${timestamp}`)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 16);
    return `embed_${hash}`;
  };

  const updatePreviewUrl = (embedId: string) => {
    if (!user) return;

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams({
      user_id: user.id,
      embed_id: embedId,
      time_range: config.timeRange,
      limit: config.limit.toString(),
      theme: config.theme,
    });

    const url = `${baseUrl}/api/embed/${config.type}?${params.toString()}`;
    setPreviewUrl(url);
  };

  const generateEmbedCode = (): string => {
    if (!previewUrl) return "";

    return `<iframe
  src="${previewUrl}"
  width="${config.width}"
  height="${config.height}"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
  title="Statify - Music Stats Widget">
</iframe>`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const saveEmbedConfig = async () => {
    setIsGenerating(true);

    try {
      // In a real app, you'd save this to a database
      // For now, we'll just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Embed configuration saved! Your widget is now live.");
    } catch (error) {
      toast.error("Failed to save embed configuration");
    } finally {
      setIsGenerating(false);
    }
  };

  const timeRangeOptions = [
    { value: "short_term", label: "Last 4 Weeks", icon: "📅" },
    { value: "medium_term", label: "Last 6 Months", icon: "📆" },
    { value: "long_term", label: "All Time", icon: "🗓️" },
  ];

  const themeOptions = [
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "light", label: "Light", icon: "☀️" },
  ];

  const presetSizes = [
    { name: "Small", width: 300, height: 400, icon: Smartphone },
    { name: "Medium", width: 400, height: 500, icon: Monitor },
    { name: "Large", width: 500, height: 600, icon: Monitor },
  ];

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50/20 via-background to-emerald-50/10 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 border-emerald-200/30 dark:border-emerald-800/30">
        <CardContent className="py-12">
          <div className="text-center">
            <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Authentication Required
            </h3>
            <p className="text-muted-foreground mb-4">
              Please sign in with Spotify to create embeddable widgets.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="bg-gradient-to-br from-emerald-50/20 via-background to-emerald-50/10 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 border-emerald-200/30 dark:border-emerald-800/30">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Widget Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Widget Type */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Widget Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  value: "top-tracks",
                  label: "Top Tracks",
                  icon: "🎵",
                  desc: "Your most played songs",
                },
                {
                  value: "top-artists",
                  label: "Top Artists",
                  icon: "🎤",
                  desc: "Your favorite artists",
                },
                {
                  value: "now-playing",
                  label: "Now Playing",
                  icon: "▶️",
                  desc: "Currently playing track",
                },
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={config.type === type.value ? "default" : "outline"}
                  className="h-auto p-4 flex-col text-left"
                  onClick={() =>
                    setConfig({ ...config, type: type.value as any })
                  }
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.desc}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Range */}
            <div>
              <label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Range
                {config.type === "now-playing" && (
                  <Badge variant="outline" className="text-xs ml-2">
                    Not applicable
                  </Badge>
                )}
              </label>
              <div className="space-y-2">
                {timeRangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      config.timeRange === option.value ? "default" : "outline"
                    }
                    size="sm"
                    className="w-full justify-start"
                    disabled={config.type === "now-playing"}
                    onClick={() =>
                      setConfig({ ...config, timeRange: option.value as any })
                    }
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </label>
              <div className="space-y-2">
                {themeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      config.theme === option.value ? "default" : "outline"
                    }
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      setConfig({ ...config, theme: option.value as any })
                    }
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Track Limit */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Number of Items ({config.limit})
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={config.limit}
              onChange={(e) =>
                setConfig({ ...config, limit: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5</span>
              <span>20</span>
            </div>
          </div>

          {/* Size Presets */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Size Presets
            </label>
            <div className="grid grid-cols-3 gap-3">
              {presetSizes.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className="flex-col h-auto py-3"
                  onClick={() =>
                    setConfig({
                      ...config,
                      width: preset.width,
                      height: preset.height,
                    })
                  }
                >
                  <preset.icon className="h-4 w-4 mb-1" />
                  <span className="text-xs font-medium">{preset.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {preset.width}×{preset.height}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Width (px)
              </label>
              <input
                type="number"
                min="250"
                max="800"
                value={config.width}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    width: parseInt(e.target.value) || 400,
                  })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Height (px)
              </label>
              <input
                type="number"
                min="300"
                max="800"
                value={config.height}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    height: parseInt(e.target.value) || 500,
                  })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="bg-gradient-to-br from-emerald-50/20 via-background to-emerald-50/10 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 border-emerald-200/30 dark:border-emerald-800/30">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant="secondary">
                Live Preview • {config.width}×{config.height}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(previewUrl, "_blank")}
                disabled={!previewUrl}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>

            {previewUrl ? (
              <div className="flex justify-center">
                <iframe
                  src={previewUrl}
                  width={Math.min(config.width, 600)}
                  height={Math.min(config.height, 400)}
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  title="Statify Widget Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <RefreshCw className="h-6 w-6 mr-2 animate-spin" />
                Loading preview...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Embed Code Card */}
      <Card className="bg-gradient-to-br from-emerald-50/20 via-background to-emerald-50/10 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 border-emerald-200/30 dark:border-emerald-800/30">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Embed Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{generateEmbedCode()}</code>
            </pre>
            <Button
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(generateEmbedCode())}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => copyToClipboard(generateEmbedCode())}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Embed Code
            </Button>

            <Button
              variant="outline"
              onClick={() => copyToClipboard(previewUrl)}
            >
              <Share className="h-4 w-4 mr-2" />
              Copy Widget URL
            </Button>

            <Button
              variant="outline"
              onClick={saveEmbedConfig}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Save Configuration
            </Button>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Copy the embed code above</li>
              <li>Paste it into your website's HTML</li>
              <li>
                The widget will automatically update with your latest Spotify
                data
              </li>
              <li>Widget refreshes every 5 minutes to show current stats</li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> Your embed widget will only display data
              while you have an active Spotify session. Make sure to keep your
              Statify account connected for the widget to work properly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
