# Configure CORS for Cloudflare R2

You're getting CORS errors because the R2 bucket needs to allow requests from your Next.js application.

## Option 1: Using Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com/
2. **Navigate to R2**:
   - Click on "R2" in the left sidebar
   - Click on your bucket: `file-upload-garage-sale`
3. **Go to Settings**:
   - Click on the "Settings" tab
   - Scroll down to "CORS Policy"
4. **Add CORS Rule**:
   - Click "Add CORS policy" or "Edit CORS policy"
   - Add the following JSON:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

5. **Save** the CORS configuration

## Option 2: Using Wrangler CLI

If you have Wrangler installed:

```bash
# Install wrangler if you don't have it
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create a cors.json file with the configuration above
# Then apply it:
wrangler r2 bucket cors put file-upload-garage-sale --file=cors.json
```

## Option 3: For Production

When you deploy to production (e.g., Vercel), add your production domain:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-domain.com",
      "https://www.your-domain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

## Verify CORS is Working

After applying the CORS policy:
1. Wait a few seconds for the changes to propagate
2. Try uploading an image again
3. Check the browser console for any remaining errors

## Common Issues

- **Changes not taking effect**: Wait 1-2 minutes and refresh your browser
- **Still getting CORS errors**: Make sure you're accessing the app via the exact URL in AllowedOrigins
- **Multiple origins**: You can add multiple origins in the AllowedOrigins array

## Test After Setup

1. Go to http://localhost:3000/admin/products/new
2. Click "Upload Images"
3. Select an image
4. Upload should now work without CORS errors!
