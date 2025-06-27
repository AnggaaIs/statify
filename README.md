# Statify - Spotify Music Analytics

A beautiful, modern web application that provides real-time Spotify analytics, built with Next.js 15 and TypeScript.

## ✨ Features

### 📊 Spotify Analytics

- **Now Playing**: Real-time track information with album art
- **Top Tracks**: Your most played songs with time ranges
- **Top Artists**: Discover your favorite artists
- **Playlists**: Browse and manage your Spotify playlists
- **User Profile**: Comprehensive Spotify profile insights

### 🎨 Modern UI/UX

- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: System preference aware theming
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Loading States**: Beautiful skeleton loaders
- **Error Handling**: Graceful error management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Spotify Developer Account
- Supabase Account (for authentication)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/statify.git
cd statify
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Environment Setup**
   Create a `.env.local` file:

```bash
# Spotify API
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Supabase Auth
- **APIs**: Spotify Web API
- **Deployment**: Vercel (recommended)

## 🔧 Configuration

### Spotify Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:3000/api/auth/callback`
4. Copy Client ID and Secret

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Settings > API
3. Copy URL and anon key
4. Enable Spotify OAuth in Authentication settings

## 📱 Features Showcase

## 📋 Features Overview

### Dashboard (`/dashboard`)

- Now Playing card with Spotify integration
- Top tracks and artists
- Playlists overview

### Navigation

- Responsive navbar with control center
- User profile integration
- Dark/light mode toggle
- Quick access to all features

## 🎯 Roadmap

- [ ] Real-time listening history
- [ ] Music discovery recommendations
- [ ] Advanced analytics and insights
- [ ] Playlist management features
- [ ] Social sharing capabilities
- [ ] Export data functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

If you have any questions or need help, please open an issue or contact the maintainers.

---

Made with ❤️ for music lovers who want beautiful Spotify analytics!
