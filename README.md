# ExamEdge Web — Frontend

A real Vite + React project (not a mockup) wired to the ExamEdge Fastify backend's
actual routes, response envelope, and auth contract.

## What's actually wired up (real API calls, no mock data)

- **Student auth** — register, login, logout, `/auth/me` (src/context/StudentAuthContext.jsx)
- **Admin auth** — login, logout, `/admin/auth/me`, role-based redirect (ADMIN vs SUPER_ADMIN)
- **Test Browse** — `GET /tests` with live filtering by exam/type/search
- **Admin Dashboard** — real test list + question bank stats
- **Razorpay checkout** — full order → checkout → verify flow, field names matched
  exactly to the backend's camelCase verify schema (src/components/RazorpayCheckout.jsx)
- **Every API module** in `src/api/` — one file per backend module, every function
  maps to a route that was actually read from the backend source, not guessed

## What's stubbed (placeholder pages, real API client ready)

Test Detail, Test-Taking, Results, My Tests, Leaderboard, Pricing, Admin Tests/
Questions/Analytics, Super Admin Revenue/Subscriptions/Coupons all render a
"🚧 coming soon" placeholder in `App.jsx`. The matching API module already exists
in `src/api/` with every function the backend supports — wiring a stub page means
importing that module and following the same pattern as `TestBrowsePage.jsx` or
`AdminDashboard.jsx`: fetch in `useEffect`, render loading/error/empty states,
then the real data.

This was a deliberate scope cut to get you something genuinely deployable now
rather than a much larger set of pages I couldn't verify against the backend in
this pass. Say which page to build out next and I'll wire it the same way.

## Local development

```bash
npm install
cp .env.example .env.local   # only needed if backend isn't on localhost:3001
npm run dev
```

The dev server proxies `/api/*` to `http://localhost:3001` (see `vite.config.js`),
so you don't need CORS configured for local work — just run the backend
alongside this on port 3001.

## Production build

```bash
npm run build
```

Outputs to `dist/`. This is a static SPA — any static host works.

## Deploying

### Option A — One deployment for all three portals (simplest, do this first)

1. Push this folder to a GitHub repo.
2. Import it in Vercel (or Netlify).
3. Set the environment variable `VITE_API_URL` to your deployed backend's
   base URL including the version prefix, e.g. `https://api.examedge.in/api/v1`.
4. Deploy. `vercel.json` is already set up to rewrite all paths to `index.html`
   so client-side routes like `/admin/dashboard` don't 404 on a hard refresh.

Students go to `/`, admins to `/admin/login`, and the super admin sees an
extended sidebar automatically based on their role — no separate deployment
needed to start.

### Option B — Three separate deployments (recommended once you're live)

Splitting student / admin / super-admin into separate Vercel projects from
the same repo gives you independent deploys, separate custom domains
(`app.examedge.in`, `admin.examedge.in`), and matches the backend's CORS
config, which already expects three distinct origins
(`FRONTEND_URL`, `ADMIN_URL`, `SUPER_ADMIN_URL` — see backend `.env.example`).

To do this: create three Vercel projects from the same GitHub repo, and in
each project's settings set a different **Root Directory** build behavior is
identical, only the entry route differs — or simply ship Option A first and
split later once traffic justifies it. Splitting isn't required for the app
to work correctly.

### Backend CORS — don't forget this step

Whichever option you pick, the backend's `FRONTEND_URL` / `ADMIN_URL` /
`SUPER_ADMIN_URL` env vars must exactly match wherever you deploy this
(scheme + host, no trailing slash) or every request will fail CORS in the
browser console with no other error shown. This is the single most common
"it works locally but not in production" issue with this stack.

## Known gaps to close before a real launch

- **Token storage is `localStorage`**, which is fine to ship with but is
  readable by any injected script (XSS risk). Moving to httpOnly cookies
  is a backend + frontend change together — flag if you want this done.
- **No automated tests** on this frontend yet.
- **Stubbed pages** listed above need wiring before students/admins can use
  the full product end to end.
