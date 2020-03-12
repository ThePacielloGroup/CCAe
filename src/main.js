const { app, Menu } = require('electron')
const isDev = ('NODE_ENV' in process.env && process.env.NODE_ENV === 'dev')
const Store = require('electron-store');
const store = new Store();
const CCAColor = require('./color/CCAcolor.js')
const { checkForUpdates, installUpdate, setUpdatesDisabled } = require('./update.js')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
//    const { screen } = require('electron')
//    const displays = screen.getAllDisplays()
//    console.log(displays)
    const i18n  = new(require('./i18n'))
    loadPreferences()
    position = global.sharedObject.preferences.main.position
    alwaysOnTop = global.sharedObject.preferences.main.alwaysOnTop
    main.init(position.x, position.y, alwaysOnTop)
    const menuTemplate = [
        {
            label: i18n.menuT('Colour Contrast Analyser (CCA)'),
            submenu: [
                {
                    label: i18n.menuT('About CCA'),
                    accelerator: 'F1',
                    click: () => about.init()
                },
                {
                    label: i18n.menuT('Preferences'),
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
                    id: 'menuUpdateDisabled',
                    label: i18n.menuT('Auto Update is disabled'),
                    enabled: false,
                    visible: false
                },
                {
                    id: 'menuUpdateChecking',
                    label: i18n.menuT('Checking for updates...'),
                    enabled: false,
                    visible: false
                }, {
                    id: 'menuUpdateNotFound',
                    label: i18n.menuT('Current version is up-to-date'),
                    enabled: false,
                    visible: false
                }, {
                    id: 'menuUpdateFound',
                    label: i18n.menuT('Found updates, downloading...'),
                    enabled: false,
                    visible: false
                }, {
                    id: 'menuUpdateInstall',
                    label: i18n.menuT('Install update'),
                    accelerator: 'CmdOrCtrl+Shift+U',
                    click: installUpdate,
                    visible: false
                }, {
                    type: 'separator'
                }, {
                    label: i18n.menuT('Quit CCA'),
                    role: 'quit',
                    accelerator: 'CmdOrCtrl+Q'
                }
            ]
        },
        {
            label: i18n.menuT('Edit'),
            submenu: [
                {
                    label: i18n.menuT('Copy results'),
                    accelerator: 'CmdOrCtrl+Shift+C',
                    click: (item) => {
                        mainController.copyResults()
                    }
                }
            ]
        },
        {
            label: i18n.menuT('View'),
            submenu: [
                {
                    label: i18n.menuT('Colour blindness simulation'),
                    accelerator: 'CmdOrCtrl+B',
                    click: () => deficiency.init()
                },
                {
                    type: 'separator'
                },
                {
                    label: i18n.menuT('Always on Top'),
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
                    label: i18n.menuT('Actual Size'),
                    accelerator: 'CmdOrCtrl+0',		
                    click (item, focusedWindow) {		
                        if (focusedWindow) {
                            focusedWindow.webContents.setZoomLevel(0)
                            main.changeZoom(0)
                        }
                    }		
                },
                {
                    label: i18n.menuT('Zoom In'),
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
                    label: i18n.menuT('Zoom Out'),
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
        },
        {
            label: i18n.menuT('Development'),
            submenu: [
                {
                    label: i18n.menuT('Reload'),
                    accelerator: 'CmdOrCtrl+R',
                    click (item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload()
                    }
                },
                {
                    label: i18n.menuT('Open Developer Tools'),
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click (item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.openDevTools({mode: 'detach'})
                    }
                },
            ],
            visible: isDev
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
                label: i18n.menuT('Cut'),
                accelerator: 'CmdOrCtrl+X',
                selector: 'cut:'
            }, {
                label: i18n.menuT('Copy'),
                accelerator: 'CmdOrCtrl+C',
                selector: 'copy:'
            }, {
                label: i18n.menuT('Paste'),
                accelerator: 'CmdOrCtrl+V',
                selector: 'paste:'
            }
        )
    }

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Register shortcuts
    mainController.updateShortcut('foreground.picker.shortcut', null, global.sharedObject.preferences.foreground.picker.shortcut)
    mainController.updateShortcut('background.picker.shortcut', null, global.sharedObject.preferences.background.picker.shortcut)

    if (global.sharedObject.preferences.main.checkForUpdates === true) {
        checkForUpdates()
    } else {
        setUpdatesDisabled()
    }
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
    store.set('main.foreground.sliders.open', global.sharedObject.preferences.foreground.sliders.open)
    store.set('main.background.sliders.open', global.sharedObject.preferences.background.sliders.open)
    store.set('main.foreground.sliders.tab', global.sharedObject.preferences.foreground.sliders.tab)
    store.set('main.background.sliders.tab', global.sharedObject.preferences.background.sliders.tab)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let white = CCAColor.rgb(0, 0, 0)
let black = CCAColor.rgb(255, 255, 255)

global.sharedObject = {
    deficiencies : {
        normal : {
            foregroundColor : white,
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
            },
            sliders : {
                open : null,
                tab : null
            }
        },
        background : {
            format : null,
            picker : {
                shortcut : null
            },
            sliders : {
                open : null,
                tab : null
            }
        },
    }
}

function loadPreferences() {
    prefs = global.sharedObject.preferences
    prefs.main.checkForUpdates = store.get('main.checkForUpdates', false)
    prefs.main.position.x = store.get('main.position.x', null)
    prefs.main.position.y = store.get('main.position.y', null)
    prefs.main.rounding = store.get('main.rounding', 1)
    prefs.main.alwaysOnTop = store.get('main.alwaysOnTop', true)
    prefs.foreground.format = store.get('foreground.format', 'hex')
    prefs.background.format = store.get('background.format', 'hex')
    prefs.foreground.picker.shortcut = store.get('foreground.picker.shortcut', 'F11')
    prefs.background.picker.shortcut = store.get('background.picker.shortcut', 'F12')
    prefs.foreground.sliders.open = store.get('main.foreground.sliders.open', false)
    prefs.background.sliders.open = store.get('main.background.sliders.open', false)
    prefs.foreground.sliders.tab = store.get('main.foreground.sliders.tab', 'rgb')
    prefs.background.sliders.tab = store.get('main.background.sliders.tab', 'rgb')
}

const browsers = require('./browsers')(__dirname)
const {main, about, deficiency, preferences, picker} = browsers

const CCAController = require('./CCAcontroller')

const mainController = new CCAController(browsers, global.sharedObject)

require('./controllers')(browsers, mainController)