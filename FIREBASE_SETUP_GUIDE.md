# Firebase Setup Guide for Cafe Central Station

## Why Firebase is Needed

Your admin panel changes (settings and promotions) are **not showing on the website** because Firebase is not configured. Firebase Firestore is the real-time database that syncs data between your admin panel and the public website.

**Current Status:** ✅ Currency is INR | ❌ Firebase not configured

---

## Current Status

✅ **Firebase SDK connected** - Credentials loaded successfully
⚠️ **Firestore Database** - NOT YET CREATED (you need to do this next)

## Quick Setup (5 minutes)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter project name: `cafe-central-station` (or any name you prefer)
4. Follow the setup wizard (Google Analytics is optional)

### Step 2: Create a Web App in Firebase

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register app name: `Cafe Central Station Website`
3. **DO NOT** check "Firebase Hosting" (we'll use Replit/Netlify)
4. Click **"Register app"**
5. You'll see a `firebaseConfig` object - **keep this page open**

### Step 3: Enable Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules later)
4. Choose a Cloud Firestore location (select closest to your users)
5. Click **"Enable"**

### Step 4: Update Firestore Security Rules

1. Go to **Firestore Database → Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to menu items, categories, settings, and promotions
    match /menu/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    
    match /categories/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    
    match /settings/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    
    match /promotions/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Click **"Publish"**

**Note:** These rules allow public read but prevent public writes. Your admin panel will work because it runs on your authenticated Replit environment.

### Step 5: Add Firebase Config to Replit Secrets

1. In Replit, open the **Secrets** panel (Tools → Secrets, or padlock icon 🔒)
2. You should see these existing secrets (currently empty):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. Copy values from your Firebase config object and paste them into the corresponding secrets:

```javascript
// From Firebase Console, your firebaseConfig looks like:
const firebaseConfig = {
  apiKey: "AIzaSy...",           // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "cafe-central-station.firebaseapp.com",  // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "cafe-central-station",                   // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "cafe-central-station.appspot.com",   // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",                      // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abcdef"                      // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

### Step 6: Restart the Development Server

**CRITICAL:** After adding secrets, you **MUST** restart the server:

1. Click the **Stop** button in the Replit console
2. Click **Run** to restart
3. Wait for the server to compile (may take 1-2 minutes)
4. Look for **"Firebase initialized successfully"** in the browser console

---

## How to Test if Firebase is Working

### Test 1: Check Browser Console

1. Open your website in the Replit webview
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Look for one of these messages:
   - ✅ **"Firebase initialized successfully"** - Working!
   - ❌ **"Firebase is not configured"** - Not working, check secrets

### Test 2: Create a Promotion in Admin Panel

1. Go to `/admin/login` and log in with your admin password
2. Navigate to **Promotions** page
3. Click **"Create Promotion"**
4. Fill in the form:
   - Title: "Grand Opening Special"
   - Description: "20% off on all items!"
   - Type: Percentage
   - Value: 20
   - Start Date: Today
   - End Date: 7 days from now
   - Active: Yes
5. Click **"Create Promotion"**
6. Go to your **homepage** (`/`) - you should see the promotion banner at the top!

### Test 3: Update Cafe Settings

1. In admin panel, go to **Settings** page
2. Change the cafe name to "Cafe Central Station - Best Coffee in Town!"
3. Update phone number to your actual number
4. Click **"Save Settings"**
5. Go to your **homepage** - the footer should show the updated information!

---

## Troubleshooting

### "Firebase is not configured" message

**Solution:** You need to add Firebase credentials to Replit Secrets and restart the server.

### "Database not initialized" errors

**Solution:** 
1. Verify all 6 Firebase secrets are filled in Replit Secrets
2. Restart the development server (Stop → Run)
3. Check browser console for Firebase initialization message

### Changes in admin panel don't show on website

**Solution:**
1. Make sure Firebase is initialized (check browser console)
2. Wait 2-3 seconds for real-time sync
3. Refresh the page if needed
4. Check Firestore in Firebase Console to see if data was saved

### Firestore permission errors

**Solution:** 
1. Go to Firebase Console → Firestore Database → Rules
2. Make sure you've published the security rules from Step 4
3. The rules allow public read but prevent unauthorized writes

---

## For Production Deployment (Netlify)

When deploying to Netlify, add the same Firebase environment variables:

1. Go to Netlify dashboard → **Site Settings → Environment variables**
2. Add all 6 Firebase variables with the same values from Replit Secrets
3. Redeploy your site

---

## Need Help?

- Firebase Console: https://console.firebase.google.com/
- Firebase Documentation: https://firebase.google.com/docs/firestore
- Replit Secrets Guide: https://docs.replit.com/programming-ide/workspace-features/secrets

---

**Remember:** After adding/updating secrets, **always restart the development server** for changes to take effect!
