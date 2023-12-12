const {BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

module.exports = (dirname) => {
  let win

  let init = (parent) => {
    if (win === null || win === undefined) {
      if (process.platform === 'darwin' || process.platform === 'win32') {
        createWindow(parent)
      }
    }
  }

  let createWindow = (parent) => {
    win = new BrowserWindow({
      width: 500,
      height: 600,
      resizable: false,
      focusable: true,
      parent,
      modal: true,
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