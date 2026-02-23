# Venta de Garage

A modern online garage sale storefront built with Next.js, Supabase, and Cloudflare R2.

## Features

- **Public Storefront**: Browse products, filter by category, place orders
- **SINPE Móvil Integration**: Costa Rican payment method for buyers
- **Admin Dashboard**: Manage products, verify payments, update order statuses
- **Image Storage**: Cloudflare R2 for product images
- **Real-time Updates**: Supabase for database and authentication

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudflare R2
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Auth**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ (you're currently on v21.1.0)
- Docker Desktop (for local Supabase development)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.local.example` to `.env.local`
   - For local development, the Supabase credentials are already configured
   - Add your Cloudflare R2 and SINPE Móvil details when ready

4. **Start Docker Desktop** (required for local Supabase)

5. **Start local Supabase**:
   ```bash
   npm run supabase:start
   ```

   This will:
   - Start Supabase containers
   - Run database migrations
   - Create the schema (categories, products, orders tables)

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run supabase:start` - Start local Supabase
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:reset` - Reset local database
- `npm run supabase:gen-types` - Generate TypeScript types from database schema
- `npm run create-admin <email> <password>` - Create a new admin user

## Database Schema

### Categories
- `id` (uuid)
- `name` (text)
- `slug` (text, unique)
- `created_at` (timestamp)

### Products
- `id` (uuid)
- `name` (text)
- `description` (text, nullable)
- `price` (numeric)
- `status` (enum: active, sold, reserved)
- `category_id` (uuid, foreign key)
- `image_urls` (text array)
- `created_at` (timestamp)

### Orders
- `id` (uuid)
- `product_id` (uuid, foreign key)
- `buyer_name` (text)
- `buyer_phone` (text)
- `buyer_email` (text)
- `sinpe_reference` (text)
- `status` (enum: pending, verified, rejected)
- `created_at` (timestamp)

## Creating Admin Users

To create admin users who can access the admin dashboard at `/admin`:

**Using npm script (recommended):**
```bash
npm run create-admin admin@example.com yourSecurePassword
```

**Using bash script directly:**
```bash
./scripts/create-admin.sh admin@example.com yourSecurePassword
```

**Using Node.js script directly:**
```bash
node scripts/create-admin.js admin@example.com yourSecurePassword
```

**Requirements:**
- Email must be a valid email format
- Password must be at least 6 characters
- Supabase must be running (`npm run supabase:start`)

**Example:**
```bash
npm run create-admin seller@garage.com MyPass123!
```

After creating an admin user, login at: http://localhost:3000/admin

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/       # Admin pages (protected)
│   │   └── api/         # API routes
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── admin/       # Admin-specific components
│   │   └── auth/        # Authentication components
│   └── lib/             # Utilities and configurations
│       ├── supabase/    # Supabase client configurations
│       └── types/       # TypeScript type definitions
├── supabase/
│   └── migrations/      # Database migrations
├── scripts/             # Utility scripts
└── public/              # Static assets
```

## Next Steps

See `garage-sale-plan.md` for the complete implementation plan and next phases:
1. Admin authentication
2. Product CRUD operations
3. Public storefront
4. Order management
5. Animations and polish

## License

ISC
