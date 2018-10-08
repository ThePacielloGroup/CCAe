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
      frame: false,
      autoHideMenuBar: true,
      width: 200,
      height: 100,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      focusable: true,
      hasShadow: false,
      titleBarStyle: "customButtonsOnHover"
    })

    win.loadURL(url.format({
        pathname: path.join(dirname, 'views', 'picker.html'),
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