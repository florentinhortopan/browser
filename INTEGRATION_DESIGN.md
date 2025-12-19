# ungoogled-chromium Integration Design

## Overview

This document outlines the technical design for integrating Django backend, Vue.js frontend, and AI features into ungoogled-chromium to create our AI-powered browser.

## Repository Analysis Summary

### Key Findings from ungoogled-chromium Study

1. **Patch System**: Uses GNU Quilt format patches applied in sequence via `patches/series`
2. **Build Process**: Download → Prune binaries → Apply patches → Domain substitution → Build
3. **Patch Categories**:
   - `core/`: Essential patches (must stay updated)
   - `extra/`: Feature patches (can be more flexible)
4. **macOS Support**: Separate repository at `ungoogled-chromium-macos`
5. **Utilities**: Python scripts in `utils/` for build automation

### Integration Points Identified

1. **Content Interception**: Hook into Chromium's content loading pipeline
2. **UI Modifications**: Add custom UI components to browser chrome
3. **Extension System**: Use Chromium's extension API
4. **Native Messaging**: Communicate with Django backend

## Architecture Design

### Three-Layer Integration Approach

```
┌─────────────────────────────────────────┐
│  Layer 1: Chromium Patches              │
│  - Content interception hooks            │
│  - UI modification patches               │
│  - Native messaging integration          │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│  Layer 2: Browser Extension (Vue.js)   │
│  - Content scripts for page analysis    │
│  - Background service worker            │
│  - Popup UI for settings                │
│  - Overlay components                   │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│  Layer 3: Django Backend                │
│  - REST API endpoints                    │
│  - puxa.ai integration                   │
│  - Content analysis                      │
│  - Fact-checking                         │
└─────────────────────────────────────────┘
```

## Custom Patches Design

### Patch 1: Content Interception Hook

**Location**: `patches/extra/puxa-browser/content-interception.patch`

**Purpose**: Intercept page content before rendering for AI analysis

**Target Files**:
- `chrome/browser/renderer_host/render_view_host_impl.cc`
- `content/browser/renderer_host/render_frame_host_impl.cc`

**Strategy**:
```cpp
// Hook into content loading
void RenderFrameHostImpl::DidCommitNavigation(...) {
  // Original code...
  
  // Our addition: Send content to Django backend
  if (IsMainFrame()) {
    SendContentForAnalysis(GetLastCommittedURL(), page_content);
  }
}
```

### Patch 2: Native Messaging Integration

**Location**: `patches/extra/puxa-browser/native-messaging.patch`

**Purpose**: Enable communication between browser and Django backend

**Target Files**:
- `chrome/browser/extensions/api/native_messaging/native_message_host.cc`
- Create custom native messaging host for Django

**Strategy**:
```cpp
// Custom native messaging host for Django backend
class DjangoNativeMessageHost : public NativeMessageHost {
  // Connect to Django REST API
  // Handle bidirectional communication
};
```

### Patch 3: UI Overlay Components

**Location**: `patches/extra/puxa-browser/ui-overlay.patch`

**Purpose**: Add AI feature UI components to browser chrome

**Target Files**:
- `chrome/browser/ui/views/toolbar/toolbar_view.cc`
- `chrome/browser/ui/views/frame/browser_view.cc`

**Strategy**:
```cpp
// Add defluff score badge to toolbar
class DefluffScoreBadge : public views::View {
  // Display defluff score
  // React to score updates from extension
};
```

### Patch 4: Extension API Enhancements

**Location**: `patches/extra/puxa-browser/extension-api.patch`

**Purpose**: Add custom extension APIs for AI features

**Target Files**:
- `chrome/browser/extensions/api/`
- Create `chrome.puxa` namespace

**Strategy**:
```cpp
// Custom extension API
namespace puxa {
  // chrome.puxa.analyzeContent()
  // chrome.puxa.getDefluffScore()
  // chrome.puxa.getFactChecks()
}
```

## Browser Extension Design (Vue.js)

### Extension Structure

```
frontend/
├── manifest.json              # Extension manifest
├── src/
│   ├── background/
│   │   └── service-worker.js  # Background service worker
│   ├── content-scripts/
│   │   ├── content.js         # Main content script
│   │   └── inject.js          # DOM injection script
│   ├── popup/
│   │   ├── App.vue            # Popup UI
│   │   └── main.js
│   ├── components/
│   │   ├── DefluffScore.vue
│   │   ├── FactCheckIndicator.vue
│   │   └── ContentOverlay.vue
│   └── stores/
│       └── contentStore.js   # Pinia store
└── package.json
```

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "PUXA AI Browser",
  "version": "1.0.0",
  "description": "AI-powered content analysis and fact-checking",
  
  "permissions": [
    "activeTab",
    "nativeMessaging",
    "storage",
    "tabs"
  ],
  
  "host_permissions": [
    "http://localhost:8000/*",
    "<all_urls>"
  ],
  
  "background": {
    "service_worker": "src/background/service-worker.js"
  },
  
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content-scripts/content.js"],
      "run_at": "document_idle"
    }
  ],
  
  "action": {
    "default_popup": "src/popup/index.html",
    "default_icon": "icons/icon48.png"
  },
  
  "web_accessible_resources": [
    {
      "resources": ["src/components/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### Content Script Flow

```javascript
// src/content-scripts/content.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ContentOverlay from '../components/ContentOverlay.vue'
import { useContentStore } from '../stores/contentStore'

// Initialize Vue app in page context
const pinia = createPinia()
const app = createApp(ContentOverlay)
app.use(pinia)

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const store = useContentStore()
  
  if (message.type === 'CONTENT_ANALYZED') {
    store.updateAnalysis(message.data)
    // UI automatically updates via reactivity
  }
  
  if (message.type === 'DEFLUFF_SCORE') {
    store.updateDefluffScore(message.score)
  }
  
  if (message.type === 'FACT_CHECKS') {
    store.updateFactChecks(message.checks)
  }
})

// Extract page content
function extractContent() {
  return {
    url: window.location.href,
    title: document.title,
    text: document.body.innerText,
    html: document.documentElement.outerHTML
  }
}

// Send content to background script for analysis
const content = extractContent()
chrome.runtime.sendMessage({
  type: 'ANALYZE_CONTENT',
  data: content
})
```

### Background Service Worker

```javascript
// src/background/service-worker.js
import { djangoAPI } from './api/djangoAPI'

// Listen for content analysis requests
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_CONTENT') {
    try {
      // Call Django backend
      const result = await djangoAPI.analyzeContent(message.data)
      
      // Send results to content script
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'CONTENT_ANALYZED',
        data: result
      })
      
      sendResponse({ success: true })
    } catch (error) {
      console.error('Analysis error:', error)
      sendResponse({ success: false, error: error.message })
    }
  }
  
  return true // Keep channel open for async response
})
```

## Django Backend Integration

### Native Messaging Host

**File**: `backend/browser_app/native_messaging/host.py`

```python
#!/usr/bin/env python3
"""
Native messaging host for Chromium extension
Communicates with browser extension via stdio
"""
import sys
import json
import struct
import asyncio
from django.core.management import execute_from_command_line

class NativeMessageHost:
    def __init__(self):
        self.django_api = DjangoAPI()
    
    def read_message(self):
        """Read message from browser extension"""
        raw_length = sys.stdin.buffer.read(4)
        if not raw_length:
            return None
        message_length = struct.unpack('=I', raw_length)[0]
        message = sys.stdin.buffer.read(message_length).decode('utf-8')
        return json.loads(message)
    
    def send_message(self, message):
        """Send message to browser extension"""
        encoded = json.dumps(message).encode('utf-8')
        sys.stdout.buffer.write(struct.pack('=I', len(encoded)))
        sys.stdout.buffer.write(encoded)
        sys.stdout.buffer.flush()
    
    def handle_message(self, message):
        """Process message from extension"""
        msg_type = message.get('type')
        
        if msg_type == 'ANALYZE_CONTENT':
            result = self.django_api.analyze_content(message['data'])
            return {'type': 'ANALYSIS_RESULT', 'data': result}
        
        elif msg_type == 'GET_DEFLUFF_SCORE':
            score = self.django_api.get_defluff_score(message['url'])
            return {'type': 'DEFLUFF_SCORE', 'score': score}
        
        elif msg_type == 'FACT_CHECK':
            checks = self.django_api.fact_check(message['content'])
            return {'type': 'FACT_CHECKS', 'checks': checks}
        
        return {'type': 'ERROR', 'message': 'Unknown message type'}
    
    def run(self):
        """Main message loop"""
        while True:
            message = self.read_message()
            if not message:
                break
            
            response = self.handle_message(message)
            self.send_message(response)

if __name__ == '__main__':
    host = NativeMessageHost()
    host.run()
```

### Native Messaging Manifest

**File**: `backend/browser_app/native_messaging/puxa_host.json`

```json
{
  "name": "com.puxa.browser.host",
  "description": "PUXA AI Browser Native Messaging Host",
  "path": "/path/to/backend/browser_app/native_messaging/host.py",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://[EXTENSION_ID]/"
  ]
}
```

**Installation**: Place in macOS native messaging directory:
```
~/Library/Application Support/Google/Chrome/NativeMessagingHosts/
```

## Build Process Integration

### Modified Build Steps

1. **Download Chromium** (unchanged)
2. **Prune binaries** (unchanged)
3. **Apply ungoogled-chromium patches** (unchanged)
4. **Apply custom PUXA patches** (NEW)
5. **Domain substitution** (unchanged)
6. **Build Chromium** (unchanged)
7. **Bundle Django backend** (NEW)
8. **Bundle Vue.js extension** (NEW)
9. **Create Mac .app** (modified)

### Custom Build Script

**File**: `build/build_puxa_browser.sh`

```bash
#!/bin/bash
set -e

# Configuration
CHROMIUM_SRC="build/src"
PATCHES_DIR="patches"
CUSTOM_PATCHES="custom-patches"
DJANGO_BACKEND="backend"
EXTENSION="frontend"

echo "Building PUXA AI Browser..."

# 1. Apply ungoogled-chromium patches
echo "Applying ungoogled-chromium patches..."
./ungoogled-chromium/utils/patches.py apply $CHROMIUM_SRC $PATCHES_DIR

# 2. Apply custom PUXA patches
echo "Applying custom PUXA patches..."
./ungoogled-chromium/utils/patches.py apply $CHROMIUM_SRC $CUSTOM_PATCHES

# 3. Build Chromium
echo "Building Chromium..."
cd $CHROMIUM_SRC
./tools/gn/bootstrap/bootstrap.py --skip-generate-buildfiles -j4 -o out/Default/
./out/Default/gn gen out/Default --fail-on-unused-args
ninja -C out/Default chrome chromedriver chrome_sandbox

# 4. Build Vue.js extension
echo "Building Vue.js extension..."
cd ../../$EXTENSION
npm run build

# 5. Bundle Django backend
echo "Bundling Django backend..."
cd ../$DJANGO_BACKEND
# Package Django with PyInstaller or similar
# Include in browser .app bundle

# 6. Create Mac .app bundle
echo "Creating Mac .app bundle..."
# Use ungoogled-chromium-macos packaging scripts
# Include extension, Django backend, and native messaging host

echo "Build complete!"
```

## Integration Points Summary

### 1. Content Interception
- **Hook**: `RenderFrameHostImpl::DidCommitNavigation`
- **Action**: Extract content, send to Django
- **Response**: Receive analysis, update UI

### 2. UI Modifications
- **Location**: Browser chrome/toolbar
- **Components**: Defluff score badge, fact-check indicators
- **Method**: Custom views in Chromium UI

### 3. Extension Integration
- **Type**: Manifest V3 extension
- **Components**: Content scripts, background worker, popup
- **Communication**: Chrome messaging API + native messaging

### 4. Django Backend
- **Interface**: REST API + Native messaging
- **Location**: Embedded in .app bundle
- **Startup**: Launched with browser

## Development Workflow

### Phase 1: Extension Development (Easier)
1. Develop Vue.js extension independently
2. Test with standard ungoogled-chromium
3. Communicate with Django via REST API
4. No Chromium patches needed initially

### Phase 2: Native Integration
1. Create custom patches for UI integration
2. Add native messaging support
3. Integrate extension into browser build
4. Test custom build

### Phase 3: Full Integration
1. Content interception patches
2. Seamless UI integration
3. Optimized performance
4. Production build

## File Structure

```
browser_app/
├── ungoogled-chromium/          # Forked repo
├── custom-patches/              # Our custom patches
│   ├── content-interception.patch
│   ├── native-messaging.patch
│   ├── ui-overlay.patch
│   └── extension-api.patch
├── patches/
│   └── series                   # Add our patches here
├── backend/                     # Django backend
│   ├── browser_app/
│   │   └── native_messaging/   # Native messaging host
│   └── ...
├── frontend/                    # Vue.js extension
│   └── ...
└── build/                       # Build scripts
    └── build_puxa_browser.sh
```

## Next Steps

1. **Start with Extension Approach**: Develop Vue.js extension first
2. **Test with Standard Build**: Use ungoogled-chromium from Homebrew
3. **Develop Django Integration**: REST API + native messaging
4. **Create Custom Patches**: Once extension works, add Chromium patches
5. **Build Custom Browser**: Integrate everything into one build

## References

- [ungoogled-chromium Design Docs](ungoogled-chromium/docs/design.md)
- [ungoogled-chromium Building Guide](ungoogled-chromium/docs/building.md)
- [Chromium Extension API](https://developer.chrome.com/docs/extensions/)
- [Native Messaging](https://developer.chrome.com/docs/extensions/mv3/nativeMessaging/)

---

**Status**: Design Complete - Ready for Implementation  
**Last Updated**: [Current Date]

