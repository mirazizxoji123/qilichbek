# QUICKSTAY

A responsive, multilingual Next.js App Router hotel discovery and booking demonstration. Uzbek is the default language; Russian and English are available in the persistent language selector. Seeded hotel listings are demonstration data, not live inventory.

## Install and run

```powershell
npm ci
npm run dev
```

Production checks:

```powershell
npm run check:json
npm run typecheck
npm run lint
npm run build
```

The checked-in `package-lock.json` is the source of dependency versions. Node.js 20 or later is recommended.
The full Next.js production build uses `.next\` (Netlify's configured build directory). The static export build is isolated in `.next-static\` and copies its verified site to `out\`.

## Booking, chat, and authentication

Without a configured booking backend, checkout stores a clearly labelled demonstration reservation in the current browser's local storage. Confirmation is displayed only after that local write succeeds. Favorites, bookings, and chat history are likewise browser-local; local chat messages are not delivered to a support agent. Do not use these demonstrations for real transactions.

Optional real email/password, Google OAuth, and profile authentication use Supabase Auth. Create a Supabase project and set:

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Add `http://localhost:3000/account` and your deployed `/account` URL to Supabase's allowed redirect URLs. Enable the Google provider in Supabase and configure a Google Cloud OAuth client with the callback URL shown by Supabase. Only use the public anon key in browser environment variables; never put a service-role key in this app. Without these values, the UI explains that authentication is unavailable; it does not simulate sign-in.

Real inventory, payments, server-side reservations, and persistent/realtime chat require a trusted backend and are not implemented by this demonstration.

## Deployment path A — Netlify Drop (static demonstration)

This static export supports hotel discovery, pre-generated seeded hotel detail pages, filters, browser-local favorites, browser-local checkout/confirmation, and the local-only chat. It does **not** provide server-backed bookings, live inventory, server APIs, payment processing, or secure server authentication. Real Supabase authentication should be deployed through the full Next.js path instead of Drop.

```powershell
npm ci
npm run build:static
```

The command runs Next.js with static export enabled and verifies that `out/index.html` exists. The complete static site is in `out\` (with `index.html`, prebuilt hotel pages, `404.html`, JavaScript, CSS, and bundled images). In Netlify Drop, upload the **contents of `out\`**, not the `out` folder itself and not the project/source directory. Do not upload `node_modules`, `.next`, or the project root.

If connecting optional browser Supabase Auth to a static deployment, supply the two `NEXT_PUBLIC_*` variables at build time and configure allowed callback URLs for that site. For production authentication, use path B.

## Deployment path B — full Next.js on Netlify

1. Push the project (including `package-lock.json` and `netlify.toml`) to a Git provider and import that repository in Netlify.
2. Keep the repository package manager as npm. Netlify uses `npm run build`; the Next.js adapter is declared in `netlify.toml` and installed as a development dependency. The adapter handles Next.js routes and server features; do not manually publish the source tree.
3. In Netlify build settings, use `npm run build` and leave the publish directory to `netlify.toml` (`.next`) with `@netlify/plugin-nextjs`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Netlify environment variables if enabling Supabase Auth. Configure matching Supabase and Google OAuth redirect/callback URLs for the deployed domain.
5. Deploy. Validate the published routes and authentication callback URLs after the first deploy.

The current booking and chat features remain local-only even on the full Next.js deploy: no server reservation endpoint, payment provider, or messaging backend exists. Never advertise a local confirmation as a real reservation.

## Data and language validation

Seeded sample listings are maintained in `src/lib/hotels.ts`. The three valid JSON dictionaries live in `messages/`. Run `npm run check:json` to parse each dictionary and check that all languages have the same keys and that core required keys exist.
