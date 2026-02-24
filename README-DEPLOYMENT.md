# Deployment Guide - Vercel + Supabase

## Important: Your Data is Safe! 🛡️

When you deploy to Vercel, **your database data will NOT be deleted**. Here's why:

- Vercel only deploys your **Next.js application code**
- Your database lives on **Supabase's servers** (completely separate)
- Database migrations only run when **you manually execute them**
- Your products, categories, users, and orders are **100% safe**

---

## Setup Steps

### 1. Create Production Supabase Project

1. Go to https://database.new (or https://supabase.com)
2. Create a new project
3. Choose a name, password, and region
4. Wait for the project to initialize (~2 minutes)

### 2. Apply Database Migrations

You need to run the migration files in your production Supabase database:

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file in order:
   - `supabase/migrations/20260223000448_initial_schema.sql`
   - `supabase/migrations/20260223020000_add_reserved_by.sql`
   - `supabase/migrations/20260223020100_update_rls_reserved_by.sql`
4. Run each migration (click "Run")

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI globally
npm install -g supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

### 3. Get Your Production Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Configure environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
R2_ACCOUNT_ID=d0fd2aad2270079a003f03554bd44aee
R2_ACCESS_KEY_ID=33459c3fbf241ee25ac51cd9155073bc
R2_SECRET_ACCESS_KEY=d09bac9e749e047305e81924609220052c946a40d479cc91e4a0b0d1c19256eb
R2_BUCKET_NAME=file-upload-garage-sale
R2_PUBLIC_URL=https://pub-da5da491b8f6438187beadbd77f396b9.r2.dev
NEXT_PUBLIC_SINPE_PHONE=89093178
NEXT_PUBLIC_SINPE_NAME=Esteban Castro
NEXT_PUBLIC_ENABLE_RESERVE=true
```

5. Click **Deploy**

### 5. Create Admin User

After deployment, you need to create an admin user in your production database:

**Option 1: Using Supabase Dashboard**
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Copy the user's UUID
5. Go to **SQL Editor** and run:
```sql
-- No additional setup needed - your RLS policies allow authenticated users admin access
```

**Option 2: Use the create-admin script**
You can modify the `create-admin.js` script to connect to production (temporarily update the Supabase URL and keys), run it, then revert the changes.

---

## Future Deployments

Every time you push to GitHub:
- ✅ Vercel automatically redeploys your **application code**
- ✅ Your **database data remains untouched**
- ❌ Database migrations do **NOT** run automatically
- ℹ️ If you add new migrations, you must manually run them in Supabase SQL Editor

---

## Troubleshooting

### "Can't connect to database"
- Check your environment variables in Vercel
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### "Unauthorized" errors
- Check your RLS (Row Level Security) policies in Supabase
- Ensure your admin user is authenticated

### "Table doesn't exist"
- You forgot to run the migrations on your production database
- Go to Supabase SQL Editor and run them

---

## Data Backup (Optional but Recommended)

To backup your production data:

1. Go to Supabase Dashboard
2. Navigate to **Database** → **Backups**
3. Supabase automatically creates daily backups
4. You can also manually create a backup or download your data

---

## Summary

🎉 **You're all set!** Your data is safe. Vercel deployments only update your application code, never your database data.
