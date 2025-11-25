# Cafe Central Station - Next.js Application

## Overview
A modern cafe website built with Next.js 15, featuring a public-facing menu showcase and an admin dashboard for managing menu items. The application uses Google Genkit AI to generate compelling menu item descriptions.

**Technology Stack:**
- Next.js 15.3.3 with TypeScript
- Turbopack for fast development builds
- Tailwind CSS for styling
- Radix UI component library
- Google Genkit AI for menu description generation
- Firebase deployment ready (apphosting.yaml)

**Current State:** Fully configured for Replit environment with development server running on port 5000.

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
│   │   ├── menu/               # Public menu page
│   │   │   └── page.tsx
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Header and Footer components
│   │   └── ui/                 # Reusable UI components (shadcn/ui)
│   ├── lib/
│   │   ├── data.ts             # Menu items and categories data
│   │   ├── placeholder-images.ts # Image placeholder data
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── apphosting.yaml             # Firebase App Hosting config
└── package.json                # Dependencies and scripts
```

## Key Features

### Public-Facing
- **Home Page**: Hero section with featured menu items
- **Menu Page**: Filterable menu by category with images and descriptions
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Dashboard
- **Dashboard**: Overview of bookings, orders, and occupancy
- **Menu Management**: Add, edit, and manage menu items
- **AI-Powered Descriptions**: Generate menu descriptions using Google Gemini

## Configuration

### Replit-Specific Settings
- **Development Port**: 5000 (configured for Replit webview)
- **Host**: 0.0.0.0 (accessible from Replit proxy)
- **Allowed Dev Origins**: Configured to accept Replit's proxy requests

### Scripts
- `npm run dev` - Start development server on port 5000
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run genkit:dev` - Start Genkit development tools

## Dependencies
All dependencies are already installed via `package.json`. Key dependencies include:
- Next.js 15 with React 18
- Genkit AI libraries for Google AI
- Radix UI components
- Firebase SDK
- Tailwind CSS with animations

## Environment Variables
The application uses Google Genkit AI which may require:
- `GOOGLE_API_KEY` or similar Google AI credentials for AI features

## Recent Changes
- **2025-11-25**: Project imported from GitHub and configured for Replit
  - Updated dev server to port 5000 with 0.0.0.0 host
  - Configured Next.js to allow Replit proxy origins
  - Set up workflow for automatic server restart
  - Installed all npm dependencies

## Architecture Decisions
- **No Database**: Currently uses in-memory data from `src/lib/data.ts`
- **Firebase Ready**: Configured for Firebase App Hosting deployment
- **AI Integration**: Uses Google Genkit for extensible AI capabilities
- **Component Library**: Uses shadcn/ui pattern for customizable components

## User Preferences
None documented yet.

## Notes
- The project includes Firebase SDK but no active Firebase initialization
- TypeScript and ESLint build errors are ignored in production builds
- The AI features require Google API credentials to function
