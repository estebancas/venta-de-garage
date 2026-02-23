# Testing Admin Authentication

## Test Credentials

**Email:** `admin@example.com`
**Password:** `admin123456`

## Test Flow

### 1. Test Login Page
- Navigate to http://localhost:3000/admin
- You should see the login page with email/password form
- Try entering invalid credentials → should show error
- Enter correct credentials → should redirect to /admin/dashboard

### 2. Test Dashboard Access
- After successful login, you should see:
  - Dashboard with stats cards (Total Products, Total Orders, etc.)
  - Admin navigation (Dashboard, Products, Orders)
  - User email displayed in header
  - Logout button in header

### 3. Test Protected Routes
- Try accessing http://localhost:3000/admin/dashboard without logging in
- Should redirect to /admin login page

### 4. Test Logout
- Click the logout button in the header
- Should redirect to /admin login page
- Try accessing /admin/dashboard again → should redirect to login

### 5. Test Auto-Redirect
- When logged in, try accessing http://localhost:3000/admin
- Should automatically redirect to /admin/dashboard (skip login page)

## Manual Testing Steps

1. **Open browser** to http://localhost:3000/admin
2. **Enter credentials:**
   - Email: admin@example.com
   - Password: admin123456
3. **Click "Sign in"**
4. **Verify redirect** to /admin/dashboard
5. **Check dashboard** displays correctly
6. **Click logout** button
7. **Verify redirect** to /admin login

## What's Protected

All routes under `/admin/dashboard/*` are protected by authentication:
- `/admin/dashboard` - Main dashboard
- `/admin/products` - Product management (to be built)
- `/admin/orders` - Order management (to be built)

The middleware automatically refreshes the session on every request.

## Database Verification

You can verify the user was created in Supabase Studio:
1. Open http://127.0.0.1:54323
2. Go to Authentication → Users
3. You should see admin@example.com listed

## Create Additional Admin Users

To create more admin users, use the same curl command with different credentials:

```bash
curl -X POST 'http://127.0.0.1:54321/auth/v1/signup' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "another@example.com",
    "password": "secure_password"
  }'
```
