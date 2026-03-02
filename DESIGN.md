# LiveShopMarket Design Document
# Visual Design & Theme Guidelines

**Version 1.0**  
**February 2026**

---

## 1. Design Philosophy

LiveShopMarket embraces a vibrant, energetic, and playful design language that reflects the dynamic nature of live shopping. The design philosophy is built on three core principles:

- **Energy and Excitement:** The platform uses bold gradients, vibrant colors, and 3D illustrated elements to create an engaging, festive atmosphere that captures the excitement of live shopping events.

- **Clarity and Accessibility:** Despite the visual richness, the interface maintains clean layouts, clear typography, and intuitive navigation to ensure users can easily discover and join live streams.

- **Modern Playfulness:** The design balances professional credibility with approachable, fun aesthetics through the use of 3D isometric illustrations, rounded corners, and friendly visual elements.

---

## 2. Color Palette

### 2.1 Primary Colors

The primary color palette establishes the brand identity and is used consistently across the platform:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Neon Yellow-Green** | `#D4FF00` | Signature accent color for primary CTAs, "Sign Up" button, and "Remind Me" buttons. Creates high visibility and urgency. |
| **White** | `#FFFFFF` | Primary background color providing a clean canvas that makes colorful elements stand out. |
| **Deep Navy** | `#1A1A2E` | Logo text and primary navigation, providing strong contrast and readability. |
| **Charcoal** | `#333333` | Body text color for optimal readability while maintaining a modern appearance. |

### 2.2 Category-Specific Gradients

Each product category features distinctive gradient backgrounds that create visual variety while maintaining brand cohesion:

#### Tech & Gadgets
- **Gradient:** Blue → Cyan → Green  
- **Colors:** `#2563EB → #06B6D4 → #10B981`  
- **Illustrations:** 3D tech icons (game controller, drone, smartphone)  
- **Aesthetic:** Futuristic, tech-forward

#### Beauty & Personal Care
- **Gradient:** Pink → Magenta  
- **Colors:** `#FF6B9D → #C71585`  
- **Illustrations:** Beauty product illustrations (perfume bottles, hair dryers)  
- **Aesthetic:** Elegant and feminine

#### Wellness
- **Gradient:** Turquoise → Green  
- **Colors:** `#20D5C5 → #34D399`  
- **Illustrations:** Wellness icons (supplement bottles, yoga elements)  
- **Aesthetic:** Health and vitality

#### Sports & Fitness
- **Gradient:** Orange → Red  
- **Colors:** `#FF6B3D → #FF4B2B`  
- **Illustrations:** Athletic imagery (tennis rackets, lightning bolts)  
- **Aesthetic:** Energy and movement

#### Fashion
- **Gradient:** Purple → Blue  
- **Colors:** `#8B5CF6 → #3B82F6`  
- **Illustrations:** Fashion icons (clothing and accessories)  
- **Aesthetic:** Sophistication and style

### 2.3 Functional Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Live Indicator** | `#FF6B3D` | Orange with white "LIVE" text, creating urgency and immediate recognition |
| **Alert/Notification** | `#FF7B5C` | Warm coral used in live stream notification banners |
| **Favorite/Heart Icon** | `#FF8C42` | Orange-pink gradient indicating saved or favorited content |
| **Neutral Gray** | `#E5E5E5` | Light gray for placeholder cards and inactive elements |

---

## 3. Typography

### 3.1 Font Family

The platform uses a clean, modern sans-serif font stack that prioritizes readability across all devices:

- **Primary Font:** Inter or similar system font (SF Pro, -apple-system, BlinkMacSystemFont)
- **Fallback:** Arial, Helvetica, sans-serif
- **Logo:** Bold, rounded sans-serif with strong character weight

### 3.2 Type Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| **Hero Heading (Homepage)** | 48-64px | Bold | Main "LiveShopMarket" title |
| **Page Title** | 36-42px | Bold | Section headers like "All Categories" |
| **Category Banner Title** | 32-36px | Bold | White text over gradient banners |
| **Section Heading** | 24-28px | Semi-Bold | "Fashion", "Tech & Gadgets", etc. |
| **Card Title** | 18-20px | Semi-Bold | Brand names and stream titles |
| **Body Text** | 16px | Regular | Descriptions and metadata |
| **Small Text** | 14px | Regular | Timestamps and secondary info |
| **Button Text** | 16-18px | Semi-Bold | CTAs like "Sign Up", "Watch on" |

### 3.3 Text Styling

- **Line Height:** 1.5-1.6 for body text, ensuring comfortable reading
- **Letter Spacing:** Tight (-0.02em) for headings, normal for body text
- **Color Contrast:** Maintains WCAG AA standards with dark text on light backgrounds

---

## 4. Layout & Spacing

### 4.1 Grid System

- **Desktop:** 12-column grid with 24px gutters, max width 1440px
- **Tablet:** 8-column grid adapting to smaller screens
- **Mobile:** 4-column grid with single-column content stacking

### 4.2 Spacing Scale

The platform uses an 8px base unit for consistent spacing:

| Size | Usage |
|------|-------|
| **8px** | Micro spacing for tight elements |
| **16px** | Small spacing between related items |
| **24px** | Medium spacing between cards and sections |
| **32px** | Large spacing between major sections |
| **48px** | Extra large spacing for page sections |
| **64px** | Section dividers |

### 4.3 Container Structure

- **Header:** Fixed navigation bar (72px height) with white background, logo left, navigation center, CTA right
- **Content Container:** Max width 1440px, centered with horizontal padding 24-48px
- **Card Layouts:** Flexible grid with 3-4 columns on desktop, 2 on tablet, 1 on mobile

---

## 5. Component Design

### 5.1 Navigation Header

- **Background:** Clean white with subtle shadow for depth
- **Logo:** "LiveShopMarket" in bold, dark navy, positioned left
- **Navigation Links:** Center-aligned, dark text, 16px, with hover underline effect
- **Primary CTA:** Neon yellow-green "Sign Up" button with rounded corners (24px radius), right-aligned
- **User Account:** "My Account" button in yellow-green for logged-in users

### 5.2 Category Cards

- **Dimensions:** Rectangular cards with 3:2 aspect ratio
- **Border Radius:** 16px for modern, friendly appearance
- **Background:** Vibrant category-specific gradients with 3D isometric illustrations
- **Title:** White text overlaid on semi-transparent rounded rectangle for readability
- **Hover State:** Subtle lift effect with shadow, scale 1.02
- **Placeholder:** Light gray (#E5E5E5) with centered "Category" text

### 5.3 Live Stream Cards

- **Layout:** Vertical card with thumbnail, title, metadata stack
- **Thumbnail:** 16:9 ratio with gray placeholder when no image
- **LIVE Badge:** Orange pill-shaped badge (#FF6B3D) positioned top-left with play icon
- **Platform Badges:** White rounded rectangles showing "Watch on Instagram", "Watch on QVC", "Watch on TikTok" with respective logos
- **Stream Title:** 18px semi-bold, dark text
- **Brand Name:** 14px regular, gray text below title

### 5.4 Brand Cards

- **Square Format:** Equal width and height with 12px border radius
- **Thumbnail:** Gray placeholder with brand image
- **Favorite Icon:** Heart icon (outline/filled) positioned top-right
- **Brand Name:** Centered below card in semi-bold text

### 5.5 Buttons

#### Primary Button (CTA)
- **Background:** Neon yellow-green (#D4FF00)
- **Text:** Dark gray/black for maximum contrast
- **Border Radius:** 24px (fully rounded)
- **Padding:** 12px 32px
- **Hover State:** Darkens slightly, no border change

#### Secondary Button (Watch on, Remind Me)
- **Background:** White or light gray
- **Border:** 1px solid gray
- **Text:** Dark gray, with platform icon
- **Border Radius:** 20px

### 5.6 Search Bar

- **Background:** White with light border
- **Border Radius:** 24px (pill shape)
- **Placeholder:** Gray text, e.g., "Search Tech Brands, Products..."
- **Icon:** Magnifying glass on right side

### 5.7 Live Stream Banner Notification

- **Background:** Bright yellow-green gradient with coral accent
- **Layout:** Horizontal banner at bottom of screen with megaphone icon
- **Text:** Bold message: "Brand Name is currently live. Join their stream now!"
- **Platform Buttons:** Multiple "Watch on" buttons with Instagram, QVC, TikTok logos
- **Animation:** Bell icon with subtle ring animation

---

## 6. Visual Elements & Illustrations

### 6.1 3D Isometric Illustrations

The platform features custom 3D isometric illustrations that bring categories to life:

- **Style:** Playful, rounded 3D objects with soft shadows and highlights
- **Color Treatment:** Matches category gradients with additional accent colors
- **Integration:** Layered within gradient backgrounds, creating depth

#### Examples by Category

**Tech:**
- Game controller, drone, smartphone, laptop, headphones

**Beauty:**
- Perfume bottles, makeup compacts, hair dryer

**Wellness:**
- Supplement bottles, yoga mat, wellness symbols

**Sports:**
- Tennis racket, basketball, lightning bolts, fitness equipment

**Fashion:**
- Clothing items, shoes, accessories, shopping bag

### 6.2 Hero Section Imagery

- **Photography Style:** Lifestyle photos showing diverse, excited people using smartphones
- **Composition:** Person prominently featured with colorful abstract shapes and icons floating around
- **Color Overlay:** Complementary gradient overlays on select imagery
- **Mood:** Energetic, joyful, and aspirational

### 6.3 Icons

- **Style:** Rounded, filled icons with consistent 2px stroke weight
- **Size:** 20-24px standard, 32px for feature icons
- **Key Icons:** Heart (favorite), play button, bell (notifications), megaphone, search, user profile, sort/filter
- **Platform Icons:** Integrated Instagram, TikTok, QVC, Facebook logos in brand colors

---

## 7. Page-Specific Design

### 7.1 Homepage

#### Hero Section
- **Background:** Vibrant blue gradient with floating video frame elements
- **Title:** Large "LiveShopMarket" in white, overlaid on decorative elements
- **Tagline:** "Lorem ipsum sit dolor consectur" in lighter weight
- **Search Bar:** Prominent centered search with placeholder "What are you searching for?"

#### Category Sections
- **Layout:** Horizontal scrollable rows, each labeled with category name and arrow icon
- **Cards:** 4-5 brand cards per visible row
- **Sections:** Fashion, Tech & Gadgets, Health & Wellness arranged vertically

#### Call-to-Action Banner
- **Background:** Deep blue with lifestyle photography
- **Headline:** "Never Miss a Live Moment"
- **Copy:** Brief description of notification features
- **CTA Button:** Yellow-green "Sign Up for Free"

### 7.2 All Categories Page

- **Header:** Light gray background with breadcrumb ("All Categories")
- **Title:** Centered "All Categories" in large bold text
- **Grid:** 3 columns on desktop, responsive to 2 and 1 column
- **Cards:** Full gradient category cards with illustrations (Tech & Gadgets featured), gray placeholders for future categories

### 7.3 Single Category Page

#### Category Hero Banner
- **Full-width banner** with category-specific gradient and 3D illustrations
- **Title:** Large category name (e.g., "Tech & Gadgets") centered in white
- **Height:** ~240px, providing strong visual identity

#### Filter Controls
- **Left:** Yellow-green button "Browse Live Brands"
- **Right:** Search bar and sort icon

#### Content Grid
- **Live Streams Section:** Top 3 live stream cards prominently displayed
- **Brand Grid:** 5 columns of brand cards below live streams

### 7.4 Brand Profile Page

- **Header:** Light gray background with breadcrumb
- **Banner:** Gray placeholder for brand hero image (16:4 ratio)
- **Profile Section:** Brand avatar (circular, 120px), brand name, category tag, timestamp, follower count, Top 3 badge
- **Description:** Multi-line bio with Lorem ipsum placeholder
- **Platform Links:** Social media icons (TikTok, Instagram, QVC)
- **Favorite Button:** Heart icon with "Favorite this brand and get notified when they go live!"

#### Upcoming Streams Table
- **Columns:** Date, Time, Stream Title, Platforms, Actions
- **Rows:** Clean white background with light dividers
- **Buttons:** Yellow-green "Remind Me" for each scheduled stream

#### Previous Streams
- **Grid:** Horizontal scrollable thumbnail grid of past streams

### 7.5 Sign-Up Modal

- **Layout:** Split modal - left form, right imagery
- **Left Panel:** White background with form fields (Email, Mobile, Gender, Age)
- **Right Panel:** Yellow-green gradient with lifestyle photo of person using phone, megaphone icon, text callout about live shopping
- **CTA:** Full-width yellow-green "Create My Account" button
- **Mobile:** Simplified single-column version with image at top

---

## 8. Animation & Interaction

### 8.1 Micro-interactions

- **Card Hover:** Subtle lift (4px) with shadow expansion, 200ms ease transition
- **Button Hover:** Color darkening by 10%, 150ms transition
- **Favorite Icon:** Scale pulse on click, fill transition
- **Navigation Links:** Underline slide-in from left, 200ms

### 8.2 LIVE Badge Animation

- **Pulse Effect:** Gentle 1.05 scale pulse, 1.5s infinite loop
- **Glow:** Subtle orange outer glow for prominence

### 8.3 Banner Notification

- **Entry:** Slide up from bottom, 300ms ease-out
- **Bell Icon:** Continuous gentle shake animation

---

## 9. Responsive Design

### 9.1 Breakpoints

| Breakpoint | Range | Layout |
|------------|-------|--------|
| **Desktop** | 1440px and above | Full layout |
| **Laptop** | 1024-1439px | 3 columns |
| **Tablet** | 768-1023px | 2 columns |
| **Mobile** | 320-767px | 1 column, stacked |

### 9.2 Mobile Adaptations

- **Navigation:** Hamburger menu replacing horizontal nav
- **Cards:** Full width with maintained aspect ratios
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Typography:** Scales down proportionally, maintaining readability
- **Sign-up Modal:** Single column layout with image header

---

## 10. Accessibility

- **Color Contrast:** WCAG AA compliant (4.5:1 for body text, 3:1 for large text)
- **Focus States:** Clear 2px outline on interactive elements
- **Alt Text:** Required for all images and illustrations
- **Screen Reader:** Semantic HTML with proper ARIA labels
- **Keyboard Navigation:** Full tab order support

---

## 11. Design System Summary

The LiveShopMarket design system creates a cohesive, energetic visual language that:

- **Captures Attention:** Through vibrant gradients, bold colors, and playful 3D illustrations
- **Facilitates Discovery:** With clear category organization, intuitive search, and prominent LIVE indicators
- **Drives Action:** Through strategically placed CTAs, notifications, and platform-specific buttons
- **Maintains Consistency:** Across all pages with reusable components and standardized spacing
- **Ensures Accessibility:** Meeting modern web standards for inclusive user experience

This design system provides a foundation for scaling the platform while maintaining visual identity and user experience quality.
