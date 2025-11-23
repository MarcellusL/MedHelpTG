# Railway Deployment Guide - Full Stack

Deploy both your Flask backend and React frontend to Railway in minutes!

## 🚀 Quick Start

### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free $5 credit/month)

### Step 2: Create Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `MedHelpTG` repository

### Step 3: Deploy Backend

1. **Add Backend Service:**
   - In your Railway project, click "New" → "GitHub Repo"
   - Select the **same repository**
   - Click "Settings" → "Root Directory"
   - Set to: `backend`
   - Railway will auto-detect Python

2. **Configure Environment Variables:**
   - Go to "Variables" tab
   - Add these:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     TELEGRAM_BOT_TOKEN=your_telegram_bot_token
     PORT=5001
     ```
   - Railway auto-sets `PORT`, but you can override it

3. **Deploy:**
   - Railway will automatically start building
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://medstate-backend.railway.app`)

### Step 4: Deploy Frontend

1. **Add Frontend Service:**
   - In the same Railway project, click "New" → "GitHub Repo"
   - Select the **same repository** again
   - Click "Settings" → "Root Directory"
   - Set to: `frontend`
   - Railway will auto-detect Node.js/Vite

2. **Configure Environment Variables:**
   - Go to "Variables" tab
   - Add these (use your backend URL from Step 3):
     ```
     VITE_BACKEND_URL=https://medstate-backend.railway.app
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
     ```

3. **Deploy:**
   - Railway will automatically build and deploy
   - Copy your frontend URL (e.g., `https://medstate-frontend.railway.app`)

### Step 5: Update Backend CORS

Update `backend/app.py` to allow your Railway frontend domain:

```python
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://medstate-frontend.railway.app",  # Your Railway frontend URL
            "http://localhost:8080",  # For local development
        ]
    }
}, supports_credentials=True)
```

Then commit and push - Railway will auto-redeploy!

### Step 6: Deploy Telegram Bot (Optional)

1. **Add Worker Service:**
   - In the same Railway project, click "New" → "GitHub Repo"
   - Select the **same repository**
   - Click "Settings" → "Root Directory" → Set to: `backend`
   - Click "Settings" → "Start Command" → Set to: `python script.py`

2. **Add Environment Variables:**
   - Same as backend (GEMINI_API_KEY, TELEGRAM_BOT_TOKEN)

3. **Deploy:**
   - Railway will run your Telegram bot as a background worker

## ✅ That's It!

Your full stack is now live:
- **Frontend**: `https://medstate-frontend.railway.app`
- **Backend**: `https://medstate-backend.railway.app`
- **Telegram Bot**: Running in background

## 🔄 Automatic Deployments

Railway automatically deploys when you push to your connected branch!

## 💰 Pricing

- **Free Tier**: $5 credit/month
- **After Free Tier**: Pay-as-you-go (~$5-10/month for both services)

## 🔧 Troubleshooting

### Backend Not Starting
- Check "Deployments" tab for error logs
- Verify environment variables are set
- Make sure `requirements.txt` has all dependencies

### Frontend Can't Connect to Backend
- Verify `VITE_BACKEND_URL` is set correctly
- Check backend CORS settings
- Make sure backend is running (check "Deployments" tab)

### Build Fails
- Check "Deployments" → "View Logs"
- Verify `package.json` (frontend) or `requirements.txt` (backend) is correct
- Make sure root directory is set correctly

## 📝 Environment Variables Checklist

### Backend:
- ✅ `GEMINI_API_KEY`
- ✅ `TELEGRAM_BOT_TOKEN`
- ✅ `PORT` (auto-set by Railway)

### Frontend:
- ✅ `VITE_BACKEND_URL` (your Railway backend URL)
- ✅ `VITE_GOOGLE_MAPS_API_KEY`
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY`

## 🎯 Custom Domains

1. Go to your service → "Settings" → "Domains"
2. Add your custom domain
3. Railway will provide DNS instructions
4. SSL is automatic!

## 📚 More Info

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

