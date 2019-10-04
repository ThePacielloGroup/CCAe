const {BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

module.exports = (dirname) => {
  let win

  let init = () => {
    if (win === null || win === undefined) {
      if (process.platform === 'darwin' || process.platform === 'win32') {
        createWindow()
      }
    }
  }

  let createWindow = () => {
    win = new BrowserWindow({
      width: 480,
      height: 400,
      resizable: false,
      focusable: true,
      alwaysOnTop: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true
      }
    })

    win.loadURL(url.format({
        pathname: path.join(dirname, 'views', 'deficiency.html'),
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