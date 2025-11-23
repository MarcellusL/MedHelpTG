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
   - **IMPORTANT:** Go to "Settings" → "Deploy" → "Start Command"
   - Set to: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - (This ensures Railway knows how to start your app)

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
   - Copy your backend URL (e.g., `https://nexahealth-backend.railway.app`)
   - **Optional:** Set a custom domain name in Settings → Domains

### Step 4: Deploy Frontend

1. **Add Frontend Service:**
   - In the same Railway project, click "New" → "GitHub Repo"
   - Select the **same repository** again
   - Click "Settings" → "Root Directory"
   - Set to: `frontend`
   - Railway will auto-detect Node.js/Vite
   - **IMPORTANT:** Go to "Settings" → "Deploy" → "Start Command"
   - Set to: `npm run start`
   - Go to "Settings" → "Build" → "Build Command" (optional, auto-detected)
   - Should be: `npm install && npm run build`

2. **Configure Environment Variables:**
   - Go to "Variables" tab
   - Add these (use your backend URL from Step 3):
     ```
     VITE_BACKEND_URL=https://nexahealth-backend.railway.app
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
     ```

3. **Deploy:**
   - Railway will automatically build and deploy
   - Copy your frontend URL (should be `https://nexahealth.railway.app` if you set custom domain)
   - **Optional:** Set a custom domain name in Settings → Domains (e.g., `nexahealth.railway.app`)

### Step 5: Update Backend CORS

Update `backend/app.py` to allow your Railway frontend domain:

```python
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://nexahealth.railway.app",  # Your custom Railway domain (or default Railway URL)
            "http://localhost:8080",  # For local development
        ]
    }
}, supports_credentials=True)
```

**Note:** Replace with your actual Railway domain. You can set a custom domain in Railway (see "Custom Domains" section below).

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
- **Frontend**: `https://nexahealth.railway.app`
- **Backend**: `https://nexahealth-backend.railway.app` (or your backend domain)
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

Railway allows you to set custom domain names for your services!

### Option 1: Railway Subdomain (Free)
1. Go to your service → "Settings" → "Domains"
2. Click "Generate Domain" or "Custom Domain"
3. Enter your desired name (e.g., `nexahealth`)
4. Railway will provide: `https://nexahealth.railway.app`
5. SSL is automatic!

### Option 2: Custom Domain (Your Own Domain)
1. Go to your service → "Settings" → "Domains"
2. Click "Custom Domain"
3. Enter your domain (e.g., `nexahealth.com` or `app.nexahealth.com`)
4. Railway will provide DNS instructions (CNAME record)
5. Update your DNS settings with your domain provider
6. SSL is automatic once DNS propagates (usually 5-15 minutes)

**Example:** You could use:
- `nexahealth.railway.app` (Railway subdomain - free)
- `app.nexahealth.com` (Custom subdomain)
- `nexahealth.com` (Root domain)

## 📚 More Info

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

