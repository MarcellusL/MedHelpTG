# Full-Stack Hosting Options

This guide covers platforms where you can host **both** your Flask backend and React frontend together.

> **🎯 Recommended:** See `docs/RAILWAY_DEPLOY.md` for step-by-step Railway deployment (easiest option).

## 🏆 Best Options for Both Backend + Frontend

### 1. **Railway** ⭐ (Recommended - Easiest)

**Why it's great:**
- Deploy both backend and frontend from the same GitHub repo
- Automatic deployments on git push
- Free tier with $5 credit/month
- Simple configuration
- Built-in PostgreSQL (if needed)

**How to deploy:**

1. **Sign up**: [railway.app](https://railway.app)
2. **Create New Project** → "Deploy from GitHub repo"
3. **Add Backend Service:**
   - Click "New" → "GitHub Repo"
   - Select your repo
   - Set **Root Directory**: `backend`
   - Railway auto-detects Python
   - Add environment variables:
     ```
     GEMINI_API_KEY=your_key
     TELEGRAM_BOT_TOKEN=your_token
     ```
   - Railway will provide a URL like: `https://your-backend.railway.app`

4. **Add Frontend Service:**
   - Click "New" → "GitHub Repo" (same repo)
   - Set **Root Directory**: `frontend`
   - Railway auto-detects Node.js/Vite
   - Add environment variables:
     ```
     VITE_BACKEND_URL=https://your-backend.railway.app
     VITE_GOOGLE_MAPS_API_KEY=your_key
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
     ```
   - Railway will provide a URL like: `https://your-frontend.railway.app`

5. **Custom Domains:** Both services can have custom domains

**Cost:** Free tier ($5 credit/month), then pay-as-you-go

---

### 2. **Render** ⭐ (Best Free Option)

**Why it's great:**
- Free tier available (with limitations)
- Easy deployment from GitHub
- Can host both services
- Automatic SSL

**How to deploy:**

1. **Sign up**: [render.com](https://render.com)

2. **Deploy Backend:**
   - New → "Web Service"
   - Connect GitHub repo
   - Settings:
     - **Name**: `medstate-backend`
     - **Root Directory**: `backend`
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `python app.py` or `gunicorn app:app`
   - Add environment variables
   - Get URL: `https://medstate-backend.onrender.com`

3. **Deploy Frontend:**
   - New → "Static Site"
   - Connect GitHub repo
   - Settings:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
   - Add environment variables
   - Get URL: `https://medstate-frontend.onrender.com`

**Cost:** Free tier (spins down after 15 min inactivity), paid plans available

---

### 3. **Fly.io** ⭐ (Good Performance)

**Why it's great:**
- Fast global deployment
- Good for both Python and Node.js
- Free tier available
- Docker-based (more control)

**How to deploy:**

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   fly launch
   # Follow prompts, set Python runtime
   fly deploy
   ```

3. **Deploy Frontend:**
   ```bash
   cd frontend
   fly launch
   # Follow prompts, set Node.js runtime
   fly deploy
   ```

**Cost:** Free tier available, pay for usage

---

### 4. **DigitalOcean App Platform**

**Why it's great:**
- Simple interface
- Automatic deployments
- Good documentation
- Can deploy both from same repo

**How to deploy:**

1. **Sign up**: [digitalocean.com](https://digitalocean.com)

2. **Create App:**
   - "Create" → "Apps" → "GitHub"
   - Select your repo

3. **Add Backend Component:**
   - Component type: "Web Service"
   - Source directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Run command: `python app.py`

4. **Add Frontend Component:**
   - Component type: "Static Site"
   - Source directory: `frontend`
   - Build command: `npm install && npm run build`
   - Output directory: `dist`

**Cost:** Starts at $5/month

---

---

### 6. **Heroku**

**Why it's great:**
- Very easy deployment
- Can host both
- Good documentation

**Cons:**
- No free tier anymore (paid only)
- More expensive than alternatives

**Cost:** Starts at $7/month per service

---

## 🎯 Recommendation

### For Quick Setup: **Railway**
- Easiest to deploy both services
- Good free tier
- Automatic deployments
- Simple configuration

### For Free Tier: **Render**
- Free tier available
- Easy setup
- Can host both

### For Performance: **Fly.io**
- Fast global deployment
- Good for production

---

## 📋 Comparison Table

| Platform | Free Tier | Backend | Frontend | Ease of Use | Cost After Free |
|----------|-----------|---------|----------|-------------|------------------|
| **Railway** | ✅ $5 credit | ✅ | ✅ | ⭐⭐⭐⭐⭐ | Pay-as-you-go |
| **Render** | ✅ (limited) | ✅ | ✅ | ⭐⭐⭐⭐ | $7+/month |
| **Fly.io** | ✅ | ✅ | ✅ | ⭐⭐⭐ | Pay-as-you-go |
| **DigitalOcean** | ❌ | ✅ | ✅ | ⭐⭐⭐⭐ | $5+/month |
| **Heroku** | ❌ | ✅ | ✅ | ⭐⭐⭐⭐⭐ | $7+/month |

---

## 🚀 Quick Start: Railway (Recommended)

### Step 1: Prepare Your Repo

Make sure your repo structure is:
```
MedState/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── ...
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── ...
```

### Step 2: Deploy Backend

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. **IMPORTANT**: Click "Settings" → Set **Root Directory** to `backend`
5. Add environment variables:
   ```
   GEMINI_API_KEY=your_key
   TELEGRAM_BOT_TOKEN=your_token
   PORT=5001
   ```
6. Railway will auto-detect Python and deploy
7. Get your backend URL (e.g., `https://medstate-backend.railway.app`)

### Step 3: Deploy Frontend

1. In the same Railway project, click "New" → "GitHub Repo"
2. Select the **same repo**
3. **IMPORTANT**: Click "Settings" → Set **Root Directory** to `frontend`
4. Add environment variables:
   ```
   VITE_BACKEND_URL=https://medstate-backend.railway.app
   VITE_GOOGLE_MAPS_API_KEY=your_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
   ```
5. Railway will auto-detect Node.js and deploy
6. Get your frontend URL (e.g., `https://medstate-frontend.railway.app`)

### Step 4: Update CORS in Backend

Update `backend/app.py` to allow your frontend domain:

```python
from flask_cors import CORS

# Allow your Railway frontend domain
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://medstate-frontend.railway.app",
            "http://localhost:8080",  # For local dev
        ]
    }
})
```

### Step 5: Deploy Telegram Bot (Optional)

You can also deploy the Telegram bot on Railway:
1. Add another service in the same project
2. Root Directory: `backend`
3. Start Command: `python script.py`
4. Add environment variables (same as backend)

---

## 🔧 Backend Configuration for Production

### Update `backend/app.py` for Production:

```python
import os

# Get port from environment (Railway/Render provide this)
port = int(os.environ.get('PORT', 5001))

if __name__ == '__main__':
    # For production, use gunicorn instead:
    # gunicorn app:app --bind 0.0.0.0:$PORT
    app.run(host='0.0.0.0', port=port, debug=False)
```

### Create `backend/Procfile` (for Heroku/Render):

```
web: gunicorn app:app --bind 0.0.0.0:$PORT
worker: python script.py
```

### Update `backend/requirements.txt` to include gunicorn:

```
gunicorn>=21.2.0
# ... rest of your dependencies
```

---

## 📝 Environment Variables Checklist

### Backend (.env or platform settings):
- `GEMINI_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `PORT` (usually auto-set by platform)

### Frontend (.env or platform settings):
- `VITE_BACKEND_URL` (your backend URL)
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## 🎉 That's It!

Once deployed, both your frontend and backend will be live and automatically update when you push to GitHub!

For detailed Railway setup, see: [railway.app/docs](https://docs.railway.app)

