import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { bootstrapMain } from '../src/main/bootstrap';

const isDev = !app.isPackaged;

function createMainWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'AI Dev Team',
    webPreferences: {
      // Критично для критерия "Renderer не имеет прямого доступа к filesystem/Node.js API":
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  bootstrapMain();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
