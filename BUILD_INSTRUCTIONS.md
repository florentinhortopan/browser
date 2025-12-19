# Build Instructions - Step by Step

## ✅ Current Status

- ✅ Django installed (v6.0)
- ✅ Django database initialized
- ✅ Frontend dependencies installed
- ✅ Frontend built successfully
- ✅ Electron ready

## Step-by-Step Build Process

### Step 1: Test Django Backend

```bash
cd backend
python3 manage.py runserver
```

In another terminal, test it:
```bash
curl http://localhost:8000/api/health/
# Should return: {"status":"ok","service":"PUXA Browser API"}
```

Press `Ctrl+C` to stop the server.

### Step 2: Test Electron App (Development)

```bash
cd electron
npm start
```

This will:
- Start Django server automatically
- Open Electron window
- Load the app

**Note**: The Electron window will show Django's API response. This is expected for now.

### Step 3: Build Mac Executable

```bash
cd electron
npm run build
```

This creates:
- `dist/mac/PUXA Browser.app` - The Mac application bundle
- `dist/PUXA Browser-1.0.0.dmg` - Installer (if configured)

### Step 4: Run the Executable

```bash
# Option 1: From Finder
open "dist/mac/PUXA Browser.app"

# Option 2: From terminal
./dist/mac/PUXA\ Browser.app/Contents/MacOS/PUXA\ Browser
```

## Quick Build Script

You can also run this all-in-one script:

```bash
#!/bin/bash
# Quick build script

echo "1. Building frontend..."
cd frontend
npm run build
cp manifest.json dist/

echo "2. Building Electron app..."
cd ../electron
npm run build

echo "3. Build complete!"
echo "Find your app at: electron/dist/mac/PUXA Browser.app"
```

## Troubleshooting

### Django Server Won't Start in Electron
- Check if port 8000 is available: `lsof -i :8000`
- The Electron app should start Django automatically
- Check console logs in Electron DevTools

### Frontend Extension Not Loading
- Ensure `manifest.json` is in `frontend/dist/`
- Check that all files are built: `ls -la frontend/dist/`

### Build Fails
- Ensure all dependencies installed: `npm install` in both electron/ and frontend/
- Check disk space: `df -h`
- Clear npm cache: `npm cache clean --force`

## Next Steps After Build

1. Test the .app bundle
2. Add puxa.ai API integration
3. Enhance UI components
4. Add fact-checking features
5. Implement defluff scoring

---

**Ready to build?** Run: `cd electron && npm run build`

