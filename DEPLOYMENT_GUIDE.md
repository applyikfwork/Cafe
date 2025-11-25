# Deployment Guide for Netlify

## Issues Fixed

### 1. Module Resolution Errors (FIXED ✅)
**Problem**: Build was failing with "Can't resolve '@/components/ui/button'" and similar errors.

**Root Cause**: When `NODE_ENV=production`, npm doesn't install `devDependencies`. TypeScript, TailwindCSS, and PostCSS were in `devDependencies` but are required for the build process.

**Solution**: Moved build-time dependencies to main `dependencies`:
- `typescript`
- `tailwindcss`
- `postcss`
- `@types/node`
- `@types/react`
- `@types/react-dom`

### 2. Firebase Initialization During Build (FIXED ✅)
**Problem**: Firebase was trying to initialize during the build process, causing "Error (auth/invalid-api-key)" build failures.

**Solution**: Updated `src/lib/firebase.ts` to only initialize Firebase on the client-side using `typeof window !== 'undefined'` check. This prevents server-side/build-time initialization while still working properly in the browser.

## Deployment Steps for Netlify

### Prerequisites
You need the following Firebase configuration values from your Firebase project:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 1: Configure Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following environment variables with your actual Firebase values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Step 2: Verify Framework Detection (Important!)

1. In your Netlify site dashboard, go to **Site settings** → **Build & Deploy** → **Build settings**
2. Make sure **Framework preset** is set to **Next.js** (not "Not set")
3. If it's wrong, change it to "Next.js" and save

### Step 3: Deploy

Your `netlify.toml` configuration uses Netlify's official Next.js plugin:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

The `@netlify/plugin-nextjs` package is already installed and will handle:
- Server-side rendering (SSR)
- API routes
- Image optimization
- Automatic routing configuration

Simply push your code to your connected Git repository, and Netlify will:
1. Detect Next.js framework automatically
2. Install all dependencies (including the build tools now in `dependencies`)
3. Run `npm run build` successfully
4. Deploy your Next.js application with full SSR support

## Build Verification

The build has been tested locally and completes successfully:

```
✓ Compiled successfully in 66s
✓ Collecting page data    
✓ Generating static pages (9/9)
✓ Collecting build traces    
✓ Finalizing page optimization
```

All routes are building properly:
- `/` (home page)
- `/menu` (menu page)
- `/admin` (admin dashboard)
- `/admin/menu` (menu management)
- `/admin/settings` (settings page)

## For Replit Deployment

The Replit deployment configuration has also been set up:
- **Build command**: `npm run build`
- **Run command**: `npm start`
- **Deployment target**: Autoscale (suitable for Next.js apps)

## Notes

- The application is configured to run on port 5000 in development
- All Firebase operations are client-side only, preventing build-time errors
- TypeScript type checking is disabled during builds (`ignoreBuildErrors: true`)
- ESLint is disabled during builds (`ignoreDuringBuilds: true`)

## Troubleshooting

### Getting 404 "Page Not Found" errors?

This was likely caused by the old configuration. The new setup uses Netlify's official Next.js plugin which properly handles routing. After updating:

1. **Clear Netlify's cache and redeploy:**
   - Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

2. **Verify the plugin is loaded:**
   - Check your deploy logs for `@netlify/plugin-nextjs`
   - You should see messages about Next.js runtime being used

### Other Issues:

1. **Build still failing?** 
   - Check that all environment variables are set in Netlify
   - Verify Framework preset is set to "Next.js"
   - Make sure `@netlify/plugin-nextjs` is in your package.json dependencies

2. **App not working after deployment?**
   - Verify Firebase environment variables are correctly set
   - Check Netlify function logs for runtime errors
   - Ensure you cleared the cache after updating netlify.toml

3. **Images not loading?**
   - The app is configured to allow images from:
     - `placehold.co`
     - `images.unsplash.com`
     - `picsum.photos`

### Quick Fix Checklist:

✅ Updated `netlify.toml` to use `@netlify/plugin-nextjs`  
✅ Installed `@netlify/plugin-nextjs` package  
✅ Added Firebase environment variables to Netlify  
✅ Framework preset set to "Next.js" in Netlify dashboard  
✅ Cleared cache and redeployed  

If you've completed all these steps and still see 404 errors, try:
- Deleting and recreating the Netlify site
- Checking the deploy logs for specific error messages
