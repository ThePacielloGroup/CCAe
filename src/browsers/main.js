const {app, BrowserWindow, shell, Menu, MenuItem} = require('electron')
const path = require('path')
const url = require('url')

module.exports = (dirname) => {
    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let mainWindow

    /**
     * [init]
     * @param {int} x [initial window x position]
     * @param {int} Y [initial window y position]
     * @param {boolean} force [force launching new window]
     */
    let init = (x, y, alwaysOnTop, force) => {
        if (mainWindow === null || mainWindow === undefined || force) createWindow(x, y, alwaysOnTop)
        else mainWindow.show()
    }

    let createWindow = (x, y, alwaysOnTop) => {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            show: false, // Hide the application until the page has loaded
            width: 480, 
            height: 0,
            x: x,
            y: y,
            alwaysOnTop: alwaysOnTop,
            resizable: false,
            focusable: true,
            useContentSize: true
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
            app.quit()
        })

        mainWindow.webContents.on('new-window', function(e, url) {
            e.preventDefault();
            shell.openExternal(url);
        });

        // Show the application when the page has loaded
        mainWindow.on('ready-to-show', function() { 
            mainWindow.show(); 
            mainWindow.focus(); 
        });

        /* Context menu */
        mainWindow.webContents.on('context-menu', function(e, params){
            const hasText = params.selectionText.trim().length > 0
            const {editFlags} = params
            const ctxMenu = new Menu()
            ctxMenu.append(new MenuItem({
                id: 'copy',
                label: 'Copy',
                role: 'copy',
    			visible: params.isEditable || hasText
            }))
            ctxMenu.append(new MenuItem({
                id: 'paste',
                label: 'Paste',
                role: 'paste',
    			enabled: editFlags.canPaste,
    			visible: params.isEditable
            }))
            ctxMenu.popup(mainWindow, params.x, params.y)
        })

    }
  
    let getWindow = () => mainWindow

    return {
        init: init,
        getWindow: getWindow
    }
}