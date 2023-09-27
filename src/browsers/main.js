const {app, BrowserWindow, shell, Menu, MenuItem, globalShortcut} = require('electron')
const path = require('path')
const url = require('url')

module.exports = (dirname, store) => {
    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let mainWindow

    /**
     * [init]
     * @param {int} x [initial window x position]
     * @param {int} Y [initial window y position]
     * @param {boolean} force [force launching new window]
     */
    let init = (force) => {
        if (mainWindow === null || mainWindow === undefined || force) createWindow()
        else mainWindow.show()
    }

    let createWindow = async () => {
        const x = store.get('position.x')
        const y = store.get('position.y')
        const alwaysOnTop = store.get('alwaysOnTop')
        
        // Create the browser window.
        mainWindow = new BrowserWindow({
            show: false, // Hide the application until the page has loaded
            width: 480, 
            height: 600,
            x,
            y,
            alwaysOnTop,
            resizable: false,
            focusable: true,
            useContentSize: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        })
        // and load the index.html of the app.
        mainWindow.loadURL(url.format({
            pathname: path.join(dirname, 'views', 'main.html'),
            protocol: 'file:',
            slashes: true
        }))

        // Open the DevTools.
//        mainWindow.webContents.openDevTools()



        mainWindow.on('close', function () {
            if (mainWindow) {
                pos = mainWindow.getPosition()
                store.set('position.x', pos[0])
                store.set('position.y', pos[1])
                mainWindow = null
            }
            app.quit()
        })

        mainWindow.webContents.on('new-window', function(e, url) {
            e.preventDefault()
            shell.openExternal(url)
        })

        // Show the application when the page has loaded
        mainWindow.on('ready-to-show', function() { 
            mainWindow.show()
            mainWindow.focus()
        })

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

    let currentHeight = 0
    let changeZoom = () => {
        changeSize(null, currentHeight)
    }
    
    let changeSize = (width, height) => {
        zoomLevel = mainWindow.webContents.getZoomLevel()
        currentHeight = height
        if (process.platform === 'win32') {
            height += 20 // Add extra height for menubar size
        }
        if (width === null) {
            width = 480
        }
        scale = Math.pow(1.2, zoomLevel)
        width = Math.round(width * scale)
        height = Math.round(height * scale)

        mainWindow.setContentSize(width, height)
    }

    return {
        init: init,
        getWindow: getWindow,
        changeZoom: changeZoom,
        changeSize: changeSize
    }
}