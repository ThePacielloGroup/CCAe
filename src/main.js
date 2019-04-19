const { app, Menu, BrowserWindow } = require('electron')
const isDev = ('NODE_ENV' in process.env && process.env.NODE_ENV === 'dev')
const Store = require('electron-store');
const store = new Store();

const { checkForUpdates, installUpdate } = require('./update.js')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    loadPreferences()
    position = global.sharedObject.preferences.main.position
    alwaysOnTop = global.sharedObject.preferences.main.alwaysOnTop
    main.init(position.x, position.y, alwaysOnTop)

    const menuTemplate = [
        {
            label: 'Colour Contrast Analyser (CCA)',
            submenu: [
                {
                    label: 'About CCA',
                    accelerator: 'F1',
                    click: () => about.init()
                },
                {
                    label: 'Preferences',
                    accelerator: 'CmdOrCtrl+,',
                    click: () => {
                        // Center panel on main window
                        pos = main.getWindow().getPosition()
                        size = main.getWindow().getSize()
                        x = Math.round(pos[0] + (size[0]/2) - (300/2))
                        y = Math.round(pos[1] + (size[1]/2) - (400/2))
                        preferences.init(x, y)
                    }
                },
                {
                    id: 'menuUpdateChecking',
                    label: 'Checking for updates...',
                    enabled: false
                }, {
                    id: 'menuUpdateNotFound',
                    label: 'Current version is up-to-date',
                    enabled: false,
                    visible: false
                }, {
                    id: 'menuUpdateFound',
                    label: 'Found updates, downloading...',
                    enabled: false,
                    visible: false
                }, {
                    id: 'menuUpdateInstall',
                    label: 'Install update',
                    accelerator: 'CmdOrCtrl+Shift+U',
                    click: installUpdate,
                    visible: false
                }, {
                    type: 'separator'
                }, {
                    role: 'quit',
                    accelerator: 'CmdOrCtrl+Q'
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Copy results',
                    accelerator: 'CmdOrCtrl+Shift+C',
                    click: (item) => {
                        mainController.copyResults()
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Colour blindness simulation',
                    accelerator: 'CmdOrCtrl+B',
                    click: () => deficiency.init()
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Always on Top',
                    type: 'checkbox',
                    checked: alwaysOnTop,
                    click: (item) => {
                        main.getWindow().setAlwaysOnTop(item.checked)
                        store.set('main.alwaysOnTop', item.checked)
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Actual Size',
                    accelerator: 'CmdOrCtrl+0',		
                    click (item, focusedWindow) {		
                        if (focusedWindow) {
                            focusedWindow.webContents.setZoomLevel(0)
                            main.changeZoom(0)
                        }
                    }		
                },
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+Plus',		
                    click (item, focusedWindow) {		
                        if (focusedWindow) {		
                            const {webContents} = focusedWindow		
                            webContents.getZoomLevel((zoomLevel) => {		
                                webContents.setZoomLevel(zoomLevel + 0.5)
                                main.changeZoom(zoomLevel + 0.5)
                            })		
                        }		
                    }		
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',		
                    click (item, focusedWindow) {		
                        if (focusedWindow) {		
                            const {webContents} = focusedWindow		
                            webContents.getZoomLevel((zoomLevel) => {		
                                webContents.setZoomLevel(zoomLevel - 0.5)		
                                main.changeZoom(zoomLevel - 0.5)
                            })		
                        }		
                    }	
                }
            ]
        }
    ];

    /* On macOS, cut/copy/paste doesn't work by default unless the options
    are added to the edit menu, or some custom clipboard API implementation is
    used. On Windows and Linux, these work out of the box...so only add on macOS */
    if (process.platform === 'darwin') {
        menuTemplate[1].submenu.push(
            {
                type: 'separator'
            }, {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                selector: 'cut:'
            }, {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                selector: 'copy:'
            }, {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                selector: 'paste:'
            }
        )
    }

    if (isDev) {
        menuTemplate.push(
            {
                label: 'Development',
                submenu: [
                    {
                        label: 'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click (item, focusedWindow) {
                            if (focusedWindow) focusedWindow.reload()
                        }
                    },
                    {
                        label: 'Open Developer Tools',
                        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                        click (item, focusedWindow) {
                            if (focusedWindow) focusedWindow.webContents.openDevTools({mode: 'detach'})
                        }
                    },
                ],
                visible: false
            }
        )
    }

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Register shortcuts
    mainController.updateShortcut('foreground.picker.shortcut', null, global.sharedObject.preferences.foreground.picker.shortcut)
    mainController.updateShortcut('background.picker.shortcut', null, global.sharedObject.preferences.background.picker.shortcut)

    checkForUpdates()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    main.init()
})

app.on('before-quit', () => {
    // Save last position
    pos = main.getWindow().getPosition()
    store.set('main.position.x', pos[0])
    store.set('main.position.y', pos[1])
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const Color = require('./CCAcolor')

let white = Color.rgb(0, 0, 0)
let black = Color.rgb(255, 255, 255)

global.sharedObject = {
    deficiencies : {
        normal : {
            foregroundColor : white,
            foregroundColorMixed : white, // For alpha transparency mix with background
            backgroundColor : black,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
            levelAA : 'regular',
            levelAAA : 'regular'
        },
        achromatopsia : {
            foregroundColor : null,
            backgroundColor : null,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
        },
        achromatomaly : {
            foregroundColor : null,
            backgroundColor : null,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
        },
        protanopia : {
            foregroundColor : null,
            backgroundColor : null,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
        },
        deuteranopia : {
            foregroundColor : null,
            backgroundColor : null,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
        },
        tritanopia : {
            foregroundColor : null,
            backgroundColor : null,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
        },
        protanomaly : {
            foregroundColor : null,
            backgroundColor : null,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
        },
        deuteranomaly : {
            foregroundColor : null,
            backgroundColor : null,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
        },
        tritanomaly : {
            foregroundColor : null,
            backgroundColor : null,
            contrastRatioRaw : 0,
            contrastRatioString : "xx:1",
        }
    },
    advanced : '',
    preferences : {
        main : {
            position : {
                x : null,
                y : null,
            },
            rounding : null,
            alwaysOnTop : null,
        },
        foreground : {
            format : null,
            picker : {
                shortcut : null
            }
        },
        background : {
            format : null,
            picker : {
                shortcut : null
            }
        },
    }
}

function loadPreferences() {
    if (isDev) { console.log(store.path) } 
    prefs = global.sharedObject.preferences
    prefs.main.position.x = store.get('main.position.x', null)
    prefs.main.position.y = store.get('main.position.y', null)
    prefs.main.rounding = store.get('main.rounding', 1)
    prefs.main.alwaysOnTop = store.get('main.alwaysOnTop', true)
    prefs.foreground.format = store.get('foreground.format', 'hex')
    prefs.background.format = store.get('background.format', 'hex')
    prefs.foreground.picker.shortcut = store.get('foreground.picker.shortcut', 'F11')
    prefs.background.picker.shortcut = store.get('background.picker.shortcut', 'F12')
}

const browsers = require('./browsers')(__dirname)
const {main, about, deficiency, preferences, picker} = browsers

const CCAController = require('./CCAcontroller')

const mainController = new CCAController(browsers, global.sharedObject)

require('./controllers')(browsers, mainController)