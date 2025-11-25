# 🚨 Quick Fix for Netlify 404 Errors

## The Problem
You're seeing "Page not found" / 404 errors on Netlify after deployment.

## The Solution
Your `netlify.toml` was using outdated manual configuration. It's now updated to use Netlify's official Next.js plugin.

## Steps to Fix (Do this NOW):

### 1. Push the Updated Code
```bash
git add .
git commit -m "Fix Netlify deployment with Next.js plugin"
git push
```

### 2. Clear Netlify Cache
In your Netlify dashboard:
1. Go to **Deploys** tab
2. Click **Trigger deploy** button (top right)
3. Select **Clear cache and deploy site**

### 3. Verify Framework Detection
1. Go to **Site settings** → **Build & Deploy** → **Build settings**
2. Check that **Framework preset** shows "Next.js"
3. If it says "Not set", change it to "Next.js" and save

### 4. Add Firebase Environment Variables
If you haven't already, add these in **Site settings** → **Environment variables**:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## What Changed?

### ❌ Old (Broken) Configuration:
```toml
[build]
command = "npm run build"
publish = ".next"

[build.environment]
NODE_ENV = "production"

[[redirects]]
from = "/*"
to = "/.netlify/functions/___netlify-handler"
status = 200
force = true
```

### ✅ New (Working) Configuration:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

The new setup uses Netlify's official plugin which:
- Automatically handles all Next.js routing
- Supports SSR (Server-Side Rendering)
- Handles API routes properly
- Manages redirects automatically

## After Deploying

Your site should now work at:
- Homepage: `https://your-site.netlify.app/`
- Menu page: `https://your-site.netlify.app/menu`
- Admin: `https://your-site.netlify.app/admin`

## Still Not Working?

If you still see 404 errors after following all steps:

1. **Check the deploy logs** for errors
2. **Try deleting and recreating** the Netlify site (connect to the same repo)
3. **Make sure** `@netlify/plugin-nextjs` appears in your `package.json`

Look for this in your deploy logs:
```
❯ Using Next.js Runtime
```

This confirms the plugin is working.
