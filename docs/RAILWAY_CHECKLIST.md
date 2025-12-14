# Railway Deployment Checklist

Use this checklist to deploy your app to Railway.

## ✅ Pre-Deployment Checklist

- [x] Backend `app.py` reads `PORT` from environment
- [x] `gunicorn` added to `requirements.txt`
- [x] `Procfile` created for production
- [x] CORS configured (currently allows all origins - will work with Railway)
- [x] Environment variables documented

## 🚀 Railway Deployment Steps

### 1. Sign Up & Create Project
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign up with GitHub
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your `MedHelpTG` repository

### 2. Deploy Backend Service
- [ ] In Railway project, click "New" → "GitHub Repo"
- [ ] Select your repository
- [ ] Go to "Settings" → "Root Directory" → Set to: `backend`
- [ ] Go to "Variables" tab and add:
  - [ ] `GEMINI_API_KEY` = (your key from .env)
  - [ ] `TELEGRAM_BOT_TOKEN` = (your token from .env)
- [ ] Wait for deployment to complete
- [ ] Copy your backend URL (e.g., `https://medstate-backend.railway.app`)

### 3. Deploy Frontend Service
- [ ] In same Railway project, click "New" → "GitHub Repo"
- [ ] Select the **same repository**
- [ ] Go to "Settings" → "Root Directory" → Set to: `frontend`
- [ ] Go to "Variables" tab and add:
  - [ ] `VITE_BACKEND_URL` = (your backend URL from step 2)
  - [ ] `VITE_GOOGLE_MAPS_API_KEY` = (your Google Maps key)
  - [ ] `VITE_SUPABASE_URL` = (your Supabase URL, if using)
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` = (your Supabase key, if using)
- [ ] Wait for deployment to complete
- [ ] Copy your frontend URL (e.g., `https://medstate-frontend.railway.app`)

### 4. Test Your Deployment
- [ ] Visit your frontend URL
- [ ] Try uploading an image
- [ ] Check that classification works
- [ ] Test chat functionality

### 5. Deploy Telegram Bot (Optional)
- [ ] In same Railway project, click "New" → "GitHub Repo"
- [ ] Select the **same repository**
- [ ] Go to "Settings" → "Root Directory" → Set to: `backend`
- [ ] Go to "Settings" → "Start Command" → Set to: `python script.py`
- [ ] Go to "Variables" tab and add:
  - [ ] `GEMINI_API_KEY` = (same as backend)
  - [ ] `TELEGRAM_BOT_TOKEN` = (same as backend)
- [ ] Wait for deployment
- [ ] Test Telegram bot with `/start`

## 📝 Environment Variables Reference

### Backend Variables:
```
GEMINI_API_KEY=your_gemini_api_key (get from your .env file)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token (get from your .env file)
PORT=5001  (Railway auto-sets this, but you can override)
```

### Frontend Variables:
```
VITE_BACKEND_URL=https://your-backend.railway.app
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_SUPABASE_URL=your_supabase_url (if using)
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key (if using)
```

## 🔧 Troubleshooting

### Backend won't start:
- Check "Deployments" tab → "View Logs"
- Verify all environment variables are set
- Check that `requirements.txt` has all dependencies

### Frontend can't connect to backend:
- Verify `VITE_BACKEND_URL` matches your backend URL exactly
- Check backend is running (green status in Railway)
- Check backend logs for CORS errors

### Build fails:
- Check "Deployments" → "View Logs" for error messages
- Verify root directory is set correctly (`backend` or `frontend`)
- Make sure `package.json` (frontend) or `requirements.txt` (backend) is correct

## 📚 Need Help?

- See detailed guide: `docs/RAILWAY_DEPLOY.md`
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

