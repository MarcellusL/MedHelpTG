# Fix Railway Using Docker Instead of Nixpacks

## The Problem
Railway is using Docker (see `Dockerfile:30` in error), but it should use Nixpacks for Node.js projects.

## Solution: Force Railway to Use Nixpacks

### Step 1: Check Root Directory
1. Go to Railway dashboard → Your **frontend service**
2. Click **Settings** → **General**
3. **Root Directory** MUST be: `frontend`
4. If it's empty or set to `/`, change it to `frontend`
5. Click **Save**

### Step 2: Force Nixpacks Builder
1. In Railway dashboard → Your **frontend service**
2. Click **Settings** → **Build**
3. Look for **Builder** or **Build Method**
4. If you see "Docker" or "Dockerfile", change it to **"Nixpacks"**
5. If there's no option, try:
   - **Settings** → **Deploy** → Look for builder options
   - Or delete and recreate the service

### Step 3: Alternative - Add nixpacks.toml
If Railway still uses Docker, create `frontend/nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start"
```

### Step 4: Verify No Dockerfile
Make sure there's NO `Dockerfile` in:
- Root directory
- `frontend/` directory

If one exists, delete it or Railway will auto-detect and use Docker.

### Step 5: Redeploy
After making changes:
1. Click **Deploy** → **Redeploy**
2. Or push a new commit to trigger redeploy

## Why This Happens
Railway auto-detects Docker if:
- A `Dockerfile` exists
- Root Directory is wrong (builds from root instead of `frontend/`)
- Builder is manually set to Docker

## Expected Result
After fixing:
- Should see "Nixpacks" in build logs (not Dockerfile)
- Node.js version should be v20 (not v18)
- Files should be found correctly (`/app/src/lib/utils.ts`)

