# Create Admin User

You have two options to create your first admin user:

## Option 1: Via Supabase Studio (Recommended)

1. Open Supabase Studio at http://127.0.0.1:54323
2. Go to Authentication → Users
3. Click "Add user"
4. Choose "Create new user"
5. Enter email and password
6. Click "Create user"

## Option 2: Via SQL (Supabase Studio SQL Editor)

1. Open Supabase Studio at http://127.0.0.1:54323
2. Go to SQL Editor
3. Run this SQL (replace email and password):

```sql
-- This creates a user in Supabase Auth
-- Note: You need to use Supabase Auth API or Studio UI for proper user creation
-- The password will be hashed automatically
```

## Option 3: Via API Call

You can use this curl command to create an admin user:

```bash
curl -X POST 'http://127.0.0.1:54321/auth/v1/signup' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_secure_password"
  }'
```

## Test Credentials (for development)

After creating your user, you can login at:
- URL: http://localhost:3000/admin
- Use the email and password you set above

## Production Setup

For production with hosted Supabase:
1. Go to your Supabase project dashboard
2. Authentication → Users → Add user
3. Or use the same API call with your production Supabase URL and anon key
