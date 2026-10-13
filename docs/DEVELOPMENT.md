# Development

Built with Expo SDK 54 (React Native 0.81, React 19, TypeScript), React Navigation, and Supabase (auth + Postgres with Row Level Security).

## Local setup

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL and publishable (anon) key
npm run web            # http://localhost:8081
npm start              # Expo dev server; scan the QR code with Expo Go
```

In the Supabase dashboard:

1. **SQL Editor:** run [`supabase/schema.sql`](../supabase/schema.sql) to create the `goals` and `entries` tables and their RLS policies. The script is idempotent: re-run it after pulling schema changes (e.g. the `entries.goal_progress` column).
2. **Authentication → URL Configuration:** set the Site URL to where the app runs, so email confirmation links land in the right place.

Never put the `service_role` key in this app. The publishable key is safe in the client because RLS restricts each user to their own rows.

## Progress model

Each entry stores `goal_progress` (jsonb, `{ "<goal id>": percent }`). A goal's progress is the sum of those values across its entries, capped at 100% (`utils/progress.ts`). Entries without a stored value count as 10%.

## Web deployment

Live at https://goal-journal-app-two.vercel.app.

`npm run build:web` outputs a static site to `dist/`. On Vercel or Netlify, use build command `npm run build:web`, output directory `dist`, and set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` as environment variables. Add the deployed URL to Supabase's Site URL and Redirect URLs.

## Android APK

Builds run in the cloud with [EAS Build](https://docs.expo.dev/build/introduction/); no Android Studio needed. The `preview` profile in `eas.json` produces an installable `.apk`.

One-time setup:

```bash
npx eas-cli@latest login
npx eas-cli@latest init      # links the project to your Expo account

# .env isn't uploaded to EAS (it's git-ignored), so store the Supabase values there:
npx eas-cli@latest env:create --environment preview --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project-ref.supabase.co" --visibility plaintext
npx eas-cli@latest env:create --environment preview --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-publishable-key" --visibility plaintext
```

Build:

```bash
npx eas-cli@latest build --platform android --profile preview
```

When it finishes, EAS prints a download link and QR code. To publish it, upload the `.apk` to a GitHub Release.

For Google Play, use the `production` profile (produces an `.aab`), add the same env vars to the `production` environment, then run `npx eas-cli@latest submit --platform android`.
