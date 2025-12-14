# 🚀 Railway Quick Start

## Step-by-Step Deployment

### 1. Sign Up
- Go to [railway.app](https://railway.app)
- Sign up with GitHub (free $5 credit/month)

### 2. Create Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `MedHelpTG` repository

### 3. Deploy Backend
1. Click "New" → "GitHub Repo" → Select your repo
2. Settings → Root Directory: `backend`
3. Variables tab → Add:
   - `GEMINI_API_KEY` (from your .env)
   - `TELEGRAM_BOT_TOKEN` (from your .env)
4. Wait for deployment → Copy backend URL

### 4. Deploy Frontend
1. Click "New" → "GitHub Repo" → Same repo
2. Settings → Root Directory: `frontend`
3. Variables tab → Add:
   - `VITE_BACKEND_URL` = (your backend URL from step 3)
   - `VITE_GOOGLE_MAPS_API_KEY` = (your key)
   - `VITE_SUPABASE_URL` = (if using)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = (if using)
4. Wait for deployment → Copy frontend URL

### 5. Test
- Visit your frontend URL
- Try uploading an image
- Test chat functionality

## ✅ Done!

Your app is now live on Railway!

For detailed instructions, see `docs/RAILWAY_DEPLOY.md`
For troubleshooting, see `RAILWAY_CHECKLIST.md`
