# Quick Vercel Deployment Guide

## 🚀 Deploy Your Frontend to Vercel in 5 Minutes

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub

### Step 2: Import Your Project
1. Click "Add New Project"
2. Import from GitHub → Select `MedHelpTG` repository
3. **IMPORTANT**: Set **Root Directory** to `frontend`
4. Framework should auto-detect as "Vite"

### Step 3: Configure Environment Variables
Click "Environment Variables" and add:

```
VITE_BACKEND_URL=https://your-backend-url.com
VITE_GOOGLE_MAPS_API_KEY=your_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### Step 4: Deploy
Click "Deploy" and wait ~2 minutes!

### Step 5: Deploy Your Backend Separately

**Option A: Railway (Easiest)**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select `backend` folder
4. Add environment variables (GEMINI_API_KEY, TELEGRAM_BOT_TOKEN)
5. Get your backend URL
6. Update `VITE_BACKEND_URL` in Vercel

**Option B: Render**
1. Go to [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Root Directory: `backend`
4. Build: `pip install -r requirements.txt`
5. Start: `python app.py`

## ✅ That's It!

Your frontend will be live at `your-project.vercel.app`

For detailed instructions, see `docs/VERCEL_DEPLOYMENT.md`

---

## 💡 Want to Host Both Backend + Frontend Together?

**Check out `docs/FULL_STACK_HOSTING.md`** for platforms like:
- **Railway** (Recommended - easiest, $5 free credit/month)
- **Render** (Free tier available)
- **Fly.io** (Fast global deployment)

These platforms let you deploy both your Flask backend and React frontend from the same repo!

