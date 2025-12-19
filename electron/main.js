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
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff'
  });
  
  // Wait for Django to start, then load frontend
  setTimeout(() => {
    // In production, load from frontend/dist
    // For now, load Django admin or a simple page
    mainWindow.loadURL('http://localhost:8000/api/health/');
    
    // Open DevTools for debugging
    if (process.env.NODE_ENV !== 'production') {
      mainWindow.webContents.openDevTools();
    }
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

