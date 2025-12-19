const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let djangoProcess = null;
let mainWindow = null;

function startDjangoServer() {
  const djangoPath = path.join(__dirname, '../backend/manage.py');
  const pythonPath = process.platform === 'darwin' ? 'python3' : 'python';
  
  console.log('Starting Django server...');
  djangoProcess = spawn(pythonPath, [djangoPath, 'runserver', '127.0.0.1:8000'], {
    cwd: path.join(__dirname, '../backend'),
    stdio: 'inherit'
  });
  
  djangoProcess.on('error', (err) => {
    console.error('Failed to start Django:', err);
  });
  
  djangoProcess.on('exit', (code) => {
    console.log(`Django server exited with code ${code}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // Enable webview tag
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff'
  });
  
  // Wait for Django to start, then load frontend
  setTimeout(() => {
    // Load the Vue.js browser UI
    // First try to load from Vite dev server, then fallback to built files
    const devUrl = 'http://localhost:3000/src/browser/index.html';
    
    // For production, serve files through a simple HTTP server or use absolute file paths
    // Since file:// has CORS issues, we'll serve through Django or use a local server
    const prodUrl = `file://${path.join(__dirname, '../frontend/dist/src/browser/index.html')}`;
    
    console.log('Attempting to load UI...');
    
    // Load from Django (which serves the UI)
    // Don't try dev server in production builds
    console.log('Loading UI from Django...');
    mainWindow.loadURL('http://localhost:8000/').catch((err) => {
      console.error('Failed to load from Django:', err);
      // Fallback: try dev server if available
      mainWindow.loadURL(devUrl).catch(() => {
        console.error('All load attempts failed');
      });
    });
    
    // Open DevTools for debugging
    mainWindow.webContents.openDevTools();
    
    // Listen for console messages
    mainWindow.webContents.on('console-message', (event, level, message) => {
      console.log(`[Renderer ${level}]:`, message);
    });
  }, 3000);
}

app.whenReady().then(() => {
  startDjangoServer();
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (djangoProcess) {
    djangoProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (djangoProcess) {
    djangoProcess.kill();
  }
});

