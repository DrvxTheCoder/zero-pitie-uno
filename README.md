# Zéro Pitié — UNO No Mercy league

Leaderboard for UNO No Mercy games. Next.js 16 · TypeScript · Tailwind CSS 4 · Prisma 7 · SQLite. Installable as a PWA.

- **Leagues** are the accounts: each friend group logs in with a league name and password.
- **Games**: "Démarrer" opens a 5-minute rolling timer that gets livelier as time runs out. At zero there's a time's-up burst, then you pick the winner (+1) and the loser (−1).
- **Seasons**: 30 days each, counted from the league's creation. Best +/− wins the season. Ties go to more wins, then fewer games.
- **Back office** at `/admin`: every league and player, create leagues, reset a league password (logs out its devices), delete leagues or players.
- French by default, English toggle (saved in a cookie).

## Getting started

```bash
cp .env.example .env        # set ADMIN_PASSWORD (8+ characters)
npm install                 # also generates the Prisma client
npm run setup               # applies migrations + creates the admin account
npm run dev                 # http://localhost:3000
```

The admin account is the only thing the seed creates. It reads `ADMIN_USERNAME` (default `admin`) and `ADMIN_PASSWORD` from `.env`. Running `npm run db:seed` again resets that admin's password to the current `.env` value.

Production: `npm run build && npm start`.

### Docker

```bash
echo 'ADMIN_PASSWORD=change-me-please' > .env
docker compose up -d --build
```

On each start the container applies migrations, re-syncs the admin from the environment, and starts on port 3000. The database lives in the `zp-data` volume. Put it behind your reverse proxy with HTTPS (needed for the PWA install prompt). Cookies switch to `Secure` automatically when the proxy sends `X-Forwarded-Proto: https`.

`TZ` (default `Africa/Dakar`) sets the server time zone, so server-rendered dates match what phones show.

### Environment

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `file:./data/zeropitie.db` | SQLite file |
| `ADMIN_USERNAME` | `admin` | Back-office login (seed) |
| `ADMIN_PASSWORD` | (required) | Back-office password (seed) |
| `ALLOW_SIGNUP` | `true` | `false` = only the back office can create leagues |
| `COOKIE_SECURE` | `false` | Force `Secure` cookies |

### Database changes

Edit `prisma/schema.prisma`, then `npm run db:migrate -- --name what_changed`. That creates a migration in `prisma/migrations` and applies it locally.

## Project structure

```
prisma/
  schema.prisma              League, Player, Game, Session, Admin, AdminSession
  migrations/                SQL migrations
  seed.ts                    creates/updates the admin account only
public/
  sw.js                      service worker (offline page, asset cache)
  icons/                     PWA icons
src/
  app/
    layout.tsx               fonts, providers, background, SW registration
    globals.css              Tailwind theme: colours, shadows, keyframes, custom utilities
    manifest.ts              PWA manifest
    (league)/                pages behind the league login
      layout.tsx             header, bottom nav, game overlay
      page.tsx               standings
      history/page.tsx
      players/page.tsx
    login/page.tsx
    admin/page.tsx
    offline/page.tsx
    actions/                 server actions: auth, players, games, admin
  components/
    ui/                      Button, ConfirmButton, IconButton, Panel, Tape, Chip, Form, Badges…
    layout/                  ArenaBackground, Header, BottomNav, Logo, AppShell
    game/                    GameProvider, TimedGame, TimerStage, RollingDigits, TimeBlocks,
                             PhaseLabel, TimesUpBurst, ResultSheet, QuickEntry, OverlayFrame
    board/                   BoardView, SeasonBanner, Podium, UnoCard, StandingsTable,
                             PlayCard, TodayPanel, GameFeed, HallOfFame
    players/  history/  admin/  auth/  pwa/
    providers/               I18nProvider, ToastProvider
    icons.tsx
  hooks/                     useGameTimer, useAutoRefresh, useInstallPrompt, useLogout
  lib/
    stats.ts  seasons.ts     scoring and season maths (pure functions)
    timer-phases.ts          the 5 timer intensity phases and their speeds
    sound.ts                 beeps and vibration cues
    i18n/                    fr.ts (source), en.ts
    server/                  session cookies, passwords, validation, rate limit, queries
    db.ts                    Prisma client (better-sqlite3 adapter)
```

Where to change things:
- **Colours, shadows, animations**: the `@theme` block in `src/app/globals.css`. The default Tailwind palette is turned off, so only the game's colours exist (`bg-red`, `text-ink`, `shadow-ink-4`…).
- **Timer feel**: `src/lib/timer-phases.ts` (thresholds, spin and wobble speeds) and `src/lib/sound.ts` (cues).
- **Game length, season length, avatar colours**: `src/lib/constants.ts`.
- **Text**: `src/lib/i18n/fr.ts` and `en.ts`.

## PWA

The app has a web manifest, icons (regular, maskable, Apple touch) and a service worker. Pages always load from the network (scores stay fresh), with a branded offline page when there is no connection. Build assets are cached.

On Android and desktop Chrome/Edge, an install button appears in the header. On iPhone, use Safari → Share → "Add to Home Screen". The service worker only registers in production builds and needs HTTPS (or `localhost`).
