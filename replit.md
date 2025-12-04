# Cafe Central Station - Next.js Application

### Overview
Cafe Central Station is a modern Next.js 15 application for cafes, featuring a public-facing menu, an admin dashboard, and dynamic promotional features. It uses Google Genkit AI for menu descriptions and Firebase Firestore for real-time data. The application is optimized for mobile, performance, and SEO, aiming to provide a robust platform for cafe operations and customer engagement. Key capabilities include a powerful homepage with cinematic visuals, a comprehensive menu with advanced filtering, social proof integration, and a full-featured gallery.

### User Preferences
- Warm cafe aesthetic with coral, cream, and coffee brown colors
- Smooth animations and micro-interactions for engagement
- Real-time data updates from Firebase
- Dark/light theme support with automatic detection
- Indian Rupee (₹) currency for all pricing (with special font handling for correct symbol display)
- Secure admin panel accessible only via password
- Mobile-first design priority (Instagram/Uber Eats/Zomato-style UI)

### System Architecture
The application is built with Next.js 15, TypeScript, and Turbopack, utilizing Tailwind CSS, Radix UI, and Framer Motion for styling and animations.

**UI/UX Decisions**:
- Warm cafe color palette (coffee browns, cream, coral tones).
- Video hero sections with dynamic greetings.
- Scroll-triggered animations and micro-interactions.
- Responsive mobile-first design with dark/light theme toggle.
- Consistent Indian Rupee (₹) currency symbol display with specialized font handling.
- Instagram-style category story carousels and floating navigation on menu pages.
- Full-screen item previews with swipe gestures.
- Masonry/Grid layout toggle and lightbox viewer for the gallery.

**Technical Implementations**:
- **Admin Dashboard**: Comprehensive management for menu items, categories, promotions, hero images (via Cloudinary), and "Today's Special." Includes AI-powered description generation using Google Genkit.
- **Pages & Routing**: Dedicated routes for Home (`/`), Menu (`/menu`), individual product details (`/menu/[id]`), Gallery (`/gallery`), and protected Admin sections (`/admin`, `/admin/menu`, `/admin/promotions`, `/admin/settings`).
- **Data Management**: Firebase Firestore for real-time data synchronization. Cloudinary for image uploads and hosting. Google Genkit AI for menu item description generation. LocalStorage for user preferences like favorites and recently viewed items.
- **Real-time Features**: Custom hooks (`useMenuItems`, `usePromotions`, `useTodaysSpecial`, `useMenuFavorites`, `useGallery`) enable real-time data updates across the application, with immediate reflection of admin changes.
- **Search & Discovery**: Full-text search, smart filters (price, dietary), sorting options (popularity, rating, price, newest), and category-based browsing.
- **Social Proof System**: Generation of realistic reviews, ratings, and social proof statistics for menu items, displayed on full-screen item previews.
- **Gallery Management**: Full CRUD operations for photos, videos, and photo contests via an admin interface.
- **Currency System**: Centralized `currency.ts` library and UI components ensure consistent, locale-aware formatting of Indian Rupee amounts, including decimal precision control and specific font stacks for symbol rendering.
- **Performance & SEO**: Optimized for search engines with Open Graph tags, schema markup, Next.js Image component, and mobile-first design for Core Web Vitals.

**Feature Specifications**:
- **Homepage**: Enhanced hero section with animations, dynamic greetings, promotional cards with countdowns, and an "Experience Section" showcasing cafe features.
- **Menu Page**: Instagram-style category story carousel, floating category navigation, view mode toggle (sections, grid, list), accordion menu sections, animated menu cards, smart filter bar, sorting, trending section, recently viewed, favorites, and AI-style recommendations.
- **Gallery Page**: Masonry/grid layout toggle, category filters, full-screen lightbox, "Photo of the Day," video section, Instagram integration for customer photos, and photo contests with voting.

### External Dependencies
- **Firebase**: Firestore (real-time database), Firebase Admin (server-side operations).
- **Cloudinary**: Image upload and hosting service.
- **Google Genkit AI**: For AI-powered menu item description generation.
- **Next.js**: Core web framework.
- **React**: User interface library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: Headless UI components.
- **Framer Motion**: Animation library.
- **next-themes**: Dark/light mode functionality.
- **react-intersection-observer**: For scroll-triggered animations.
- **date-fns**: For date formatting and manipulation.