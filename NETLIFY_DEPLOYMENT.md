# Netlify Deployment Guide

## Step 1: Set Environment Variables on Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site Settings → Environment**
3. Click **Add a variable**
4. Add this **1 required variable**:

| Key | Value |
|-----|-------|
| `ADMIN_PASSWORD` | Your secure password (e.g., `MySecurePass123!`) |

That's it! No more SESSION_SECRET needed. 🎉

### Optional: Firebase Configuration

If you want real-time data sync on Netlify, also add these in **Environment**:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Step 2: Redeploy

1. Go to **Deployments**
2. Click **Trigger deploy → Deploy site**
3. Wait for build to finish

## Step 3: Test

1. Visit: `yoursite.netlify.app/admin/login`
2. Enter your `ADMIN_PASSWORD`
3. Should now login successfully ✅

---

## Troubleshooting

### "Admin password not configured" error

This means `ADMIN_PASSWORD` is not set:

1. Check **Site Settings → Environment**
2. Add the `ADMIN_PASSWORD` variable
3. Redeploy

### "Invalid password" error

Your password doesn't match:

1. Check the exact password in Netlify Environment variables
2. Make sure there are no extra spaces
3. Try again with exact password

### Still not working?

1. Clear browser cache and cookies
2. Try in an incognito/private window
3. Check browser console for error messages (F12 → Console tab)

---

## How It Works

- Admin login requires only **ADMIN_PASSWORD**
- Session cookie expires after **7 days**
- No external secrets or complex key generation needed
- Simple, reliable, easy to deploy

