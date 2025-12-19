# Build Scripts

Build automation scripts for creating the Mac .app bundle.

## Scripts

- `build_puxa_browser.sh` - Main build script
- `package_mac.sh` - Mac packaging script

## Build Process

1. Download Chromium source
2. Apply ungoogled-chromium patches
3. Apply custom PUXA patches
4. Build Chromium
5. Bundle Django backend
6. Bundle Vue.js extension
7. Create Mac .app bundle

