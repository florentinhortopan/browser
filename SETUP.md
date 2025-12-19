# Setup Guide

## Prerequisites

- Python 3.9+
- Node.js 18+
- Git
- Mac OS (for Mac builds)

## Initial Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Browser
```

### 2. Set Up Django Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt  # Will be created in Phase 2
```

### 3. Set Up Vue.js Extension

```bash
cd frontend
npm install
```

### 4. Reference ungoogled-chromium (Optional)

The `ungoogled-chromium/` directory is for reference only. It's not committed to the repo.

To clone it locally:
```bash
git clone --depth 1 https://github.com/ungoogled-software/ungoogled-chromium.git
```

## Development Workflow

### Backend Development

```bash
cd backend
source venv/bin/activate
python manage.py runserver
# Backend runs on http://localhost:8000
```

### Frontend Development

```bash
cd frontend
npm run dev
# Extension builds to frontend/dist
```

### Loading Extension in Browser

1. Build extension: `cd frontend && npm run build`
2. Open browser: `chrome://extensions/` or `ungoogled-chromium://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `frontend/dist` directory

## Next Steps

See [ROADMAP.md](ROADMAP.md) for development phases.

