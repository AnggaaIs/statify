import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Code, Palette, Database } from "lucide-react";
import Link from "next/link";

const developers = [
  {
    name: "Angga Islami Pasya",
    role: "Backend Developer",
    github: "anggaais",
    avatar: "developer/angga.jpg",
    icon: Database,
    description: "Specializes in API development and database architecture",
  },
  {
    name: "Christian Jeremy Kusuma",
    role: "Frontend Developer",
    github: "jeremy776",
    avatar: "developer/jeremy.jpg",
    icon: Code,
    description: "Expert in React, Next.js and modern frontend technologies",
  },
  {
    name: "Wahyu Pamungkas",
    role: "UI/UX Designer",
    github: "devstore120",
    avatar: "developer/wahyu.jpg",
    icon: Palette,
    description: "Creates beautiful and intuitive user experiences",
  },
];

export default function DeveloperPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Meet Our Team</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The talented developers behind Statify who bring your music
            statistics to life
          </p>
        </div>

        {/* Developers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {developers.map((developer, index) => {
            const IconComponent = developer.icon;

            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Avatar */}
                    <Avatar className="w-24 h-24 ring-4 ring-muted group-hover:ring-primary/20 transition-all">
                      <AvatarImage
                        src={developer.avatar}
                        alt={developer.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xl font-bold">
                        {developer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name and Role */}
                    <div className="space-y-2">
                      <CardTitle className="text-xl">
                        {developer.name}
                      </CardTitle>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {developer.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-center text-sm text-muted-foreground">
                    {developer.description}
                  </p>

                  {/* GitHub Link */}
                  <div className="flex justify-center">
                    <Link
                      href={`https://github.com/${developer.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 group-hover:bg-primary transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>@{developer.github}</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Stats */}
        <div className="grid gap-4 md:grid-cols-3 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <p className="text-sm text-muted-foreground">Commits</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Dedication</p>
            </CardContent>
          </Card>
        </div>

        {/* Contribute Section */}
        <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 border-violet-200/30 dark:border-violet-800/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Want to Contribute?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Statify is an open-source project. We welcome contributions from
                developers who are passionate about music and technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://github.com/AnggaaIs/statify"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </Button>
                </Link>
                <Link href="mailto:contribute@statify.com">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-violet-200 hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-950"
                  >
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center pt-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
