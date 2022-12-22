const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { channels, mock } = require('../src/shared/constants');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: isDev,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({
      mode: 'right',
    });
  }

  mainWindow.setResizable(true);
  mainWindow.on('closed', () => (mainWindow = null));
  mainWindow.focus();
}

const onChannelGetData = () => {
  ipcMain.on(channels.GET_DATA, (event, arg) => {
    const { product } = arg;
    event.sender.send(channels.GET_DATA, mock.products[product]);
  });
};

const handleChannelQuit = () => {
  ipcMain.handle(channels.QUIT, () => {
    app.quit();
  });
};

app.on('ready', () => {
  onChannelGetData();
  handleChannelQuit();
  createWindow();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
