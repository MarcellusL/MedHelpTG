# Quick Fix for Railway "start.sh not found" Error

## The Problem
Railway can't auto-detect how to start your app.

## The Solution

### For Backend Service:

1. In Railway dashboard, go to your **backend service**
2. Click **Settings** → **Deploy**
3. Under **Start Command**, set:
   ```
   gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
   ```
4. Click **Save**
5. Railway will redeploy automatically

### For Frontend Service:

1. In Railway dashboard, go to your **frontend service**
2. Click **Settings** → **Deploy**
3. Under **Start Command**, set:
   ```
   npm run start
   ```
4. Under **Build Command** (if needed), set:
   ```
   npm install && npm run build
   ```
5. Click **Save**
6. Railway will redeploy automatically

## Verify Root Directory

Make sure Root Directory is set correctly:
- **Backend**: `backend`
- **Frontend**: `frontend`

Go to Settings → General → Root Directory

## That's It!

After setting the Start Command, Railway should deploy successfully.

For more help, see `docs/RAILWAY_TROUBLESHOOTING.md`
