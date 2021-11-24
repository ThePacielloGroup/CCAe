const { ipcMain, app } = require('electron')
const Store = require('electron-store');
const store = new Store();
const CCAColor = require('./color/CCAcolor.js')
const { checkForUpdates, setUpdatesDisabled } = require('./update.js')

let i18n

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
//    const { screen } = require('electron')
//    const displays = screen.getAllDisplays()
//    console.log(displays)
    loadPreferences()
    i18n = new(require('./i18n'))(global.sharedObject.preferences.main.lang)

    main.init()

    setMenu(i18n)

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

app.on('quit', () => {
    // Save last position
    store.set('main.position.x', global.sharedObject.preferences.main.position.x)
    store.set('main.position.y', global.sharedObject.preferences.main.position.y)
    store.set('main.alwaysOnTop', global.sharedObject.preferences.main.alwaysOnTop)
    store.set('main.foreground.sliders.open', global.sharedObject.preferences.foreground.sliders.open)
    store.set('main.background.sliders.open', global.sharedObject.preferences.background.sliders.open)
    store.set('main.foreground.sliders.tab', global.sharedObject.preferences.foreground.sliders.tab)
    store.set('main.background.sliders.tab', global.sharedObject.preferences.background.sliders.tab)
})

ipcMain.on('setPreference', (event, value, section, level, sublevel) => {
    var option, oldValue
    if (sublevel) {
        oldValue = global.sharedObject.preferences[section][level][sublevel]
        global.sharedObject.preferences[section][level][sublevel] = value
        option = section + '.' + level + '.' + sublevel
    } else {
        oldValue = global.sharedObject.preferences[section][level]
        global.sharedObject.preferences[section][level] = value
        option = section + '.' + level   
    }
    if (value != oldValue) {
        store.set(option, value)
        switch(option) {
            case 'main.rounding':
                mainController.updateContrastRatio()
            break;
            case 'main.lang':
                i18n = new(require('./i18n'))(sharedObject.preferences.main.lang)
                setMenu(i18n)
                mainController.sendEventToAll('langChanged')
                mainController.updateLanguage()
            break;
            case 'foreground.picker.shortcut':
                mainController.updateShortcut(option, oldValue, value)
            break;
            case 'background.picker.shortcut':
                mainController.updateShortcut(option, oldValue, value)
            break;
            case 'main.checkForUpdates':
                if (value === true) {
                    checkForUpdates()
                } else {
                    setUpdatesDisabled()
                }
            break;
        }
    }
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
            lang: 'auto'
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
        }
    }
}

// Provide the global data for renderers
ipcMain.handle('get-global-shared', async (event) => {
    return global.sharedObject
})

function loadPreferences() {
    prefs = global.sharedObject.preferences
    prefs.main.checkForUpdates = store.get('main.checkForUpdates', false)
    prefs.main.position.x = store.get('main.position.x', null)
    prefs.main.position.y = store.get('main.position.y', null)
    prefs.main.rounding = store.get('main.rounding', 1)
    prefs.main.alwaysOnTop = store.get('main.alwaysOnTop', true)
    prefs.main.lang = store.get('main.lang', 'auto')
    prefs.foreground.format = store.get('foreground.format', 'hex')
    prefs.background.format = store.get('background.format', 'hex')
    prefs.foreground.picker.shortcut = store.get('foreground.picker.shortcut', 'F11')
    prefs.background.picker.shortcut = store.get('background.picker.shortcut', 'F12')
    prefs.foreground.sliders.open = store.get('main.foreground.sliders.open', false)
    prefs.background.sliders.open = store.get('main.background.sliders.open', false)
    prefs.foreground.sliders.tab = store.get('main.foreground.sliders.tab', 'rgb')
    prefs.background.sliders.tab = store.get('main.background.sliders.tab', 'rgb')
}

function sendEventToAll(event, ...params) {
    Object.keys(controllers).map(function(key, index) {
        controllers[key].sendEvent(event, ...params)
    });
}

const browsers = require('./browsers')(__dirname, global.sharedObject)
const { main } = browsers
const controllers = require('./controllers')(browsers, global.sharedObject)

const CCAController = require('./CCAcontroller')
const mainController = new CCAController(sendEventToAll, global.sharedObject)
const { setMenu } = require('./menu.js')(browsers, mainController, global.sharedObject)