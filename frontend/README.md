# Vue.js Browser Extension

Browser extension built with Vue.js 3 for PUXA AI Browser.

## Setup

```bash
cd frontend
npm install
npm run dev        # Development mode
npm run build      # Production build
```

## Structure

```
frontend/
├── src/
│   ├── background/       # Background service worker
│   ├── content-scripts/  # Content scripts
│   ├── popup/           # Extension popup UI
│   ├── components/      # Vue components
│   └── stores/          # Pinia stores
├── public/
├── manifest.json         # Extension manifest
└── package.json
```

## Development

1. Build extension: `npm run build`
2. Load in browser:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `frontend/dist` directory

