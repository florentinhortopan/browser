// Preload script for Electron
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Expose safe APIs to renderer process
  platform: process.platform,
  versions: process.versions
});

