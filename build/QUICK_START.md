# Quick Start - Build Executable

## Prerequisites

- Python 3.9+ 
- Node.js 18+
- npm or yarn

## Installation Steps

### 1. Install Python Dependencies

```bash
cd backend

# Option 1: Use venv (recommended)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Option 2: Install globally (if venv fails)
pip3 install --break-system-packages Django djangorestframework django-cors-headers requests
```

### 2. Install Node Dependencies

```bash
# Install Electron dependencies
cd electron
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 3. Initialize Django Database

```bash
cd backend
python3 manage.py migrate
# Or if using venv:
# source venv/bin/activate && python manage.py migrate
```

### 4. Test Django Backend

```bash
cd backend
python3 manage.py runserver
# Or if using venv:
# source venv/bin/activate && python manage.py runserver

# Test in browser: http://localhost:8000/api/health/
# Should return: {"status":"ok","service":"PUXA Browser API"}
```

### 5. Build Frontend Extension

```bash
cd frontend
npm run build
# Creates dist/ directory with extension files
```

### 6. Test Electron App (Development)

```bash
cd electron
npm start
# Should open Electron window
# Django server should start automatically
# Check console for any errors
```

### 7. Build Mac Executable

```bash
cd electron
npm run build
# Creates .app bundle in dist/ directory
# May also create .dmg installer
```

## Troubleshooting

### Python Installation Issues
- If `pip install` fails, try: `pip3 install --user --break-system-packages <package>`
- Or use: `python3 -m pip install --user <package>`

### Django Server Won't Start
- Check if port 8000 is already in use: `lsof -i :8000`
- Kill process if needed: `kill -9 <PID>`
- Or change port in `manage.py runserver 8001`

### Electron Build Fails
- Ensure Node.js 18+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Try: `npm install --legacy-peer-deps`
- Check disk space: `df -h`

### Extension Not Loading
- Ensure frontend is built: `cd frontend && npm run build`
- Check `frontend/dist/` directory exists
- Verify `manifest.json` is in dist/

## Testing Checklist

- [ ] Django backend runs on http://localhost:8000
- [ ] `/api/health/` endpoint returns success
- [ ] Frontend extension builds successfully
- [ ] Electron app opens without errors
- [ ] Django server starts automatically in Electron
- [ ] Mac .app bundle is created

## Next Steps After Build

1. Test basic functionality
2. Add puxa.ai API integration
3. Enhance UI components
4. Add fact-checking features
5. Implement defluff scoring algorithm

