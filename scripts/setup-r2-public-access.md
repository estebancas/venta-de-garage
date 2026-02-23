# Make R2 Bucket Publicly Accessible

Your images are uploading successfully to R2, but they're not displaying because the bucket isn't publicly accessible. Here's how to fix it:

## Option 1: Enable Public Access (Quickest)

### Via Cloudflare Dashboard:

1. **Go to**: https://dash.cloudflare.com/
2. **Navigate to R2**: Click "R2" in the left sidebar
3. **Click your bucket**: `file-upload-garage-sale`
4. **Go to Settings tab**
5. **Find "Public Access"** section
6. **Click "Allow Access"** or "Connect Custom Domain"

### Two approaches:

#### A. Allow Public Access (Easiest)
- Click "Allow Access" to make the entire bucket public
- R2 will provide you with a public URL like: `https://pub-xxxxx.r2.dev`
- Copy this URL

#### B. Connect Custom Domain (Better for production)
- Click "Connect Domain"
- Enter a subdomain: e.g., `cdn.yourdomain.com`
- Follow DNS setup instructions
- Use this domain as your public URL

## Option 2: Update Environment Variables

After enabling public access, update your `.env.local`:

### If using R2.dev URL (Option 1A):
```env
# Replace with the actual public URL from Cloudflare
R2_PUBLIC_URL=https://pub-xxxxxxxxxxxxx.r2.dev
```

### If using Custom Domain (Option 1B):
```env
R2_PUBLIC_URL=https://cdn.yourdomain.com
```

## Option 3: Quick Test with Presigned URLs

If you don't want to make the bucket public yet, we can modify the code to generate presigned URLs for viewing images. This is less efficient but works for testing.

Let me know if you want me to implement this option!

## Verify It Works

After updating the public URL:

1. **Restart your dev server**:
   ```bash
   # Stop the current server and run:
   npm run dev
   ```

2. **Try uploading a new image** or **refresh the edit page**
3. **Images should now display** correctly!

## Current Issue

Right now your `R2_PUBLIC_URL` is set to:
```
https://d0fd2aad2270079a003f03554bd44aee.r2.cloudflarestorage.com
```

This is the **private** R2 URL that requires authentication. You need the **public** URL that looks like:
- `https://pub-xxxxx.r2.dev` (public R2 domain), or
- `https://your-custom-domain.com` (custom domain)

## Next Steps

1. Go to Cloudflare R2 bucket settings
2. Enable public access or add custom domain
3. Copy the public URL
4. Update `R2_PUBLIC_URL` in `.env.local`
5. Restart dev server
6. Images will display! ✨
