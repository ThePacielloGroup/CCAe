const {BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

module.exports = (dirname) => {
    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let mainWindow

    /**
     * [init]
     * @param {boolean} force [force launching new window]
     * @return {void} [new Colorpicker]
     */
    let init = (force, color) => {
        if (mainWindow === null || mainWindow === undefined || force) createWindow()
        else mainWindow.show()
    }

    let createWindow = () => {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 480, 
            height: 700,
            alwaysOnTop: true,
            resizable: false,
            focusable: true
        })
        // and load the index.html of the app.
        mainWindow.loadURL(url.format({
            pathname: path.join(dirname, 'views', 'main.html'),
            protocol: 'file:',
            slashes: true
        }))

        // Open the DevTools.
//        mainWindow.webContents.openDevTools()

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null
        })
    }
  
    let getWindow = () => mainWindow

    return {
        init: init,
        getWindow: getWindow
    }
}