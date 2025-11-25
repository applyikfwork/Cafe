# Cafe Central Station - Next.js Application

## Overview
A modern cafe website built with Next.js 15, featuring a public-facing menu showcase and an admin dashboard for managing menu items. The application uses Google Genkit AI to generate compelling menu item descriptions and Firebase Firestore for real-time data management.

**Technology Stack:**
- Next.js 15.3.3 with TypeScript
- Turbopack for fast development builds
- Tailwind CSS for styling
- Radix UI component library
- Google Genkit AI for menu description generation
- Firebase Firestore for real-time database with mock data initialization
- Framer Motion for smooth animations
- next-themes for dark/light mode toggle

**Current State:** Fully configured for Replit environment with Firebase integration, real-time updates, and 10 mock menu items for demo.

## Project Structure

```
/
├── src/
│   ├── ai/                      # AI flows using Google Genkit
│   │   ├── flows/               # AI flow definitions
│   │   │   └── generate-menu-item-description.ts
│   │   ├── genkit.ts           # Genkit configuration
│   │   └── dev.ts              # Genkit dev server entry
│   ├── app/                     # Next.js app directory (routes)
│   │   ├── admin/              # Admin dashboard routes
│   │   │   ├── menu/           # Menu management
│   │   │   │   ├── components/ # Menu form components
│   │   │   │   ├── actions.ts  # Server actions for menu
│   │   │   │   └── page.tsx    # Menu management page
│   │   │   ├── layout.tsx      # Admin layout with sidebar
│   │   │   └── page.tsx        # Admin dashboard
│   │   ├── menu/               # Public menu page (Firebase-connected)
│   │   │   └── page.tsx
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Home page (Firebase-connected)
│   │   └── globals.css         # Global styles with cafe color palette
│   ├── components/
│   │   ├── layout/             # Header and Footer components
│   │   ├── ui/                 # Reusable UI components (shadcn/ui + custom animations)
│   │   │   ├── video-hero.tsx
│   │   │   ├── dynamic-greeting.tsx
│   │   │   ├── animated-button.tsx
│   │   │   ├── parallax-section.tsx
│   │   │   ├── scroll-reveal.tsx
│   │   │   ├── todays-special-banner.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── theme-provider.tsx   # next-themes provider setup
│   │   └── ...
│   ├── hooks/
│   │   └── useMenuItems.ts      # Custom hook for Firebase real-time menu data
│   ├── lib/
│   │   ├── firebase.ts          # Firebase initialization with secrets
│   │   ├── firestore-service.ts # Firestore CRUD operations + mock data initialization
│   │   ├── data.ts              # Static categories data
│   │   ├── placeholder-images.ts # Image placeholder data
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration with custom animations
├── tsconfig.json                # TypeScript configuration
├── apphosting.yaml              # Firebase App Hosting config
├── replit.md                    # Project documentation
└── package.json                 # Dependencies and scripts
```

## Key Features

### Public-Facing
- **Home Page**: Enhanced hero section with video background, dynamic greetings, animated CTAs, scroll-triggered animations, and "Our Story" section
- **Menu Page**: Real-time filterable menu by category with micro-interactions, hover effects, scroll reveals, and "Today's Special" banner
- **Animations**: Framer Motion animations including parallax scrolling, scroll reveals, fade-in effects, and micro-interactions
- **Dark/Light Theme**: Full theme toggle with warm cafe color palette (coffee browns, cream, coral tones)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Dashboard
- **Dashboard**: Overview of bookings, orders, and occupancy
- **Menu Management**: Add, edit, and manage menu items
- **AI-Powered Descriptions**: Generate menu descriptions using Google Gemini

### Firebase Integration
- **Real-time Updates**: Menu items sync in real-time from Firestore
- **Mock Data**: 10 demo menu items auto-initialized on first load
- **Custom Hook**: `useMenuItems` hook for easy real-time subscription to menu data
- **Firestore Service**: Complete CRUD operations with real-time listeners

## Configuration

### Replit-Specific Settings
- **Development Port**: 5000 (configured for Replit webview)
- **Host**: 0.0.0.0 (accessible from Replit proxy)
- **Allowed Dev Origins**: Configured to accept Replit's proxy requests

### Firebase Secrets (Environment Variables)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Scripts
- `npm run dev` - Start development server on port 5000
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run genkit:dev` - Start Genkit development tools

## Dependencies
All dependencies installed via `package.json`. Key additions:
- framer-motion (animations)
- next-themes (dark mode)
- react-intersection-observer (scroll animations)
- firebase (Firestore database)
- firebase-admin (server-side Firebase)
- @genkit-ai/google-genai (Google AI)
- genkit (AI orchestration)
- All Radix UI components for accessible UI

## Recent Changes (2025-11-25)

### Admin Panel Error Handling Fixes (Latest - November 25, 2025)
- **Fixed Settings Page Loading**: Resolved infinite loading issue caused by duplicate 'id' property in useSettings hook
- **Firebase Null Safety**: Updated Firebase initialization to gracefully handle missing credentials with proper null checks
- **Improved Error Messages**: All admin operations now display specific error messages instead of generic failures
- **Graceful Fallbacks**: Admin pages load with default data when Firebase isn't configured, preventing app crashes
- **Better Loading States**: Enhanced loading indicators for settings and promotions pages
- **Database Validation**: Added comprehensive null checks throughout Firestore service layers
- **User-Friendly Errors**: Error toasts now display the actual error message for easier debugging

**Firebase Configuration Note**: 
To use the admin panel's save functionality, you need to add your Firebase credentials to Replit Secrets:
1. Go to Replit Secrets (Tools → Secrets)
2. Add the following secrets with your Firebase project values:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. **IMPORTANT**: After adding the secrets, you MUST restart the development server for the changes to take effect
   - Click the "Stop" button in the Replit console
   - Then click "Run" to restart the server
   - Or use the workflow restart button

**Note**: The admin panel will load with default/empty data when Firebase isn't configured, allowing you to preview the interface. However, all save, create, update, and delete operations will fail with a clear error message until Firebase is properly configured and the server is restarted.

### Promotions System
- **Promotions Admin Page**: Complete CRUD interface for managing promotions with date pickers, type selection, and item targeting
- **Promotion Types**: Support for percentage discounts and fixed amount reductions
- **Global & Item-Specific Promotions**: Can apply to all items or target specific menu items
- **Date Range Validation**: Robust validation ensures end dates are after start dates, even for partial updates
- **Timestamp Normalization**: Consistent Date handling throughout the application via `usePromotions` hook
- **Firestore Service**: Complete CRUD with proper Timestamp-to-Date conversions and validation
- **Active Promotion Filtering**: Only active promotions (within date range and enabled) display on frontend

### Menu & Homepage Enhancements
- **Enhanced Menu Page**: 
  - Search functionality for menu items by name
  - Tag-based filtering system
  - Promotional badges on discounted items
  - Price strike-through for items on sale
  - Improved card designs with hover effects
  - Better visual hierarchy and spacing
- **Enhanced Homepage**:
  - Active promotions banner showcasing current deals
  - Improved visual appeal and engagement
  - Better call-to-action buttons
- **Real-time Updates**: All promotions sync in real-time across users

### Settings System
- **Settings Save Fix**: Changed from `updateDoc` to `setDoc` with merge option to prevent "document not found" errors
- **Persistent Settings**: Cafe settings (name, hours, contact) now save reliably to Firestore

### Deployment Fixes
- **Fixed Netlify Build Errors**: Moved TypeScript, TailwindCSS, and PostCSS from `devDependencies` to `dependencies` to ensure they're installed during production builds
- **Fixed Firebase Build-Time Errors**: Updated Firebase initialization to only run on client-side (`typeof window !== 'undefined'`) to prevent build-time errors
- **Deployment Configuration**: Set up Replit deployment config with autoscale deployment target
- **Build Verification**: Local build now completes successfully with all pages generated

### Firebase Integration
- **Firebase Integration**: Connected Firestore with real-time data subscription
- **Mock Data System**: 10 demo menu items auto-initialize on first Firebase connect
- **Real-time Hooks**: Created `useMenuItems` and `usePromotions` hooks for subscribing to live data
- **Updated Pages**: Home and menu pages now fetch from Firebase instead of static data
- **Firestore Services**: Complete service layers with CRUD operations and real-time listeners
- **Loading States**: Added loading indicators while Firebase data loads
- **Client Components**: Converted pages to client components for Firebase real-time integration

## Architecture Decisions
- **Firestore Real-time**: Using Firestore listeners for instant data sync across all users
- **Mock Data Initialization**: Automatic demo data injection for new Firebase projects
- **Custom Hooks**: Abstracted Firebase logic into reusable hooks for clean component code
- **Client-side Rendering**: Pages use 'use client' for real-time Firebase subscriptions
- **Build-Time Safety**: Firebase initialization is client-side only to prevent build failures
- **Production Dependencies**: Build tools (TypeScript, TailwindCSS) in main dependencies for Netlify compatibility
- **Warm Color Palette**: Primary #FF6B35 (coral), Secondary #F7F3EF (cream), Accents in coffee browns
- **Animation-first Design**: Framer Motion for smooth, delightful micro-interactions throughout

## User Preferences
- Warm cafe aesthetic with coral, cream, and coffee brown colors
- Smooth animations and micro-interactions for engagement
- Real-time data updates from Firebase
- Dark/light theme support with automatic detection

## Next Steps
- Complete admin authentication with Firebase Auth
- Add order management system
- Implement customer reservations
- Add payment processing with Stripe
- Enhanced mobile optimizations (bottom navigation, swipeable cards)
- Customer gallery and reviews section
- Newsletter subscription integration
