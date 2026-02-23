# Garage Sale App — Project Plan

## Overview

A simple but polished online garage sale storefront where buyers can browse products, place orders via SINPE Móvil, and the owner manually verifies payments and updates order/product status through an admin dashboard.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | API routes handle everything, no separate backend |
| Database | Supabase | Free tier, built-in auth for admin, easy setup |
| File Storage | Cloudflare R2 | S3-compatible API, free egress, cheaper than AWS S3 |
| Styling | Tailwind CSS | Utility-first, great Next.js integration |
| UI Components | shadcn/ui | Pre-built accessible components for admin (forms, tables, dialogs) |
| Animations | Framer Motion | Page transitions, staggered animations, modal effects |
| Typography | Geist (headings) + Inter (body) | Clean pairing, Geist is zero-config in Next.js |
| Deployment | Vercel | Zero config for Next.js, auto deploys |
| Local Dev DB | Docker (Supabase local) | Local Supabase instance for development only |

> **Note:** No containers in production. Vercel handles the Next.js deployment. Docker is only for running Supabase locally during development.

---

## Database Schema

### `categories`
```sql
id          uuid primary key default gen_random_uuid()
name        text not null
slug        text not null unique
created_at  timestamp default now()
```

### `products`
```sql
id           uuid primary key default gen_random_uuid()
name         text not null
description  text
price        numeric(10, 2) not null
status       text check (status in ('active', 'sold', 'reserved')) default 'active'
category_id  uuid references categories(id)
image_urls   text[] default '{}'
created_at   timestamp default now()
```

### `orders`
```sql
id               uuid primary key default gen_random_uuid()
product_id       uuid references products(id)
buyer_name       text not null
buyer_phone      text not null
buyer_email      text not null
sinpe_reference  text not null
status           text check (status in ('pending', 'verified', 'rejected')) default 'pending'
created_at       timestamp default now()
```

---

## App Structure

```
/                        → Public storefront (product grid)
/product/[id]            → Product detail page
/admin                   → Admin login (Supabase Auth)
/admin/products          → Product list, add, edit, delete
/admin/products/new      → Add new product
/admin/products/[id]     → Edit product
/admin/orders            → Order list, verify or reject payments
```

All data fetching and mutations go through **Next.js API routes** (`/app/api/...`) to keep the architecture simple and centralized.

---

## Key User Flows

### Buyer Checkout Flow
1. Buyer browses the storefront, filters by category
2. Clicks into a product detail page
3. Clicks **"Buy"** → modal opens showing:
   - Your SINPE Móvil phone number + instructions to send the payment
   - A form to fill in: name, phone, email, and the SINPE reference number they used
4. Submits the form → on-screen confirmation message (no email, no redirect)
5. Product status is automatically set to **`reserved`** on order creation

### Admin Payment Verification Flow
1. Admin logs into `/admin/orders`
2. Sees pending orders with buyer info + SINPE reference
3. Manually checks phone to confirm payment received
4. Marks order as **`verified`** or **`rejected`**
5. On `verified` → product status automatically updates to **`sold`** (single DB transaction)
6. On `rejected` → product status reverts to **`active`**

### Image Upload Flow
1. Admin opens add/edit product form
2. Clicks upload → Next.js API route generates a **presigned R2 URL**
3. Browser uploads image **directly to R2** (bypasses the server, no bandwidth cost)
4. URL is saved to the product's `image_urls` array

---

## Look & Feel

**Vibe:** Clean, minimal, modern — like a boutique second-hand shop, not a cluttered garage sale. Lots of whitespace, sharp typography, and subtle but satisfying motion.

---

## Animation Plan

### Storefront
- Product cards **fade + slide up staggered** on load (cascade effect with per-card delay)
- Category filter switch → smooth **layout animation** (cards reorder/fade, no jumps)
- Product card hover → **subtle lift shadow + image scale**
- Product detail page → hero image fades in, content slides up from below

### Checkout Modal
- **Slides up from bottom** on mobile, **scales in from center** on desktop
- Form fields animate in sequentially
- On submit → loading spinner → **success state with checkmark animation**

### Admin Dashboard
- Page transitions with a simple **fade + slide**
- Order status change → row **highlights briefly** then fades to new state color
- Image upload → **progress bar + thumbnail preview** fades in on success

### General
- Smooth scroll behavior globally
- **Skeleton loaders** instead of spinners for product grids
- **Toast notifications** for admin actions (saved, error, deleted, etc.)

---

## Build Order (Suggested)

1. **Project setup** — Next.js + Tailwind + shadcn/ui + Framer Motion installed and configured
2. **Supabase schema** — Run migrations locally with Docker, then push to hosted Supabase
3. **Cloudflare R2** — Create bucket, configure CORS, set up presigned URL API route
4. **Admin auth** — Supabase Auth email/password login protecting `/admin/*` routes
5. **Product CRUD** — Admin product list, add, edit, delete with image upload
6. **Public storefront** — Product grid, category filters, product detail page
7. **Order modal + submission** — Checkout form, SINPE instructions, confirmation screen
8. **Admin order management** — Order list, verify/reject actions, automatic product status sync
9. **Polish** — Animations, transitions, skeleton loaders, toasts, mobile responsiveness

---

## Environment Variables Needed

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# SINPE
NEXT_PUBLIC_SINPE_PHONE=
NEXT_PUBLIC_SINPE_NAME=
```

---

## Notes for Claude Code

- Use the **Next.js App Router** (not Pages Router)
- All API logic lives in `/app/api/` route handlers
- Use **Supabase JS client** (`@supabase/supabase-js`) with server-side client for API routes and browser client for public pages
- Use **`@aws-sdk/client-s3`** and **`@aws-sdk/s3-request-presigner`** for R2 (it's S3-compatible, just point the endpoint to R2)
- Admin routes should be protected with a middleware check using the Supabase session
- Product `status` should only be updated via order actions (not manually from the product form) to keep data consistent
- Keep animations in a shared `/components/motion/` directory for reusability
