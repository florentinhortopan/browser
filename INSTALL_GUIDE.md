# Installation Guide

## Current Status

**Disk Space**: Limited (~500MB free)  
**Action Required**: Free up more disk space before installing dependencies

## Required Disk Space

- Python packages: ~150MB
- Node.js packages (Electron): ~400MB  
- Node.js packages (Frontend): ~200MB
- **Total needed**: ~750MB+

## Installation Steps

### Step 1: Free Up Disk Space

```bash
# Check disk usage
df -h

# Common cleanup commands:
# - Empty trash
# - Remove old downloads
# - Clear npm cache: npm cache clean --force
# - Clear pip cache: pip cache purge
# - Remove old Docker images (if applicable)
```

### Step 2: Install Python Dependencies

```bash
cd backend

# Option A: Install globally (requires --break-system-packages)
pip3 install --break-system-packages Django djangorestframework django-cors-headers requests

# Option B: Use venv (if space allows)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 3: Initialize Django

```bash
cd backend
python3 manage.py migrate
python3 manage.py runserver
# Test: http://localhost:8000/api/health/
```

### Step 4: Install Node Dependencies

```bash
# Install Electron dependencies
cd electron
npm install --legacy-peer-deps

# Install Frontend dependencies  
cd ../frontend
npm install
```

### Step 5: Build Frontend Extension

```bash
cd frontend
npm run build
# Creates dist/ directory
```

### Step 6: Test Electron App

```bash
cd electron
npm start
# Should open Electron window
# Django server starts automatically
```

### Step 7: Build Mac Executable

```bash
cd electron
npm run build
# Creates .app bundle in dist/mac/
```

## Quick Test (Minimal Dependencies)

If you can't install all dependencies, you can test parts individually:

### Test Django API Structure
```bash
cd backend
# If Django is installed:
python3 manage.py check
python3 manage.py runserver
curl http://localhost:8000/api/health/
```

### Test Project Structure
```bash
# Verify all files exist
ls -la backend/manage.py
ls -la electron/main.js
ls -la frontend/package.json
```

## Troubleshooting

### "No space left on device"
- Free up more disk space
- Clear caches: `npm cache clean --force`, `pip cache purge`
- Remove unused applications/files

### Python Installation Fails
- Try: `pip3 install --user --break-system-packages <package>`
- Or: `python3 -m pip install --user <package>`

### npm Install Fails
- Clear cache: `npm cache clean --force`
- Try: `npm install --legacy-peer-deps --no-optional`
- Check disk space: `df -h`

### Django Won't Start
- Check if port 8000 is in use: `lsof -i :8000`
- Use different port: `python3 manage.py runserver 8001`

## Alternative: Cloud Build

If local disk space is an issue, consider:
- Building on a cloud VM (AWS, GCP, Azure)
- Using GitHub Actions for CI/CD builds
- Building on a different machine with more space

## Files Ready

All project files are created and ready:
- ✅ Django backend structure
- ✅ Electron wrapper
- ✅ Vue.js extension
- ✅ Build configuration
- ⚠️ Waiting for dependency installation

---

**Next Step**: Free up disk space, then run installation steps above.

