# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Stack

Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Supabase (Postgres + Auth) · Cloudflare R2 (image storage) · Framer Motion · React Hook Form + Zod · Sonner toasts

Spanish-language storefront for Costa Rica. Payment method: SINPE Móvil (Costa Rican mobile payments).

## Architecture

### Route groups

```
src/app/
  layout.tsx                   # Root layout — CartProvider, ConfirmProvider, Toaster
  page.tsx                     # Storefront: product grid + category filter
  producto/[id]/               # Product detail
  carrito/page.tsx             # Cart
  admin/(auth)/page.tsx        # Admin login
  admin/(dashboard)/           # Protected admin pages: dashboard, products, orders, categories, location
  api/                         # REST API routes for all DB operations
```

All database mutations go through `/api/*` routes, never direct from client components.

### Supabase clients

- `lib/supabase/client.ts` — browser client (for client components)
- `lib/supabase/server.ts` — server client with service role key (for API routes and server components)
- `lib/supabase/middleware.ts` — auth middleware protecting `/admin/(dashboard)/*`

### Image uploads (R2)

1. Admin calls `POST /api/upload` → gets presigned R2 URL
2. Browser uploads directly to R2
3. URL stored in `products.image_urls[]`

### Cart

React Context in `contexts/cart-context.tsx`. State lives in localStorage via `lib/user-storage.ts`.

### Key types

Generated Supabase types at `lib/types/database.ts`. Regenerate after schema changes with the Supabase CLI.

## Database tables

- `categories` — id, name, slug
- `products` — id, name, description, price, status (`active`|`sold`|`reserved`), category_id, image_urls[], reserved_by
- `orders` — id, product_id, buyer_name, buyer_phone, buyer_email, sinpe_reference, order_type, status (`pending`|`verified`|`rejected`)

## Environment variables

Requires `.env.local` with Supabase URL/anon key/service role key and Cloudflare R2 credentials (account ID, access key, secret key, bucket name, public URL). CI mocks these for build validation.

## CI

`.github/workflows/ci.yml` runs `tsc --noEmit` and `next build` on every PR and push to main.
