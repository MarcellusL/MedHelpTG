# Deploy Telegram Bot on Railway

Your Telegram bot (`backend/script.py`) needs to run as a **separate service** on Railway.

## 🚀 Quick Setup

### Step 1: Add Worker Service

1. In your Railway project dashboard, click **"New"** → **"GitHub Repo"**
2. Select the **same repository** (MedHelpTG)
3. Click **"Settings"** → **"Root Directory"**
   - Set to: `backend`
4. Click **"Settings"** → **"Deploy"** → **"Start Command"**
   - **Clear any existing command** (like `gunicorn app:app ...`)
   - Set to: `python script.py`
   - **Important:** This tells Railway to run your Telegram bot, NOT the Flask backend
   - **Note:** If you see `gunicorn` in the Start Command, that's wrong - it should be `python script.py`

### Step 2: Add Environment Variables

Go to the **"Variables"** tab and add:

```
GEMINI_API_KEY=your_gemini_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

**Note:** These should be the same values as your backend service.

### Step 3: Verify It's Running

1. Check the **"Deployments"** tab - you should see a successful deployment
2. Check the **"Logs"** tab - you should see:
   - **✅ CORRECT:** Messages about Telegram bot starting, or no errors
   - **❌ WRONG:** If you see `Starting gunicorn` or `Loading classifier`, that's the Flask backend, not the bot!
   
   The bot logs should look different from your backend logs (no gunicorn, no TensorFlow model loading).

3. Test in Telegram - send `/start` to your bot

**⚠️ Common Mistake:** If your logs show `gunicorn` starting, you're looking at the **backend service**, not the **Telegram bot service**. Make sure you're checking the correct service in Railway!

## ✅ Verification Checklist

- [ ] Worker service created in Railway
- [ ] Root Directory set to `backend`
- [ ] Start Command set to `python script.py`
- [ ] Environment variables added (GEMINI_API_KEY, TELEGRAM_BOT_TOKEN)
- [ ] Deployment successful
- [ ] Bot responds to `/start` in Telegram

## 🔍 Troubleshooting

### Bot Not Responding?

1. **Check Logs:**
   - Go to Railway dashboard → Worker service → Logs
   - Look for errors like:
     - `TELEGRAM_BOT_TOKEN environment variable is required`
     - `GEMINI_API_KEY environment variable is required`
     - Connection errors

2. **Verify Environment Variables:**
   - Make sure `TELEGRAM_BOT_TOKEN` and `GEMINI_API_KEY` are set
   - Check for typos in variable names

3. **Check Bot Token:**
   - Verify your bot token is correct
   - Make sure the bot hasn't been deleted/recreated in Telegram

4. **Restart Service:**
   - In Railway, go to the worker service
   - Click "Deploy" → "Redeploy" to restart

### Common Errors

**Error: `TELEGRAM_BOT_TOKEN environment variable is required`**
- Solution: Add `TELEGRAM_BOT_TOKEN` to the Variables tab

**Error: `GEMINI_API_KEY environment variable is required`**
- Solution: Add `GEMINI_API_KEY` to the Variables tab

**Error: `Conflict: terminated by other getUpdates request`**
- Solution: This means another instance is running. Make sure you only have ONE worker service running.

## 📝 Notes

- The Telegram bot runs as a **separate service** from your backend API
- Both services can share the same environment variables
- The bot will automatically restart if it crashes (Railway's default behavior)
- You can view real-time logs in the Railway dashboard

