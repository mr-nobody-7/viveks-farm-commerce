# Vivek's Farm Commerce 🌾

A full-featured e-commerce platform for farm-fresh products including ghee, pickles, honey, oils, and traditional sweets. Built with modern web technologies for an excellent shopping experience on both desktop and mobile devices.

**Live Demo**: [viveks-farm.com](https://viveks-farm.com) | **Admin Dashboard**: [Admin Portal](https://viveks-farm.com/admin)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Customer Features](#-customer-features)
  - [Admin Features](#-admin-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Key Pages & Routes](#key-pages--routes)
- [Authentication & Security](#authentication--security)
- [Payment Integration](#payment-integration)
- [Environment Variables](#environment-variables)
- [Code Quality](#code-quality)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 📖 Overview

**Vivek's Farm Commerce** is a production-ready e-commerce platform built as a **pnpm monorepo** with:

- 🎨 **Modern Frontend**: Next.js 16 with TypeScript, Shadcn UI, and Tailwind CSS 4
- ⚡ **Robust Backend**: Express.js 5 with MongoDB and TypeScript
- 💳 **Payment Processing**: Razorpay integration + Cash on Delivery option
- 👨‍💼 **Admin Dashboard**: Complete product, order, and coupon management
- 📱 **Mobile-First**: Fully responsive design optimized for all devices
- 🔐 **Security First**: JWT authentication, bcrypt hashing, rate limiting
- 📊 **Analytics**: Dashboard with revenue, order status, and payment metrics

---

## ✨ Features

### 🛍️ Customer Features

#### **Authentication & Profile Management**
- **OTP-Based Login**: Secure 10-digit mobile number + 6-digit OTP (5-min expiry)
- **User Profile**: Update name and manage account settings
- **Multi-Address Management**: Save multiple delivery addresses with default selection
  - Full name, phone, address, city, state, pincode
  - Add, edit, delete, and set default addresses
- **JWT Tokens**: Secure httpOnly cookies with 7-day expiration

#### **Shopping Experience**
- **Product Catalog**: Browse 100+ farm products across 13+ categories
- **Advanced Filtering**: Filter by category with real-time search
- **Product Details Page**: High-quality images, descriptions, and variants
- **Product Variants**: Multiple sizes (250g, 500g, 1kg) with different pricing
- **Responsive Images**: Optimized via Cloudinary CDN
- **Hero Carousel**: Featured products showcase on homepage (auto-rotating, 4.5s interval)
- **Category Icons**: Visual navigation with category-specific icons
- **Product Categories**:
  - Ghee, Sweets, Pickles, Honey, Oils, Spices, Flours, Millets, Rice, Pulses, Cereals, Snacks

#### **Shopping Cart**
- **Add/Remove Products**: Manage cart with variant selection
- **Quantity Controls**: Increment/decrement with real-time updates
- **Cart Summary**: View subtotal and item count
- **Persistent Cart**: Zustand state management (client-side persistence)
- **Quick Add**: Direct add-to-cart with quantity controls
- **Empty Cart Handling**: Friendly messaging when cart is empty

#### **Wishlist**
- **Save for Later**: Add products to personal wishlist
- **Wishlist Management**: View, remove, and manage saved items
- **Move to Cart**: Add wishlist items directly to shopping cart
- **Persistent Storage**: Client-side Zustand store with localStorage
- **Wishlist Count Badge**: Header badge showing number of wishlist items

#### **Checkout & Payments**
- **Address Selection**: Use saved address or add new one during checkout
- **Coupon Code Validation**: Apply discount codes with real-time validation
- **Payment Methods**:
  - **Razorpay**: Credit/debit cards, UPI, digital wallets
  - **Cash on Delivery (COD)**: Admin-configurable toggle
- **Order Pricing**:
  - Subtotal from items
  - Delivery charge (configurable, default ₹49)
  - Coupon discount (percentage or fixed amount)
  - Final total with all calculations
- **Coupon Features**:
  - Percentage-based discounts (0-100%)
  - Fixed amount discounts (₹0-∞)
  - Minimum order amount requirements
  - Maximum discount caps
  - Applicable products selection
  - Usage limits and expiry dates
  - Real-time validation and feedback

#### **Order Management**
- **Order Placement**: Create orders with selected items and address
- **Order History**: View all orders sorted by latest first
- **Order Details**: Complete order information including:
  - Items with variants, quantities, and prices
  - Shipping address
  - Payment method and status
  - Order status tracking
  - Order ID and timestamps
- **Order Status Tracking**: Real-time workflow
  - PENDING → PLACED → PACKED → SHIPPED → DELIVERED
- **Payment Status**: Track payment confirmation (PENDING/PAID/FAILED)
- **Order Confirmation Page**: Post-purchase confirmation with order ID

#### **Customer Dashboard**
- **Profile Management**: Update name and preferences
- **Address Book**: Full CRUD operations on saved addresses
- **Order History**: Browse and filter previous orders
- **Order Details**: View detailed information for any order
- **Default Address Selection**: Set primary delivery address

#### **Site Navigation & Pages**
- **Header**: Branding, navigation links, cart badge, profile menu
- **Footer**: Links, contact information, WhatsApp integration
- **Home Page**:
  - Hero carousel with featured products
  - Trust points and company values
  - Customer testimonials
  - Category showcase
- **Shop Page**: Full product catalog with advanced filtering
- **Category Pages**: Products filtered by category with breadcrumbs
- **Product Details Page**: Images, description, variants, pricing, reviews
- **About Us Page**: Company story and brand values
- **Contact Us Page**: Contact form with email submission
- **Cart Page**: Review items before checkout
- **Checkout Page**: Address, coupon, and payment selection

#### **UX/UI Features**
- **Toast Notifications**: Real-time feedback (Sonner library)
- **Loading Skeletons**: Placeholder content while fetching data
- **Responsive Design**: Optimized for mobile (320px), tablet, and desktop
- **Dark Mode Support**: Theme switching with Shadcn UI
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Empty States**: Friendly messages for empty cart/wishlist/orders

#### **SEO & Performance**
- **Dynamic Metadata**: Page-specific titles, descriptions, and OG tags
- **Open Graph Tags**: Rich preview on social media sharing
- **Twitter Cards**: Optimized Twitter sharing
- **Structured Data**: Schema.org markup for products and organization
- **Robot Meta Tags**: Proper indexing control (noindex on cart/profile)
- **Image Optimization**: Next.js Image component for responsive images
- **CSS Optimization**: Tailwind CSS 4 with purging

---

### 👨‍💼 Admin Features

#### **Admin Authentication**
- **Secure Login**: Email and password-based authentication
- **JWT Token Management**: 7-day token expiration with refresh capability
- **Login Notifications**: Email alert on each successful admin login
- **Session Management**: Secure logout with cookie clearing
- **Role-Based Access**: Admin-only routes protected with middleware

#### **Dashboard & Analytics**

**Key Metrics**:
- Total orders count (all time)
- Total revenue (₹) from paid orders only
- Pending orders awaiting action
- Real-time dashboard updates

**Analytics Dashboard**:
- Payment status summary:
  - Count of PAID orders
  - Count of FAILED payments
  - Count of PENDING payments
- Order status breakdown:
  - PENDING orders
  - PLACED orders
  - PACKED orders
  - SHIPPED orders
  - DELIVERED orders
- Monthly revenue trends:
  - Bar charts showing monthly revenue
  - Order count per month
  - Trend analysis over time

**Charts & Visualizations**:
- Interactive bar charts (revenue by month)
- Pie charts (payment/order status distribution)
- Responsive layouts for all screen sizes
- Real-time data updates

#### **Product Management**

**Product CRUD Operations**:
- **Create Products**:
  - Product name, description, detailed information
  - Category assignment
  - Multiple image upload via Cloudinary
  - Create variants with labels (250g, 500g, 1kg, etc.)
  - Set price per variant with optional original price (strikethrough)
  - Activate/deactivate entire product or individual variants
- **Read Products**:
  - List all products with pagination (20 per page)
  - View product details including images and variants
  - Sort by creation date
- **Update Products**:
  - Edit name, description, category, images
  - Modify variants and pricing
  - Toggle product active/inactive status
  - Change variant availability
- **Delete Products**:
  - Soft delete (disable instead of permanent removal)
  - Restore disabled products
  - Preserve order history

**Image Management**:
- **Cloudinary Integration**: Upload multiple images per product
- **Image URLs**: Store secure CDN links
- **Image Ordering**: Arrange images in preferred order
- **Image Deletion**: Remove unused images

**Variant Management**:
- Create multiple variants per product
- Set label (e.g., "250g Ghee")
- Set pricing per variant
- Optional original price for discount indication
- Activate/deactivate variants individually
- Track inventory per variant (via order history)

**Product Features**:
- Auto-generate unique URL-friendly slugs
- Category association for organization
- Active/inactive toggle for visibility
- Product search and filter support
- Pagination with 20 products per page

#### **Category Management**

**Category CRUD Operations**:
- **Create Categories**:
  - Category name and description
  - Auto-generate unique slugs
  - Set as active/inactive
- **Read Categories**:
  - View all categories with descriptions
  - See products count per category
  - View category performance metrics
- **Update Categories**:
  - Edit name and description
  - Modify category visibility
  - Update slug if needed
- **Delete Categories**:
  - Soft delete (disable instead of remove)
  - Preserve product associations
  - Archive old categories

**Category Features**:
- Unique slug generation for URL routing
- Active/inactive status management
- Product association tracking
- Hierarchical organization

#### **Order Management**

**Order Listing & Filtering**:
- View all orders with pagination (20 per page)
- Sort by creation date (newest first)
- Filter by status (ALL, SUCCESS, FAILED, PENDING)
- View user information (mobile, name)
- Real-time order count updates

**Order Details**:
- Customer information (name, mobile, email)
- Shipping address (full delivery details)
- Order items with:
  - Product names
  - Selected variants and labels
  - Unit prices
  - Quantities
  - Item totals
- Pricing breakdown:
  - Subtotal amount
  - Delivery charge
  - Coupon discount applied
  - Final total
- Payment information:
  - Payment method (ONLINE/COD)
  - Payment status (PENDING/PAID/FAILED)
  - Razorpay transaction IDs
  - Payment timestamp
- Order timestamps (creation, last update)

**Order Status Management**:
- Update order status through workflow:
  - PENDING → PLACED → PACKED → SHIPPED → DELIVERED
  - CANCELLED (for failed orders)
- Status validation prevents invalid transitions
- Real-time status change notifications
- Order status history tracking
- Toast notifications on status updates

**Order Operations**:
- View detailed order information
- Update order status
- Track payment status
- Monitor delivery progress
- Handle failed payments
- Process refunds (if needed)

#### **Coupon Management**

**Coupon CRUD Operations**:
- **Create Coupons**:
  - Unique coupon code (auto-converted to uppercase)
  - Description and usage notes
  - Choose discount type (PERCENTAGE or FIXED)
  - Set discount value
  - Define minimum order amount
  - Set maximum discount cap
  - Select applicable products (empty = all products)
  - Set expiry date
  - Set usage limit
  - Set as active/inactive
- **Read Coupons**:
  - View all coupons with details
  - See usage count vs limit
  - View applicable products
  - Check expiry status
  - Pagination support
- **Update Coupons**:
  - Modify all coupon parameters
  - Change discount value
  - Update expiry date
  - Modify usage limits
  - Toggle active status
  - Update applicable products
- **Delete Coupons**:
  - Remove coupons from system
  - Archive expired coupons

**Coupon Configuration**:
- **Discount Types**:
  - Percentage-based (0-100%) - e.g., 10% off
  - Fixed amount (₹) - e.g., ₹100 off
- **Constraints**:
  - Minimum order amount (e.g., min ₹500 to use)
  - Maximum discount cap (e.g., max ₹500 discount)
- **Usage Management**:
  - Usage limit per coupon (e.g., valid for 100 orders)
  - Usage tracking and counting
  - Automatic validation in checkout
- **Scheduling**:
  - Set expiry date for seasonal/promotional coupons
  - Automatic expiry validation
  - Date-based visibility control
- **Product Targeting**:
  - Select specific products (e.g., ghee only)
  - Apply to all products (if empty)
  - Bulk product selection
- **Status Management**:
  - Active/inactive toggle
  - Control coupon visibility in checkout

**Coupon Validation**:
- Real-time validation in customer checkout
- Check minimum order amount
- Verify coupon is active and not expired
- Check usage limits
- Validate product applicability
- Calculate discount correctly

#### **Settings & Configuration**

**App-Wide Settings**:
- **Cash on Delivery (COD)**:
  - Toggle COD availability for customers
  - Enable/disable COD orders
  - Displayed in checkout if enabled
- **Delivery Charge**:
  - Set delivery charge amount (₹0-∞, default ₹49)
  - Apply to all orders
  - Update dynamically without restart
- **Settings Persistence**:
  - Save changes to database
  - Apply globally to all customers
  - Real-time update without cache issues

#### **Admin UI Components**

**Data Tables**:
- Pagination with page/limit controls
- Sortable columns
- Product/Order/Category/Coupon tables
- Loading skeletons during data fetch
- Empty state handling
- Responsive horizontal scrolling on mobile

**Forms**:
- Create/edit product forms with validation
- Create/edit category forms
- Coupon configuration forms
- Settings update forms
- Real-time validation feedback
- Error message display

**Action Buttons**:
- Edit, delete, status update buttons
- Confirmation dialogs for destructive actions
- Toast notifications for operation success/failure
- Loading spinners during async operations
- Disabled state during submission

**Toast Notifications**:
- Success messages on CRUD operations
- Error messages with details
- Delete confirmation warnings
- Status update confirmations
- Real-time feedback to admin

**Loading States**:
- Button spinners during form submission
- Per-item toggle spinners during status updates
- Full-page skeletons while loading data
- Disable interactions during loading
- Clear indication of in-progress operations

**Mobile Optimization for Admin**:
- Responsive sidebar (hidden on mobile)
- Horizontal scrollable tables on small screens
- Mobile-friendly form layouts
- Touch-optimized buttons and controls
- Collapsible navigation on mobile

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router, server components, image optimization |
| **TypeScript** | Type-safe JavaScript for robust frontend |
| **React 19** | UI library with hooks and suspense |
| **Shadcn UI** | Component library built on Radix UI primitives |
| **Tailwind CSS 4** | Utility-first CSS framework with responsive design |
| **Zustand** | Lightweight state management (cart, wishlist, auth) |
| **TanStack React Query** | Server state management and data fetching |
| **React Hook Form** | Efficient form handling |
| **Zod** | TypeScript-first schema validation |
| **Lucide React** | Beautiful SVG icon library |
| **Sonner** | Toast notifications library |
| **Clsx + Tailwind Merge** | Conditional class name utility (`cn()`) |

### Backend

| Technology | Purpose |
|---|---|
| **Express.js 5** | Web framework for Node.js |
| **TypeScript** | Type-safe backend code |
| **MongoDB** | NoSQL database for flexible data storage |
| **Mongoose** | MongoDB object modeling |
| **JWT** | JSON Web Token authentication |
| **Bcrypt** | Password hashing and security |
| **Zod** | Request/response validation |
| **Razorpay** | Payment gateway integration |
| **Cloudinary** | Image hosting and CDN |
| **Brevo** | Email service (formerly Sendinblue) |
| **Multer** | File upload handling |
| **Cors** | Cross-origin resource sharing |

### DevOps & Tools

| Technology | Purpose |
|---|---|
| **pnpm** | Fast, disk-space efficient package manager |
| **Biome** | Linting and code formatting (replaces ESLint + Prettier) |
| **tsx** | TypeScript execution for development |
| **Railway** | Deployment and hosting platform |
| **GitHub** | Version control and CI/CD |

---

## 📁 Project Structure

```
viveks-farm-commerce/
├── apps/
│   ├── frontend/                      # Next.js application
│   │   ├── app/                       # Next.js App Router
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── layout.tsx            # Root layout with providers
│   │   │   ├── shop/                 # Shop pages
│   │   │   │   ├── page.tsx          # All products
│   │   │   │   ├── [category]/       # Category products
│   │   │   │   └── layout.tsx        # Shop layout
│   │   │   ├── product/
│   │   │   │   └── [product_id]/     # Product details
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/             # Checkout flow
│   │   │   ├── order-success/        # Order confirmation
│   │   │   ├── profile/              # Customer profile
│   │   │   ├── wishlist/             # Wishlist page
│   │   │   ├── about-us/             # About page
│   │   │   ├── contact-us/           # Contact page
│   │   │   └── admin/                # Admin dashboard
│   │   │       ├── dashboard/        # Admin analytics
│   │   │       ├── products/         # Product management
│   │   │       ├── categories/       # Category management
│   │   │       ├── orders/           # Order management
│   │   │       └── coupons/          # Coupon management
│   │   ├── components/               # React components
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   ├── Footer.tsx            # Footer
│   │   │   ├── ProductCard.tsx       # Product display
│   │   │   ├── HeroCarousel.tsx      # Featured carousel
│   │   │   └── ui/                   # Shadcn components
│   │   ├── lib/
│   │   │   ├── api.ts               # API client
│   │   │   ├── constants.ts         # App constants
│   │   │   ├── utils.ts             # Utilities (cn())
│   │   │   ├── stores/              # Zustand stores
│   │   │   │   ├── cart-store.ts    # Cart state
│   │   │   │   ├── wishlist-store.ts # Wishlist state
│   │   │   │   └── auth-store.ts    # Auth state
│   │   │   └── data/                # Static data
│   │   ├── providers/               # React context providers
│   │   │   ├── cart-store-provider.tsx
│   │   │   ├── react-query-provider.tsx
│   │   │   └── auth-hydrator.tsx
│   │   ├── types/                   # TypeScript definitions
│   │   ├── public/                  # Static files
│   │   └── globals.css              # Global styles
│   │
│   └── backend/                      # Express.js application
│       ├── src/
│       │   ├── server.ts            # Server entry point
│       │   ├── app.ts               # Express app setup
│       │   ├── db/
│       │   │   └── connect.ts       # MongoDB connection
│       │   ├── models/              # Mongoose schemas
│       │   │   ├── user.model.ts
│       │   │   ├── product.model.ts
│       │   │   ├── category.model.ts
│       │   │   ├── order.model.ts
│       │   │   ├── coupon.model.ts
│       │   │   ├── admin.model.ts
│       │   │   ├── otp.model.ts
│       │   │   └── app-config.model.ts
│       │   ├── routes/              # API routes
│       │   │   ├── auth.route.ts    # User authentication
│       │   │   ├── product.route.ts # Products & categories
│       │   │   ├── order.route.ts   # Orders
│       │   │   ├── payment.route.ts # Razorpay integration
│       │   │   ├── user.route.ts    # User profile & addresses
│       │   │   ├── admin.route.ts   # Admin dashboard
│       │   │   ├── settings.route.ts # App settings
│       │   │   └── contact.route.ts # Contact form
│       │   ├── middleware/          # Express middleware
│       │   │   ├── auth.middleware.ts    # User auth check
│       │   │   └── admin.middleware.ts   # Admin auth check
│       │   ├── lib/
│       │   │   └── mailer.ts        # Email sending
│       │   ├── utils/
│       │   │   └── jwt.ts           # JWT utilities
│       │   └── seed/                # Database seeding
│       │       ├── seed.ts          # Initial data
│       │       └── reseed.ts        # Reset data
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                         # Shared packages (future)
│
├── biome.json                        # Code quality config
├── pnpm-workspace.yaml               # Monorepo config
├── package.json                      # Root package
├── railway.json                      # Railway deployment
├── nixpacks.toml                     # Nix packaging
├── DEPLOYMENT.md                     # Deployment guide
└── README.md                         # This file
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js**: v18 or higher (v20+ recommended)
- **pnpm**: v10.28.1 or higher (install via `npm install -g pnpm`)
- **MongoDB**: Local or cloud instance (MongoDB Atlas recommended)
- **Cloudinary**: Account for image hosting (free tier available)
- **Razorpay**: Account for payment processing (test & live keys)
- **Brevo**: Account for email notifications (formerly Sendinblue)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/viveks-farm-commerce.git
cd viveks-farm-commerce
```

### 2. Install Dependencies

```bash
# Install all dependencies in the monorepo
pnpm install
```

### 3. Setup Environment Variables

#### Backend (.env)

Create `apps/backend/.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/viveks-farm

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Admin JWT Secret
ADMIN_JWT_SECRET=your_admin_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Brevo Email Service
BREVO_API_KEY=your_brevo_api_key
ADMIN_EMAIL=admin@viveksfarm.com

# CORS
CORS_ORIGIN=http://localhost:3000

# Node Environment
NODE_ENV=development
PORT=4000
```

#### Frontend (.env.local)

Create `apps/frontend/.env.local`:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Initialize Database

```bash
# Seed initial data (products, categories, admin account)
cd apps/backend
pnpm run seed
```

This creates:
- Admin account: `admin@viveksfarm.com` / `password123`
- Sample products and categories
- Default app configuration

---

## ▶️ Running the Project

### Development Mode (Both Frontend & Backend)

```bash
# From root directory - runs both apps concurrently
pnpm dev
```

This starts:
- 🎨 Frontend: http://localhost:3000
- ⚡ Backend: http://localhost:4000

### Individual App Development

```bash
# Frontend only
cd apps/frontend
pnpm dev
# → http://localhost:3000

# Backend only
cd apps/backend
pnpm dev
# → http://localhost:4000
```

### Code Quality

```bash
# Run Biome linting and auto-format (from root)
pnpm check

# Check only (no changes)
pnpm lint

# Format only
pnpm format
```

**Note**: Always run `pnpm check` before committing to ensure code style consistency (tabs, double quotes).

### Build for Production

```bash
# Build both apps
pnpm build

# Build individual apps
cd apps/frontend && pnpm build
cd apps/backend && pnpm build
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:4000/api
```

### Authentication Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/request-otp` | Request OTP for login | ❌ |
| POST | `/auth/verify-otp` | Verify OTP and login | ❌ |
| GET | `/users/me` | Get current user profile | ✅ |
| PATCH | `/users/profile` | Update user name | ✅ |

### User Address Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/addresses` | Add new address | ✅ |
| PATCH | `/users/addresses/:id` | Update address | ✅ |
| DELETE | `/users/addresses/:id` | Delete address | ✅ |
| PATCH | `/users/addresses/:id/default` | Set as default | ✅ |

### Product & Category Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Get all active products | ❌ |
| GET | `/products/:slug` | Get single product | ❌ |
| GET | `/categories` | Get all active categories | ❌ |
| GET | `/categories/:slug/products` | Get products by category | ❌ |

### Order Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/orders/user` | Get user's orders | ✅ |
| GET | `/orders/:id` | Get single order details | ✅ |
| POST | `/orders` | Create new order | ✅ |
| POST | `/orders/coupon/validate` | Validate coupon code | ✅ |

### Payment Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/payments/create-order` | Create Razorpay order | ✅ |
| POST | `/payments/verify` | Verify payment signature | ✅ |

### Settings Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/settings` | Get app settings (COD, delivery charge) | ❌ |

### Contact Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/contact` | Submit contact form | ❌ |

### Admin Routes

**Base**: `/api/admin` (requires admin authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Admin login with email/password |
| POST | `/logout` | Admin logout |
| GET | `/dashboard` | Dashboard metrics |
| GET | `/analytics` | Detailed analytics data |
| GET | `/settings` | Get settings |
| PATCH | `/settings` | Update settings |
| GET | `/products` | List all products |
| POST | `/products` | Create product |
| PATCH | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| POST | `/upload` | Upload image to Cloudinary |
| GET | `/categories` | List categories |
| POST | `/categories` | Create category |
| PATCH | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |
| GET | `/orders` | List orders |
| PATCH | `/orders/:id` | Update order status |
| GET | `/coupons` | List coupons |
| POST | `/coupons` | Create coupon |
| PATCH | `/coupons/:id` | Update coupon |
| DELETE | `/coupons/:id` | Delete coupon |

---

## 🗺️ Key Pages & Routes

### Customer Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Homepage with carousel and featured products |
| `/shop` | `app/shop/page.tsx` | All products with filtering |
| `/shop/[category]` | `app/shop/[category]/page.tsx` | Category-specific products |
| `/product/[product_id]` | `app/product/[product_id]/page.tsx` | Product detail page |
| `/cart` | `app/cart/page.tsx` | Shopping cart |
| `/checkout` | `app/checkout/page.tsx` | Checkout & payment |
| `/order-success/[orderId]` | `app/order-success/[orderId]/page.tsx` | Order confirmation |
| `/profile` | `app/profile/page.tsx` | User profile & settings |
| `/profile/orders` | `app/profile/orders/page.tsx` | Order history |
| `/profile/orders/[id]` | `app/profile/orders/[id]/page.tsx` | Order details |
| `/wishlist` | `app/wishlist/page.tsx` | Saved wishlist items |
| `/about-us` | `app/about-us/page.tsx` | Company information |
| `/contact-us` | `app/contact-us/page.tsx` | Contact form |

### Admin Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | `app/admin/login/page.tsx` | Admin login |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Dashboard & analytics |
| `/admin/products` | `app/admin/products/page.tsx` | Product management |
| `/admin/categories` | `app/admin/categories/page.tsx` | Category management |
| `/admin/orders` | `app/admin/orders/page.tsx` | Order management |
| `/admin/coupons` | `app/admin/coupons/page.tsx` | Coupon management |

---

## 🔐 Authentication & Security

### Customer Authentication

**OTP-Based Login Flow**:
1. Customer enters 10-digit mobile number
2. Backend generates 6-digit OTP (expires in 5 minutes)
3. Customer receives OTP via SMS
4. Customer submits OTP
5. Backend verifies OTP and creates JWT token
6. Token stored in httpOnly cookie (secure, 7-day expiration)
7. Customer authenticated for 7 days

**Security Features**:
- ✅ httpOnly cookies (prevents XSS attacks)
- ✅ SameSite cookies (prevents CSRF)
- ✅ HTTPS-only in production
- ✅ 6-digit OTP with 5-minute expiry
- ✅ Rate limiting: Max 5 OTP requests per 15 minutes
- ✅ JWT signature verification

### Admin Authentication

**Email/Password Login Flow**:
1. Admin enters email and password
2. Password verified using bcrypt (salt rounds: 10)
3. JWT token created on successful authentication
4. Token stored in httpOnly cookie (7-day expiration)
5. Admin authenticated for 7 days
6. Email notification sent on successful login

**Security Features**:
- ✅ Bcrypt password hashing (salt rounds 10)
- ✅ Secure password comparison
- ✅ httpOnly cookies
- ✅ Admin middleware validates JWT on all admin routes
- ✅ Login notification emails
- ✅ Logout clears cookies

### Additional Security

**Middleware Protection**:
- `requireAuth`: Validates user JWT on protected routes
- `requireAdmin`: Validates admin JWT on admin routes
- CORS: Configurable origin whitelist
- Rate Limiting:
  - OTP requests: 5 per 15 minutes
  - Contact form: 3 per hour
- Input Validation: Zod schema validation on all endpoints
- CORS Headers: Environment-based configuration

**Data Security**:
- Password hashing with bcrypt
- Sensitive data in httpOnly cookies (not localStorage)
- No sensitive data in URL params or localStorage
- Secure token refresh mechanism

---

## 💳 Payment Integration

### Razorpay Integration

**Payment Flow**:
1. Customer selects items and enters delivery address
2. Customer selects "Pay Online" option
3. App creates order on backend (stores Razorpay order ID)
4. Frontend displays Razorpay checkout modal
5. Customer enters card/UPI/wallet details
6. Razorpay handles payment securely
7. Payment callback received with signature
8. Backend verifies signature using HMAC-SHA256
9. Payment status updated to PAID
10. Order status updated to PLACED
11. Order confirmation sent to customer

**Signature Verification**:
- HMAC-SHA256 verification of Razorpay signature
- Prevents unauthorized payment confirmation
- Validates:
  - `razorpay_order_id`
  - `razorpay_payment_id`
  - `razorpay_signature`

**Transaction Tracking**:
- `razorpayOrderId`: Stored on order document
- `razorpayPaymentId`: Stored on order document
- Payment status: PENDING/PAID/FAILED
- Automatic retry handling for failed payments

### Cash on Delivery (COD)

**COD Flow**:
1. Customer selects "Pay on Delivery" option
2. Payment method stored as COD on order
3. Payment status remains PENDING
4. Order status set to PLACED
5. Customer pays delivery partner on delivery
6. Payment confirmed manually by admin
7. Payment status updated to PAID

**Admin Control**:
- COD can be enabled/disabled in settings
- Prevents COD orders when disabled
- Real-time toggle in admin panel

---

## 🔧 Environment Variables

### Backend Variables

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `MONGODB_URI` | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/db` | Database connection |
| `JWT_SECRET` | ✅ | `super_secret_key_123` | User token signing |
| `ADMIN_JWT_SECRET` | ✅ | `admin_secret_key_123` | Admin token signing |
| `CLOUDINARY_CLOUD_NAME` | ✅ | `my_cloud` | Image hosting |
| `CLOUDINARY_API_KEY` | ✅ | `api_key_here` | Cloudinary auth |
| `CLOUDINARY_API_SECRET` | ✅ | `api_secret_here` | Cloudinary auth |
| `RAZORPAY_KEY_ID` | ✅ | `rzp_test_key` | Payment processing |
| `RAZORPAY_KEY_SECRET` | ✅ | `rzp_secret` | Payment verification |
| `BREVO_API_KEY` | ✅ | `api_key_here` | Email notifications |
| `ADMIN_EMAIL` | ✅ | `admin@viveksfarm.com` | Admin inbox for alerts |
| `CORS_ORIGIN` | ✅ | `http://localhost:3000` | CORS whitelist |
| `NODE_ENV` | ✅ | `development` | Environment |
| `PORT` | ❌ | `4000` | Server port (default 4000) |

### Frontend Variables

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:4000` | Backend API URL |

---

## 📊 Code Quality

### Biome Configuration

The project uses **Biome** for linting and formatting (no ESLint/Prettier):

**Enforced Rules**:
- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes for all strings
- **Import Organization**: Auto-sorted imports
- **Naming Conventions**: camelCase for variables, PascalCase for components
- **No Unused Variables**: Automatic cleanup
- **No Unused Imports**: Automatic removal

### Running Code Quality Checks

```bash
# Auto-fix linting and formatting
pnpm check

# Check only (no changes)
pnpm lint

# Format only
pnpm format

# Auto-fix with unsafe fixes (remove unused imports)
npx biome check --write --unsafe .
```

---

## 🚀 Deployment

### Production Deployment (Railway)

The project is configured for Railway deployment with the following files:
- `railway.json` - Railway deployment config
- `nixpacks.toml` - Nix build configuration
- `DEPLOYMENT.md` - Detailed deployment guide

### Quick Deployment Steps

1. **Prepare Production Variables**:
   - Set environment variables on Railway dashboard
   - Use production MongoDB Atlas URL
   - Use production Razorpay keys
   - Update CORS origin to production domain

2. **Deploy**:
   ```bash
   # Via Railway CLI
   railway up
   
   # Or push to connected Git repository
   git push origin main
   ```

3. **Verify**:
   - Check frontend builds at production URL
   - Test API endpoints from production domain
   - Verify payment processing in production
   - Check email notifications

See `DEPLOYMENT.md` for detailed instructions.

---

## 📝 Development Workflow

### Creating a New Feature

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop and test locally**:
   ```bash
   pnpm dev
   ```

3. **Run code quality checks**:
   ```bash
   pnpm check
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: describe your feature"
   ```

5. **Push and create pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- ✅ Use tabs for indentation
- ✅ Use double quotes for strings
- ✅ Use `cn()` utility for conditional classes
- ✅ Use `"use client"` directive for browser-only components
- ✅ Use server components by default
- ✅ Add `export const metadata` for SEO on server components
- ✅ Use TypeScript for type safety
- ✅ Write meaningful commit messages

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Before Submitting a PR

- ✅ Run `pnpm check` for code quality
- ✅ Test all features locally
- ✅ Update documentation if needed
- ✅ Add meaningful commit messages
- ✅ Ensure no breaking changes

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Razorpay Integration](https://razorpay.com/docs/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support

For questions, issues, or suggestions:
- 📧 Email: admin@viveksfarm.com
- 💬 WhatsApp: [Contact us](https://wa.me/919876543210)
- 🐛 GitHub Issues: [Report a bug](https://github.com/yourusername/viveks-farm-commerce/issues)

---

## 🙏 Acknowledgments

- **Shadcn UI** for beautiful components
- **Tailwind CSS** for rapid styling
- **Razorpay** for payment processing
- **Cloudinary** for image hosting
- **Railway** for deployment infrastructure

---

**Built with ❤️ by Vivek's Farm Team**

Last Updated: April 2026
