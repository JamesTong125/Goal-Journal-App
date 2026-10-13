# Goal Journal

A goal-tracking and journaling app built with React Native and Expo. Set goals, write journal entries tied to them, and watch your progress grow. Data syncs through Supabase, so you can sign in on the web or your phone and see the same goals and entries.

## Features

- Create goals with a category, description, and optional target date
- Write journal entries with a mood and link them to one or more goals
- Goal progress calculated from linked entries (10% per entry, capped at 100%)
- Email/password accounts with cloud sync across devices
- Runs on web, iOS, and Android from one codebase

## Tech stack

- [Expo](https://expo.dev) SDK 54, React Native 0.81, React 19, TypeScript
- [React Navigation](https://reactnavigation.org) (bottom tabs + native stack)
- [Supabase](https://supabase.com) for auth and Postgres storage, secured with Row Level Security

## Getting started

### Prerequisites

- Node.js 20+
- A free [Supabase](https://supabase.com) project
- Optional: [Expo Go](https://expo.dev/go) on your phone

### 1. Install dependencies

```bash
git clone https://github.com/JamesTong125/Goal-Journal-App.git
cd Goal-Journal-App
npm install
```

### 2. Configure Supabase

1. In the Supabase dashboard, open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `goals` and `entries` tables and the policies that restrict each user to their own data.
2. Copy the env template and fill in your project URL and publishable (anon) key from **Project Settings → API**:

   ```bash
   cp .env.example .env
   ```

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   ```

   `.env` is git-ignored. Never put the `service_role` key in this app.

3. Under **Authentication → URL Configuration**, set the Site URL to where you run the app (e.g. `http://localhost:8081`) so email confirmation links land in the right place.

### 3. Run the app

```bash
npm run web      # open in the browser at http://localhost:8081
npm start        # start Expo; scan the QR code with Expo Go, or press a / i / w
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run web` | Start the dev server and open the web app |
| `npm run build:web` | Build a static web bundle into `dist/` |
| `npm run android` / `npm run ios` | Build and run a native app (requires Android Studio / Xcode) |

## Deploying the web app

`npm run build:web` produces a static site in `dist/` that any static host can serve. The Supabase env vars are baked in at build time, so set them on your host.

**Vercel / Netlify**

1. Import the GitHub repo.
2. Build command: `npm run build:web` — Output directory: `dist`
3. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
4. Add your deployed URL to Supabase **Authentication → URL Configuration** (Site URL and Redirect URLs).

**EAS Hosting**

```bash
npm run build:web
npx eas-cli@latest deploy
```

## Project structure

```
├── App.tsx              # Navigation and auth gating
├── screens/             # Home, Journal, Goals, detail, create, and auth screens
├── components/          # GoalCard, JournalEntryCard
├── data/                # AuthContext (session) and DataContext (Supabase CRUD)
├── lib/supabase.ts      # Supabase client
├── utils/confirm.ts     # Cross-platform alert/confirm helpers
├── types/               # Goal and JournalEntry types
└── supabase/schema.sql  # Database tables and Row Level Security policies
```

## Security notes

- The publishable/anon key is meant to ship in client apps. Data is protected by the Row Level Security policies in `schema.sql`, which only allow a signed-in user to read and modify their own rows.
- Don't disable RLS on the `goals` or `entries` tables.
