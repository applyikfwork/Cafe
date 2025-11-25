# Netlify Deployment Guide

## Step 1: Set Environment Variables on Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site Settings → Environment**
3. Click **Add a variable**
4. Add these environment variables:

### Required for Admin Password

```
ADMIN_PASSWORD = your_secure_password_here
SESSION_SECRET = generate_a_random_secret_key
```

**How to generate SESSION_SECRET:**
- Go to your terminal
- Run: `openssl rand -base64 32`
- Copy the output and paste into Netlify

### Optional: Firebase Configuration

If you want real-time data sync:

```
NEXT_PUBLIC_FIREBASE_API_KEY = your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_id
NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id
```

## Step 2: Redeploy

1. After adding variables, go to **Deployments**
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete

## Step 3: Test Admin Access

1. Visit: `yoursite.netlify.app/admin/login`
2. Enter your `ADMIN_PASSWORD`
3. Should see "Success!" message

## Troubleshooting

### "Admin authentication not configured" error

This means `ADMIN_PASSWORD` or `SESSION_SECRET` is not set:

1. Check **Site Settings → Environment**
2. Make sure both variables exist
3. Redeploy after adding them

### "Invalid password" error

Your password doesn't match:

1. Check the exact password in Netlify Environment variables
2. Make sure there are no extra spaces
3. Try again with exact password

### Still not working?

1. Clear browser cache and cookies
2. Try in an incognito/private window
3. Check browser console for error messages (F12)

## Important Notes

- **ADMIN_PASSWORD** should be changed from default `admin123`
- **SESSION_SECRET** must be a random string (generated with `openssl rand -base64 32`)
- Both variables are required for admin panel to work
- After changing variables, always **Trigger deploy** for changes to take effect
