require('./server/bin/www')
const { app, BrowserWindow } = require('electron')
const path = require('path');

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 670,
    resizable: false,
    center: true,
    icon: path.join(__dirname, 'public', 'favicon.png'),
    backgroundColor: `#000`,
  })

  mainWindow.removeMenu()
  mainWindow.loadURL('http://localhost:8080/');
})



