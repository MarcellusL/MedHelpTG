# Vercel Deployment Guide

This guide will help you deploy the MedState frontend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be on GitHub (already done ✅)
3. **Backend Hosting**: Your Flask backend needs to be hosted separately (see options below)

## Important Notes

⚠️ **Vercel is for Frontend Only**: Vercel is perfect for your React frontend, but your Flask backend and Telegram bot need separate hosting.

### Backend Hosting Options:
- **Railway** (Recommended): Easy Flask deployment
- **Render**: Free tier available
- **Fly.io**: Good for Python apps
- **Heroku**: Paid option
- **DigitalOcean App Platform**: Simple deployment

## Step 1: Prepare Your Frontend

Your frontend is already set up correctly! The `vercel.json` configuration file has been created.

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"

2. **Import Your Repository**
   - Connect your GitHub account
   - Select your repository: `MedHelpTG`
   - Choose the branch: `main` or `Aidan-Main`

3. **Configure Project**
   - **Root Directory**: Set to `frontend`
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_BACKEND_URL=https://your-backend-url.com
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Set root directory to current directory
   - When asked about settings, use defaults

5. **Set Environment Variables**
   ```bash
   vercel env add VITE_BACKEND_URL
   vercel env add VITE_GOOGLE_MAPS_API_KEY
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
   ```

6. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

### Required Environment Variables:

```bash
# Backend API URL (your Flask backend)
VITE_BACKEND_URL=https://your-backend.railway.app
# or
VITE_BACKEND_URL=https://your-backend.render.com

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Supabase (if using)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### How to Set in Vercel:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable
4. Select environments (Production, Preview, Development)
5. Click "Save"
6. Redeploy your project

## Step 4: Deploy Your Backend

Since Vercel doesn't support Flask directly, you need to host your backend separately.

### Recommended: Railway

1. **Sign up**: [railway.app](https://railway.app)
2. **Create New Project**
3. **Deploy from GitHub**
   - Connect your GitHub repo
   - Select the `backend` folder
4. **Set Environment Variables**:
   ```
   GEMINI_API_KEY=your_key
   TELEGRAM_BOT_TOKEN=your_token
   ```
5. **Railway will provide a URL** like: `https://your-app.railway.app`
6. **Update Vercel**: Set `VITE_BACKEND_URL` to this Railway URL

### Alternative: Render

1. **Sign up**: [render.com](https://render.com)
2. **Create Web Service**
3. **Connect GitHub** and select your repo
4. **Settings**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
5. **Set Environment Variables** (same as Railway)
6. **Deploy** and get your URL

## Step 5: Update Frontend to Use Production Backend

Once your backend is deployed, update the `VITE_BACKEND_URL` environment variable in Vercel to point to your production backend URL.

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically configure SSL

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Make sure `package.json` has all dependencies
- Check that `node_modules` is in `.gitignore` (it should be)

**Error: "Environment variable not found"**
- Make sure all `VITE_*` variables are set in Vercel
- Redeploy after adding variables

### Frontend Can't Connect to Backend

**CORS Errors**
- Make sure your backend has CORS enabled for your Vercel domain
- Update `backend/app.py` CORS settings:
  ```python
  CORS(app, resources={
      r"/*": {"origins": ["https://your-app.vercel.app", "https://your-domain.com"]}
  })
  ```

**404 Errors**
- Verify `VITE_BACKEND_URL` is set correctly
- Check backend is running and accessible
- Test backend URL directly in browser

### Images Not Loading

- Make sure image paths use relative paths or are in `public/` folder
- Check that `Avalanche_logo.png` is in `frontend/src/assets/`

## Continuous Deployment

Vercel automatically deploys when you push to your connected branch:
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from other branches (like `Aidan-Main`)

## Project Structure for Vercel

```
MedState/
├── frontend/          ← Vercel deploys this
│   ├── vercel.json   ← Vercel configuration
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
└── backend/          ← Deploy separately (Railway, Render, etc.)
```

## Quick Deploy Checklist

- [ ] Frontend code is in `frontend/` directory
- [ ] `vercel.json` exists in `frontend/`
- [ ] `package.json` has build script
- [ ] Backend is deployed separately
- [ ] Environment variables are set in Vercel
- [ ] CORS is configured in backend for Vercel domain
- [ ] Test the deployed site

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)
- Railway Docs: [docs.railway.app](https://docs.railway.app)

