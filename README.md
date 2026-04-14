# jlav.io

Personal portfolio and resume site built with Angular 19, deployed on Vercel.

## Pages

- **Landing** (`/`) — A grid of squares that explodes outward driven by scroll position. Each box scatters along a randomized 3D vector using `translate3d` and `rotate`, with the grid component accepting a `setProgress(0–1)` value from the scroll container. Reaching the bottom navigates to the dashboard.

- **Dashboard** (`/dashboard`) — A terminal window styled after Neovim with the Catppuccin color scheme. Go-like source code types itself out character by character at variable speed, simulating natural typing cadence. Syntax-highlighted tokens double as navigation links to other pages. Window control buttons (close, minimize, maximize) trigger page navigation and CSS animations.

- **About** (`/about`) — Two paper-styled cards with box shadows, line textures, and dog-ear corners. The "About this Site" card flips on the Y-axis with a keyframed curl animation (`scaleX` + `skewY`) to reveal Projects and Resume content on its back face.

- **Projects** (`/projects`) — Fetches repositories and README content live from GitHub via a Vercel serverless function. Cards reveal with a staggered scroll-triggered entrance animation using `IntersectionObserver`. Expanding a card renders the repo's README as HTML inline.

- **Birdcam** (`/birds`) — Hidden page that streams a live Birdify bird feeder camera. Passphrase-protected via a serverless function that validates credentials and returns the HLS stream URL. Playback handled by `hls.js`.

## Architecture

```
src/app/
├── components/        # Reusable components (grid)
├── containers/        # Page-level components
│   ├── landing/       # Scroll-driven grid animation
│   ├── dashboard/     # Terminal typewriter effect
│   ├── about/         # Paper cards with flip animation
│   ├── projects/      # Dynamic GitHub project listing
│   ├── birdcam/       # HLS live stream player
│   └── resume/
├── services/          # Typewriter service
├── app.routes.ts      # Client-side routing
└── app.config.ts      # Providers (router, http, animations)

api/                   # Vercel serverless functions
├── birdcam.ts         # Passphrase validation + stream URL
└── projects.ts        # GitHub API proxy with caching
```

## Stack

- **Framework**: Angular 19 (standalone components)
- **Hosting**: Vercel (static build + serverless functions)
- **Styling**: Component-scoped SCSS, CSS transforms and keyframe animations
- **Streaming**: Nginx RTMP→HLS on Raspberry Pi, exposed via Tailscale Funnel, played with hls.js
- **GitHub integration**: REST API for repos/READMEs, GraphQL API for pinned repos (when token configured)

## Environment Variables (Vercel)

| Variable | Purpose |
|---|---|
| `BIRDCAM_PASSPHRASE` | Passphrase to access the bird feeder stream |
| `BIRDCAM_STREAM_URL` | HLS `.m3u8` endpoint for the camera |
| `BIRDCAM_API_URL` | Base URL for the bird detection catalog API (e.g. `https://pi.tailnet.ts.net`) |
| `GITHUB_TOKEN` | Optional — enables pinned repo fetching and higher rate limits |

## Development

```bash
npm install
ng serve          # http://localhost:4200
```

Serverless functions run automatically when deployed to Vercel, or locally with `vercel dev`.
