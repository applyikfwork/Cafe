# Cafe Central Station - Next.js Application

### Overview
Cafe Central Station is a modern Next.js 15 application designed for cafes, featuring a public-facing menu showcase with individual product pages, a comprehensive admin dashboard, and dynamic promotional features. It leverages Google Genkit AI for generating menu item descriptions and Firebase Firestore for real-time data management. The application is optimized for mobile devices with powerful performance and SEO capabilities.

### User Preferences
- Warm cafe aesthetic with coral, cream, and coffee brown colors
- Smooth animations and micro-interactions for engagement
- Real-time data updates from Firebase
- Dark/light theme support with automatic detection
- Indian Rupee (₹) currency for all pricing (with special font handling for correct symbol display)
- Secure admin panel accessible only via password
- Mobile-first design priority (Instagram/Uber Eats/Zomato-style UI)

### Recent Improvements (Latest Session)

#### Powerful Homepage Redesign (New)
- **Enhanced Hero Section** (`src/components/home/hero-section.tsx`) - Cinematic full-screen hero with:
  - Beautiful cafe background image with slow zoom animation
  - Floating coffee cup particle animations
  - Animated spinning decorative circles
  - Dynamic greeting badge with time-of-day awareness
  - 5-star rating display (4.9/5)
  - Gradient "Order Now" and "Reserve Table" CTA buttons
  - Opening hours and contact info badges
  - Scroll-down indicator with bounce animation
  - Proper hydration handling for SSR

- **Promotions Section** (`src/components/home/promotions-section.tsx`) - Attractive promotional cards with:
  - Responsive 1-3 column grid layout
  - Rounded corner cards with gradient backgrounds
  - Countdown timer for limited time offers
  - Discount badges showing savings
  - Promo code display
  - Beautiful blur effects and hover animations
  - Hydration-safe countdown timer

- **Experience Section** (`src/components/home/experience-section.tsx`) - Cafe atmosphere showcase with:
  - 6 feature cards (Premium Coffee, Fresh Cuisine, WiFi, Ambient Vibes, Eco-Friendly, Made with Love)
  - Each card with gradient icons and hover effects
  - Atmosphere image gallery grid
  - Responsive mobile/desktop layouts
  - Rounded 3xl corner cards

- **New CSS Animations** (`src/app/globals.css`) - Enhanced animations including:
  - `animate-slow-zoom` - Subtle background zoom effect
  - `animate-spin-slow` / `animate-reverse-spin` - Decorative spinning circles
  - `animate-float-particle` - Floating elements
  - `animate-hero-text-reveal` - Title reveal animation
  - `animate-fade-in-up` - Staggered content fade in
  - `animate-blob` - Background blob movement
  - `animate-shimmer` - Shimmer highlight effect
  - `animate-glow-pulse` - Glowing button effects
  - Accessibility: `prefers-reduced-motion` support

- **Improved Responsive Design**:
  - Full-height hero on all devices
  - Mobile-optimized buttons and text sizes
  - Responsive spacing and padding utilities
  - Smooth scrolling behavior
  - Better focus states for accessibility

#### Social Proof System (New)
- **Fake Data Generator** (`src/lib/fake-data-generator.ts`) - Generates realistic reviews with:
  - Random reviewer names from diverse pool
  - Ratings between 3.5-5 stars (realistic positive bias)
  - Review comments tailored to menu item names
  - Random dates within past 90 days
  - Verified buyer badges
  - Helpful vote counts
- **Admin Menu Form** - One-click "Generate Social Proof" button adds:
  - Rating (3.5-5 stars)
  - Review count
  - Prep time and calories
  - Total buyer count (50-500)
  - 3-5 fake reviews with realistic comments
- **Full-Screen Item Preview** - Enhanced to show:
  - Social proof stats grid (rating, prep time, calories, buyers)
  - Best Seller/Trending/Popular badges
  - Customer reviews section with avatars, ratings, dates, helpful counts
  - Verified buyer badges on reviews

#### Admin Gallery Management (New)
- **Gallery Admin Page** (`src/app/admin/gallery/page.tsx`) - Full management interface with tabs:
  - Photos tab with add/edit/delete functionality
  - Videos tab for managing video content
  - Contest tab for managing photo contests
- **Firebase Gallery Service** (`src/lib/firestore-gallery-service.ts`) - Complete CRUD operations for:
  - Gallery photos with categories and tags
  - Gallery videos with thumbnails and duration
  - Contest submissions with voting

#### Menu Page - Powerful Features
- **Smart Filter Bar** - Price range slider, dietary preferences (veg/vegan/gluten-free/dairy-free/nut-free), spice level selector
- **Sorting Options** - Sort by popularity, rating, price (low-high/high-low), newest
- **Enhanced Menu Cards** - Star ratings, review counts, prep time, quick add-to-cart button, favorite/wishlist heart icon
- **Trending Now Section** - Horizontal scrollable section showing most ordered items with ranking badges
- **Recently Viewed** - Persistent section showing items user has viewed (localStorage)
- **Favorites/Wishlist** - Save items with heart icon, persisted in localStorage
- **Recommended For You** - AI-style recommendations based on viewing history and preferences

#### Gallery Page (New)
- **Masonry/Grid Layout Toggle** - Switch between Pinterest-style masonry and uniform grid
- **Category Filters** - Filter by Ambiance, Food, Events, Behind the Scenes
- **Full-Screen Lightbox Viewer** - Swipe gestures, keyboard navigation, share buttons
- **Photo of the Day** - Featured photo with prominent display
- **Video Section** - Food preparation videos with modal player
- **Instagram Integration** - Customer photo submissions styled like Instagram
- **Photo Contests** - Submission form, voting with likes, prize display, leaderboard

#### Bug Fixes
- **Hydration Error Fixed** - Resolved server/client rendering mismatch in DynamicGreeting and mobile detection
- **Deterministic Values** - Replaced Math.random() with hash-based values for consistent server/client rendering
- **VideoSection Type Fix** - Updated to use GalleryVideo type with optional duration field

### System Architecture
The application is built with Next.js 15 and TypeScript, utilizing Turbopack for fast development. Styling is managed with Tailwind CSS and Radix UI components, enhanced with Framer Motion for animations. The core architecture includes:

**UI/UX**: 
- Warm cafe color palette (coffee browns, cream, coral tones)
- Video hero sections with dynamic greetings
- Scroll-triggered animations
- Responsive mobile-first design with dark/light theme toggle
- Currency symbol styling with special font handling

**Admin Dashboard**: 
- Comprehensive menu management (add, edit, delete items)
- Category management
- Promotion system with flexible discount types
- Today's Special management
- Hero image upload via Cloudinary
- AI-powered description generation using Google Genkit
- Automatic image compression for uploads

**Pages & Routing**:
- `/` - Home page with hero, promotions showcase, featured items, company story
- `/menu` - Full menu with smart filters, sorting, trending, recently viewed, favorites
- `/menu/[id]` - Individual product detail pages with quantity selector, reviews, nutritional info
- `/gallery` - Photo gallery with lightbox, videos, contests, Instagram integration
- `/admin` - Protected admin dashboard
- `/admin/menu` - Menu item management
- `/admin/promotions` - Promotion management with validation
- `/admin/settings` - Settings, hero image, and Today's Special management

**Data Management**: 
- Firebase Firestore for real-time data synchronization
- Cloudinary for image uploads and hosting (both menu items and hero images)
- Real-time subscriptions via custom hooks
- Google Genkit AI for description generation
- LocalStorage for favorites and recently viewed

**Real-time Features**: 
- Custom hooks (`useMenuItems`, `usePromotions`, `useTodaysSpecial`, `useMenuFavorites`, `useGallery`) for real-time data
- Client-side rendered pages to support real-time subscriptions
- Immediate updates when admin makes changes

**Search & Discovery**:
- Full-text search by menu item name and description
- Smart filters: price range, dietary preferences, spice level
- Sort by popularity, rating, price, date added
- Filter by dietary tags (veg, spicy, gluten-free, new)
- Category-based browsing with tabs
- Individual product pages with SEO optimization

**Deployment**: 
- Configured for Replit environment with proper host/port settings
- Optimized for Netlify deployments
- Build tools in main dependencies

### Component Library

**Menu Components** (`src/components/menu/`):
- `smart-filter-bar.tsx` - Price range slider, dietary filters, sort dropdown
- `trending-section.tsx` - Horizontal scrollable trending items
- `recently-viewed-section.tsx` - Recently viewed items with clear button
- `favorites-section.tsx` - Saved favorite items
- `recommended-section.tsx` - Personalized recommendations
- `enhanced-menu-card.tsx` - Rich menu cards with ratings, prep time, quick add
- `swipeable-menu-cards.tsx` - Mobile swipeable card interface
- `full-screen-item-preview.tsx` - Full-screen item modal
- `category-pills.tsx` - Horizontal scrollable category pills
- `sticky-cart-bar.tsx` - Mobile sticky cart footer

**Gallery Components** (`src/components/gallery/`):
- `lightbox-viewer.tsx` - Full-screen image viewer with swipe
- `photo-of-day.tsx` - Featured photo component
- `video-section.tsx` - Video gallery with modal player
- `photo-contest.tsx` - Contest entries and submission form
- `customer-submissions.tsx` - Instagram-style customer photos

### Hooks
- `useMenuFavorites` - Manage favorites and recently viewed in localStorage
- `useGallery` - Gallery items, likes, photo of day, category filters
- `useIsMobile` - Responsive mobile detection (hydration-safe)

### Currency System (Centralized Indian Rupee Display)
The application uses a robust centralized currency system for consistent ₹ symbol display across all devices:

**Currency Library** (`src/lib/currency.ts`):
- `RUPEE_SYMBOL` / `RUPEE_UNICODE` - Exported constants for ₹ symbol
- `formatIndianNumber(amount, preserveDecimals=true)` - Formats numbers with Indian locale (e.g., 1,00,000), preserves decimals by default
- `formatPrice(amount, preserveDecimals=true)` - Returns object with symbol, value, and full formatted price
- `formatPriceRange(min, max, preserveDecimals=true)` - Range formatting
- `formatDiscount(type, value, preserveDecimals=true)` - Handles percentage, fixed, and BOGO discount types

**Currency Components** (`src/components/ui/currency.tsx`):
- `<Currency amount={500} preserveDecimals />` - Full price display with ₹ symbol
- `<Rupee />` - Standalone ₹ symbol
- `<DiscountBadge type="fixed" value={100} suffix="OFF" />` - Discount badges
- `<PrizeAmount amount={5000} />` - Prize/gift card amounts
- `<PriceRange min={100} max={500} />` - Price range display
- `<Price amount={299} />` - Simple price component using centralized system

**Decimal Precision**:
- `preserveDecimals=true` (default): Shows decimals when present (e.g., ₹99.50)
- `preserveDecimals=false`: Rounds to whole numbers (e.g., ₹100)

**CSS Classes** (in `globals.css`):
- `.currency-wrapper` - Base wrapper for currency elements
- `.rupee-symbol` - ₹ symbol with Noto Sans Devanagari font
- `.currency-value` - Numeric value with tabular nums
- `.price-display` - Bold price styling

**Font Stack**: Noto Sans Devanagari → Noto Sans → System fonts (for cross-device compatibility)

### External Dependencies
- **Firebase**: Firestore for real-time database, Firebase Admin for server-side operations
- **Cloudinary**: Cloud image upload and hosting for menu items and hero images
- **Google Genkit AI**: Menu item description generation
- **Next.js**: Core framework
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **Framer Motion**: Animation library
- **next-themes**: Dark/light mode functionality
- **react-intersection-observer**: Scroll animations
- **date-fns**: Date formatting

### Admin Workflows

**Managing Today's Special**:
1. Go to admin Settings & Special page
2. Fill in title, description, and price
3. Click "Save Today's Special"
4. Toggle active status to show/hide in menu
5. Changes appear instantly in the menu page banner

**Uploading Hero Image**:
1. Go to admin Settings & Special page
2. Click on hero image section to upload
3. Select image from computer
4. Image uploads to Cloudinary automatically
5. Preview shows on settings page and homepage

**Creating Promotions**:
1. Go to admin Promotions page
2. Click "New Promotion"
3. Fill in title, description, type (percentage/fixed/BOGO)
4. Set discount value
5. Choose start/end dates
6. Optional: Set promo code, usage limit, minimum purchase
7. Click "Create Promotion"
8. Promotion appears on homepage prominently when active

### Performance & SEO
- Individual product pages with Open Graph tags and schema markup
- Optimized for search engines with metadata
- Fast loading with Turbopack
- Image optimization with Next.js Image component
- Mobile-responsive design scores well on Core Web Vitals
- Structured data for rich search results
