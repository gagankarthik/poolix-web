# Production sign-in fix for Vercel

Chrome's third-party-cookie phase-out (3PCD) blocks `signInWithRedirect` and
silently breaks `signInWithPopup`'s session handoff when the Firebase auth
handler lives on a different origin than the app. The fix is to serve the
auth handler from the same origin as the app via a Vercel rewrite, then
point `authDomain` at the app's own host.

## What's already in code
- `vercel.json` proxies `/__/auth/*` and `/__/firebase/*` to
  `rideshare-30239.firebaseapp.com/__/auth/*`.

## What you need to do once (per Vercel project)

### 1. Set the `authDomain` env var to your app's host

Vercel → your project → Settings → Environment Variables. Add (or update) for
**Production** (and Preview if you use preview deploys):

```
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = poolix-web-six.vercel.app
```

(or your custom domain, e.g. `poolix.app`, when you add one.)

Leave `.env.local` for local dev pointing at `rideshare-30239.firebaseapp.com`
— `localhost` is exempt from 3PCD so popup works fine in dev.

### 2. Authorize the app domain in Firebase

Firebase Console → Authentication → Settings → Authorized domains → Add domain:

- `poolix-web-six.vercel.app`
- (and any custom domain you add later, e.g. `poolix.app`)

### 3. Redeploy

Push to `main` (or the branch Vercel watches). The new `vercel.json` rewrites
take effect on the next build, and the env-var change takes effect on the
next deploy.

## How to verify
Open the deployed app, click Continue with Google. You should:
1. Get the Google account picker (popup or full-page redirect — both work
   now).
2. Land back on `/app` with your account selected.
3. See `[auth] redirect resolved: <uid>` (only if redirect path was used) in
   the console.

If sign-in still fails, check the network tab for `/__/auth/handler` — it
should return `200 OK` from the app's own origin, not a CORS error.
