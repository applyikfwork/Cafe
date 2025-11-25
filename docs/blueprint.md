# **App Name**: Cafe Central Station

## Core Features:

- Menu Management: Admin interface for creating, updating, and categorizing menu items with images, descriptions, pricing, and availability.
- Real-time Order Management: Admin interface for managing incoming orders, updating statuses, and assigning to staff; sends notifications via WhatsApp/SMS/email integrations upon order creation and updates via Firestore.
- Table Booking System: Customer-facing booking modal showing availability based on admin-defined capacity and time slots, plus admin interface for managing bookings and confirmations; also includes auto-confirm settings and notification templates.
- Theme Customization: Admin interface for changing the logo, colors (primary, secondary, accent, background, text), fonts (Google Fonts), button styles, and layout; one-click preset themes (Coffee, Modern, Minimal, Rustic).
- AI Item Description Generator: AI button in the Menu Manager that uses an LLM tool to generate compelling item descriptions to add that little extra sizzle.
- Promotions and Specials: Ability to create scheduled offers, attach to menu items or cart-level promotions; coupon code functionality (usage limits/expiry).
- Customer Order Placement: Customer-facing menu with category tabs, item cards (image, name, price, description), and variants; order flow collects customer details (name, phone, pickup/dine-in time) and creates an order in Firestore without payment processing, notifying the admin.

## Style Guidelines:

- Primary color: Soft coral (#F08080) evoking a sense of warmth and inviting atmosphere.
- Background color: Light peach (#F2D7D9), slightly desaturated version of the primary.
- Accent color: Muted gold (#D4AF37) for highlighting key actions and promotions.
- Headline font: 'Playfair', serif with an elegant, fashionable, high-end feel.
- Body font: 'PT Sans', humanist sans-serif combining a modern look and a little warmth or personality.
- Code font: 'Source Code Pro' for any displayed code snippets.
- Mobile-first responsive design.
- Clear separation of content sections with consistent spacing.