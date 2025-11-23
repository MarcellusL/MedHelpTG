# Railway Troubleshooting Guide

## Common Issues and Solutions

### ⚠️ "Script start.sh not found" or "Railpack could not determine how to build the app"

**Solution:** Railway needs explicit configuration. Make sure:

1. **For Backend:**
   - Root Directory is set to `backend` in Railway settings
   - Railway should auto-detect Python from `requirements.txt`
   - Start Command should be: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - OR Railway will use the `Procfile` if present

2. **For Frontend:**
   - Root Directory is set to `frontend` in Railway settings
   - Railway should auto-detect Node.js from `package.json`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start` (which runs `vite preview`)

3. **Manual Configuration in Railway:**
   - Go to your service → Settings
   - Under "Deploy" section:
     - **Build Command**: (leave empty for auto-detect, or set manually)
     - **Start Command**: Set explicitly:
       - Backend: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
       - Frontend: `npm run start`

### Alternative: Use Railway.json Files

The `railway.json` files in `backend/` and `frontend/` directories should help Railway auto-detect the configuration. If Railway still can't detect:

1. **Check Root Directory:**
   - Make sure Root Directory is set correctly in Railway settings
   - Backend: `backend`
   - Frontend: `frontend`

2. **Check Files Exist:**
   - Backend should have: `requirements.txt`, `app.py`, `Procfile`
   - Frontend should have: `package.json`, `vite.config.ts`

3. **Manual Override:**
   - In Railway dashboard → Service → Settings
   - Set "Start Command" manually:
     - Backend: `gunicorn app:app --bind 0.0.0.0:$PORT`
     - Frontend: `npm run start`

### Backend Build Fails

**Error:** "Module not found" or "Import error"

**Solution:**
- Check `requirements.txt` has all dependencies
- Make sure `gunicorn` is in `requirements.txt`
- Check Railway logs for specific missing module

### Frontend Build Fails

**Error:** "npm install failed" or "Build error"

**Solution:**
- Check `package.json` is valid
- Make sure all dependencies are listed
- Check Railway logs for specific error
- Try setting Build Command manually: `npm install && npm run build`

### Port Issues

**Error:** "Port already in use" or "Cannot bind to port"

**Solution:**
- Railway automatically sets `$PORT` environment variable
- Make sure your code reads from `PORT` env var (already done in `app.py`)
- Don't hardcode port numbers

### Environment Variables Not Working

**Solution:**
- Make sure variables are set in Railway dashboard → Variables tab
- For frontend, variables must start with `VITE_` to be accessible
- Redeploy after adding/changing variables

### CORS Errors

**Solution:**
- Update `backend/app.py` CORS settings to include your Railway frontend URL
- Or keep `origins: "*"` for development (already set)

### Static Files Not Loading

**Solution:**
- Make sure frontend build outputs to `dist/` directory
- Check that `vite.config.ts` has correct `build.outDir` setting

## Quick Fix Checklist

If Railway can't detect your app:

- [ ] Root Directory is set correctly (`backend` or `frontend`)
- [ ] `railway.json` exists in the root directory of each service
- [ ] Start Command is set in Railway Settings → Deploy
- [ ] Build Command is set (if needed)
- [ ] All required files exist (`requirements.txt`, `package.json`, etc.)
- [ ] Environment variables are set
- [ ] Check Railway logs for specific errors

## Still Having Issues?

1. Check Railway logs: Service → Deployments → View Logs
2. Verify file structure matches what Railway expects
3. Try setting commands manually in Railway Settings
4. Check Railway documentation: [docs.railway.app](https://docs.railway.app)

