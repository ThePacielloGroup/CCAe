const { Menu } = require('electron')
const isDev = ('NODE_ENV' in process.env && process.env.NODE_ENV === 'dev')
const isMacOS = process.platform === 'darwin'
const { installUpdate } = require('./update.js')

module.exports = (browsers, mainController, store) => {
    const { main, about, deficiency, preferences } = browsers
    let setMenu = (i18n) => {
        const menuTemplate = [
            {
                label: i18n.menuT('Colour Contrast Analyser (CCA)'),
                submenu: [
                    {
                        label: i18n.menuT('About CCA'),
                        accelerator: 'F1',
                        click: () => {
                            const parent = main.getWindow()
                            about.init(parent)
                        }
                    },
                    {
                        label: i18n.menuT('Preferences'),
                        accelerator: 'CmdOrCtrl+,',
                        click: () => {
                            // Center panel on main window
                            const parent = main.getWindow()
                            // pos = parent.getPosition()
                            // size = parent.getSize()
                            // x = Math.round(pos[0] + (size[0]/2) - (300/2))
                            // y = Math.round(pos[1] + (size[1]/2) - (400/2))
                            preferences.init(parent)
                        }
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
                        accelerator: 'CmdOrCtrl+F',
                        click: () => {
                            mainController.copyRegularResults()
                        }
                    },
                    {
                        label: i18n.menuT('Copy short results'),
                        accelerator: 'CmdOrCtrl+S',
                        click: () => {
                            mainController.copyShortResults()
                        },
                    }
                ]
            },
            {
                label: i18n.menuT('View'),
                submenu: [
                    {
                        label: i18n.menuT('Colour blindness simulation'),
                        accelerator: 'CmdOrCtrl+B',
                        click: () => {
                            const parent = main.getWindow()
                            deficiency.init(parent)
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: i18n.menuT('Always on Top'),
                        type: 'checkbox',
                        checked: store.get('alwaysOnTop'),
                        click: (item) => {
                            main.getWindow().setAlwaysOnTop(item.checked)
                            store.set('alwaysOnTop', item.checked)
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
                        label: i18n.menuT('Actual Size'),
                        accelerator: 'CmdOrCtrl+num0',
                        visible: false,
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
                                zoomLevel = webContents.getZoomLevel()
                                webContents.setZoomLevel(zoomLevel + 0.5)
                                main.changeZoom(zoomLevel + 0.5)
                            }
                        }
                    },
                    {
                        label: i18n.menuT('Zoom In'),
                        accelerator: 'CmdOrCtrl+numadd',
                        visible: false,
                        click (item, focusedWindow) {
                            if (focusedWindow) {
                                const {webContents} = focusedWindow
                                zoomLevel = webContents.getZoomLevel()
                                webContents.setZoomLevel(zoomLevel + 0.5)
                                main.changeZoom(zoomLevel + 0.5)
                            }
                        }
                    },
                    // By default zoomIn works by "CommandOrControl + +" ("CommandOrControl + SHIFT + =")
                    // Hidden menu item adds zoomIn without SHIFT
                    {
                        label: i18n.menuT('Zoom In'),
                        accelerator: 'CommandOrControl+=',
                        visible: false,
                        click (item, focusedWindow) {
                            if (focusedWindow) {
                                const {webContents} = focusedWindow
                                zoomLevel = webContents.getZoomLevel()
                                webContents.setZoomLevel(zoomLevel + 0.5)
                                main.changeZoom(zoomLevel + 0.5)
                            }
                        }
                    },
                    {
                        label: i18n.menuT('Zoom Out'),
                        accelerator: 'CmdOrCtrl+-',
                        click (item, focusedWindow) {
                            if (focusedWindow) {
                                const {webContents} = focusedWindow
                                zoomLevel = webContents.getZoomLevel()
                                webContents.setZoomLevel(zoomLevel - 0.5)
                                main.changeZoom(zoomLevel - 0.5)
                            }
                        }
                    },
                    {
                        label: i18n.menuT('Zoom Out'),
                        accelerator: 'CmdOrCtrl+numsub',
                        visible: false,
                        click (item, focusedWindow) {
                            if (focusedWindow) {
                                const {webContents} = focusedWindow
                                zoomLevel = webContents.getZoomLevel()
                                webContents.setZoomLevel(zoomLevel - 0.5)
                                main.changeZoom(zoomLevel - 0.5)
                            }
                        }
                    }
                ]
            },
            {
                label: i18n.menuT('Window'),
                submenu: [],
                visible: isMacOS // MacOS only, native on Window
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
                        accelerator: isMacOS ? 'Alt+Command+I' : 'Ctrl+Shift+I',
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
        if (isMacOS) {
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

            menuTemplate[3].submenu.push(
                {
                    label: i18n.menuT('Move to previous monitor'),
                    accelerator: 'Ctrl+Alt+Left',
                    click () {
                        main.movePreviousMonitor()
                    }
                },
                {
                    label: i18n.menuT('Move to next monitor'),
                    accelerator: 'Ctrl+Alt+Right',
                    click () {
                        main.moveNextMonitor()
                    }
                },
            )
        }

        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    }

    return {
        setMenu: setMenu,
    }
}