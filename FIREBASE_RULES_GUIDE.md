# Firebase Firestore Rules Guide

## Overview
This document explains the Firestore security rules for Cafe Central Station and how to deploy them.

## Current Rules File
The `firestore.rules` file contains all security rules for your Firestore database.

## Rule Breakdown

### Development Rules (Current)
These rules allow full access during development - perfect for testing the admin panel without authentication:

```
- Menu Items: Public read, authenticated/dev users can create/update/delete
- Settings: Authenticated/dev users can read/write
- Promotions: Public read, authenticated/dev users can create/update/delete
- Bookings: Authenticated/dev users can read/write, admins can delete
- Orders: Authenticated/dev users can read/write, admins can delete
```

### Collections Protected

#### 1. **menu** Collection
- **Read**: ✅ Public (anyone)
- **Create/Update/Delete**: ✅ Development mode OR authenticated users
- **Use Case**: Display menu items publicly, admins manage items

#### 2. **settings** Collection
- **Read/Write**: ✅ Development mode OR authenticated users
- **Use Case**: Store cafe name, hours, contact info
- **Common Error**: "Missing or insufficient permissions" - your rules need to allow write access

#### 3. **promotions** Collection
- **Read**: ✅ Public (anyone)
- **Create/Update/Delete**: ✅ Development mode OR authenticated users
- **Use Case**: Display promotions publicly, admins manage promotions
- **Common Error**: "Missing or insufficient permissions" - your rules need to allow write access

#### 4. **users**, **bookings**, **orders** Collections
- Reserved for future features (reservations, order management, user profiles)

## How to Deploy Rules

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase Project (if not already done)
```bash
firebase init
```
When prompted, select "Firestore" and choose your Firebase project.

### Step 4: Deploy Rules
```bash
firebase deploy --only firestore:rules
```

### Step 5: Verify Deployment
Visit [Firebase Console](https://console.firebase.google.com) → Your Project → Firestore → Rules tab

## Fixing Rule Errors

### Error: "Missing or insufficient permissions"
**Cause**: Your rules don't allow the operation  
**Solution**: Make sure your `firestore.rules` file includes write permissions for the collection

Example fix for Settings:
```
match /settings/{document=**} {
  allow read: if isAuthenticated() || isDevelopment();
  allow write: if isAuthenticated() || isDevelopment();
}
```

### Error: "Document not found" on Save
**Cause**: Rules prevent document creation  
**Solution**: Ensure `create` is allowed in your rules

### Error: "Permission denied" in Admin Panel
**Cause**: Rules too restrictive  
**Solution**: 
1. Check you're in development mode (rules allow `isDevelopment()`)
2. Or authenticate users before trying to save
3. Verify rules are deployed: `firebase deploy --only firestore:rules`

## Production Rules (When Ready)

When you're ready for production, remove development mode and enforce authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    // Menu Items - Public read, admins write
    match /menu/{document=**} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Settings - Admins only
    match /settings/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // Promotions - Public read, admins write
    match /promotions/{document=**} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Bookings - Authenticated users
    match /bookings/{document=**} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }
    
    // Orders - Authenticated users
    match /orders/{document=**} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }
  }
}
```

## Testing Rules Locally

Use the Firebase Emulator Suite to test rules locally before deploying:

```bash
firebase emulators:start
```

Then connect your app to the emulator by adding this to your Firebase initialization:
```javascript
connectEmulator(db, "localhost", 8080);
```

## Rule Security Best Practices

1. **Always use functions** for common checks (isAuthenticated, isAdmin)
2. **Separate read and write** permissions explicitly
3. **Never use wildcards** with `allow true` unless necessary
4. **Validate data** with `request.resource.data`
5. **Check timestamps** to prevent old documents from being accessed
6. **Use custom claims** for role-based access (admin field)

## Common Issues in Your Admin Panel

### Settings Save Fails
- Verify `settings` collection rules allow write
- Check development mode is enabled or user is authenticated
- Ensure rules are deployed: `firebase deploy --only firestore:rules`

### Promotions Create/Update Fails
- Same as settings - check write permissions in rules
- Verify the promotions collection path matches exactly

### Menu Items Can't Be Created
- Check `menu` collection allows create
- Verify Firestore is initialized with valid credentials

## Next Steps

1. **Deploy current rules**: `firebase deploy --only firestore:rules`
2. **Test admin panel**: Try creating/updating settings and promotions
3. **Monitor Firebase Console** for rule violations
4. **When production ready**: Update to production rules without `isDevelopment()`

## Support

If you continue seeing rule errors:
1. Check Firebase Console → Firestore → Rules tab
2. Look at recent request logs in Firebase Console
3. Verify all Firestore secrets are set in Replit Secrets
4. Restart the development server after any rule changes
