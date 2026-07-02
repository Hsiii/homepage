# [Homepage](https://homepage.hsichen.dev)

A fast personal browser homepage for search, bookmarks, weather, and AQI.

![Homepage](https://raw.githubusercontent.com/Hsiii/homepage/main/docs/demo.webp)

## Why

- **Fast start:** Opens with the current time, local weather, and Taiwan AQI.
- **Bookmark-first search:** Finds saved links instantly, then falls back to Google.
- **Low-friction navigation:** Keeps bookmark groups in a hoverable, lockable side panel and a mobile drawer.
- **Daily routines:** Runs repeat actions with slash commands like `/feeds`.
- **Optional personalization:** Lets signed-in users upload a wallpaper while guests keep the default mountain scene.

## Use it

- Set `https://homepage.hsichen.dev` as the browser homepage or new tab page.
- Press <kbd>Space</kbd> to search, use arrow keys to pick a result, and press <kbd>Enter</kbd> to open it.
- Type `/feeds` to open the daily feed set.
- Hover the side panel for bookmark groups, or lock it open when browsing through links.
- Click the location control to sync the nearest Taiwan weather and AQI station.

## Privacy

Core homepage features work without an account. Location is requested only when the
location control is used; the selected Taiwan location is stored in a same-site cookie
for SSR and mirrored in browser storage with the weather/AQI caches. Wallpaper sync
requires sign-in and uses the configured Clerk, Neon, and Vercel Blob services.

## Troubleshooting

If weather or AQI is missing, the relevant API key may be absent or the external API
may be unavailable. If location does not update, re-enable browser geolocation
permission and sync again. If wallpaper controls are unavailable, sign in and confirm
the personalization environment variables are configured.

## Development

### Current stack

- **Runtime and package manager:** Bun.
- **Frontend:** Next.js App Router, React 19, TypeScript, and component-level CSS files.
- **Icons:** lucide-react.
- **Auth and personalization:** Clerk for optional sign-in and user identity.
- **Storage:** Neon Postgres for wallpaper records and Vercel Blob for wallpaper files.
- **API layer:** Next route handlers in `src/app/api/`.
- **Rendering:** SSR for the homepage shell's selected location, weather, AQI, auth state, and signed-in wallpaper.
- **External data:** OpenWeatherMap for weather and Taiwan MOENV AQI data.
- **Deployment:** Vercel.

### Setup

Requires Node.js 20.x and Bun.

```bash
git clone https://github.com/Hsiii/homepage.git
cd homepage
bun i
bun dev
```

The app runs at `http://localhost:3000` by default.

### Optional environment

Copy `.env.example` to `.env.local` and fill only the services you want locally:

- `OPENWEATHERMAP_API_KEY` for weather.
- `MOENV_API_KEY` for AQI.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` for sign-in.
- `BLOB_READ_WRITE_TOKEN`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, and `NEON_BRANCH` for wallpaper persistence.

### Production

```bash
bun run build
bun run preview
```
