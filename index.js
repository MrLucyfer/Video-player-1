const { app, BrowserWindow, ipcMain } = require('electron')
const prompt = require('electron-prompt');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1280,
    height: 720,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  win.loadFile('player/index.html');
}

app.on('ready', createWindow);

app.on('open-file', (e, path) => {
  e.preventDefault();
  win.webContents.send('path', path);
})

ipcMain.on('input', (e, arg) => {
  prompt({
    title: "Link",
    label: "Enter a link to a video",
    inputAttrs: {
      type: 'url'
    },
    type: 'input'
  })
  .then((r) => e.reply('input-res', r));
});

