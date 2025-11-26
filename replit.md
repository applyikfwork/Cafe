# Cafe Central Station - Next.js Application

### Overview
Cafe Central Station is a modern Next.js 15 application designed for cafes, featuring a public-facing menu showcase and a comprehensive admin dashboard. It leverages Google Genkit AI for generating menu item descriptions and Firebase Firestore for real-time data management. The project aims to provide a visually appealing, interactive, and easily manageable platform for cafe owners to showcase their offerings.

### User Preferences
- Warm cafe aesthetic with coral, cream, and coffee brown colors
- Smooth animations and micro-interactions for engagement
- Real-time data updates from Firebase
- Dark/light theme support with automatic detection
- Indian Rupee (INR) currency for all pricing
- Secure admin panel accessible only via password

### System Architecture
The application is built with Next.js 15 and TypeScript, utilizing Turbopack for fast development. Styling is managed with Tailwind CSS and Radix UI components, enhanced with Framer Motion for animations. The core architecture includes:
- **UI/UX**: Features a warm cafe color palette (coffee browns, cream, coral tones), video hero sections, dynamic greetings, scroll-triggered animations, and a responsive, mobile-first design. It includes a dark/light theme toggle.
- **Admin Dashboard**: Provides comprehensive management for menu items (add, edit, delete), categories, and promotions. It includes AI-powered description generation using Google Genkit and automatic image compression for uploads. Access is secured via simple password protection.
- **Data Management**: Firebase Firestore is used for real-time data synchronization of menu items, categories, and promotions. Firebase Storage handles image uploads. Mock data initialization is included for quick setup.
- **AI Integration**: Google Genkit AI is integrated to generate engaging menu item descriptions.
- **Real-time Features**: Custom hooks (`useMenuItems`, `usePromotions`) are used for real-time data fetching and updates from Firestore. Pages are client-side rendered to support these real-time subscriptions.
- **Deployment**: Configured for Replit environment with specific port and host settings, and optimized for Netlify deployments by ensuring build tools are in main dependencies.

### External Dependencies
- **Firebase**: Firestore for real-time database, Firebase Storage for image uploads, Firebase Admin for server-side operations.
- **Google Genkit AI**: Used for generating menu item descriptions.
- **Next.js**: Core framework.
- **React**: UI library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: Headless UI components for accessibility.
- **Framer Motion**: Animation library.
- **next-themes**: For dark/light mode functionality.
- **react-intersection-observer**: For scroll animations.