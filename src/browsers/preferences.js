const {BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

module.exports = (dirname) => {
  let win

  let init = (x, y) => {
    if (win === null || win === undefined) {
      if (process.platform === 'darwin' || process.platform === 'win32') {
        createWindow(x, y)
      }
    }
  }

  let createWindow = (x, y) => {
    win = new BrowserWindow({
      width: 500,
      height: 600,
      x: x,
      y: y,
      resizable: false,
      focusable: true,
      alwaysOnTop: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    win.loadURL(url.format({
        pathname: path.join(dirname, 'views', 'preferences.html'),
        protocol: 'file:',
        slashes: true
    }))
  
    win.on('closed', () => {
      win = undefined
    })
  }

  let getWindow = () => win

  return {
    init: init,
    getWindow: getWindow
  }
}