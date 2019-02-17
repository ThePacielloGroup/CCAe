const { app, Menu } = require('electron')
const isDev = ('NODE_ENV' in process.env && process.env.NODE_ENV === 'dev')

const { checkForUpdates, installUpdate } = require('./update.js')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    main.init()

    const menuTemplate = [
        {
            label: 'Colour Contrast Analyser (CCA)',
            submenu: [
                {
                    label: 'About CCA',
                    accelerator: 'F1',
                    click: () => about.init()
                }, {
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
            },/*
            {
              type: 'separator'
            },
            {
                label: 'Actual Size',
                accelerator: 'CmdOrCtrl+0',
                nonNativeMacOSRole: true,
                webContentsMethod: (webContents) => {
                  webContents.setZoomLevel(0)
                }
            },
            {
                label: 'Zoom In',
                accelerator: 'CmdOrCtrl+Plus',
                nonNativeMacOSRole: true,
                webContentsMethod: (webContents) => {
                  webContents.getZoomLevel((zoomLevel) => {
                    webContents.setZoomLevel(zoomLevel + 0.5)
                  })
                }
            },
            {
                label: 'Zoom Out',
                accelerator: 'CmdOrCtrl+-',
                nonNativeMacOSRole: true,
                webContentsMethod: (webContents) => {
                  webContents.getZoomLevel((zoomLevel) => {
                    webContents.setZoomLevel(zoomLevel - 0.5)
                  })
                }
            }*/
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
    options : {
    }
}

const browsers = require('./browsers')(__dirname)
const {main, about, deficiency} = browsers

const CCAController = require('./CCAcontroller')

const mainController = new CCAController(browsers, global.sharedObject)

require('./controllers')(browsers, mainController)
