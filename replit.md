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

### Recent Improvements (Latest Session)
- **Rupee Symbol (₹) Display** - Fixed currency symbol rendering across entire site using Noto Sans font specifically for the symbol while preserving cafe theme fonts
- **Admin Promotions** - Fixed Firebase "undefined values" error; admins can now create promotions without filling optional fields
- **Admin Settings Panel** - Added "Settings & Special" admin page with:
  - Hero image upload directly from admin (uploads to Cloudinary)
  - "Today's Special" management (title, description, price, active status)
  - Live preview of Today's Special banner
  - Cafe information editor (name, hours, address, phone, social media)
- **Dynamic Today's Special** - Banner at top of menu page now pulls from admin settings in real-time
- **Powerful Home Page Enhancements**:
  - Stunning full-page promotion showcase between hero and featured items
  - Animated gradient backgrounds with visual effects
  - Responsive mobile-first design
  - Large discount display with "Claim Now" CTA
  - Promo code display section
  - Valid date range information
- **Mobile Optimization** - Enhanced responsive design throughout, especially for smaller screens

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
- `/menu` - Full menu with search, filters by tags, category tabs
- `/menu/[id]` - Individual product detail pages with full information, ingredients, related items, schema markup for SEO
- `/admin` - Protected admin dashboard
- `/admin/menu` - Menu item management
- `/admin/promotions` - Promotion management with validation
- `/admin/settings` - Settings, hero image, and Today's Special management

**Data Management**: 
- Firebase Firestore for real-time data synchronization
- Cloudinary for image uploads and hosting (both menu items and hero images)
- Real-time subscriptions via custom hooks
- Google Genkit AI for description generation

**Real-time Features**: 
- Custom hooks (`useMenuItems`, `usePromotions`, `useTodaysSpecial`) for real-time data
- Client-side rendered pages to support real-time subscriptions
- Immediate updates when admin makes changes

**Search & Discovery**:
- Full-text search by menu item name and description
- Filter by dietary tags (veg, spicy, gluten-free, new)
- Category-based browsing with tabs
- Individual product pages with SEO optimization

**Deployment**: 
- Configured for Replit environment with proper host/port settings
- Optimized for Netlify deployments
- Build tools in main dependencies

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
