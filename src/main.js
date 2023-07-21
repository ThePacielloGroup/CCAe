const { ipcMain, app } = require('electron')
const Store = require('electron-store');
const { checkForUpdates, setUpdatesDisabled } = require('./update.js')
const CCAController = require('./CCAcontroller')
let browsers, controllers, mainController, setMenu, i18n

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// https://json-schema.org/understanding-json-schema/reference
const schema = {
    position : {
        type: 'object',
        properties: {
            x: {
                type: 'integer',
            },
            y: {
                type: 'integer',
            },
        }
    },
    checkForUpdates: {
        type: 'boolean',
        default: false,
    },
    rounding: {
        type: 'number',
        minimum: 0,
        maximum: 3,
        default: 1,
    },
    alwaysOnTop: {
        type: 'boolean',
        default: false,
    },
    lang: {
        type: 'string',
        default: 'auto',
    },
    colorScheme: {
        type: 'string',
        default: "system"
    },
    copy: {
        type: 'object',
        properties: {
            regularTemplate: {
                type: 'string',
                default: '%i18n.f%: %f.hex%\n\
%i18n.b%: %b.hex%\n\
%i18n.cr%: %cr%:1\n\
%i18n.1.4.3%\n\
    %1.4.3%\n\
%i18n.1.4.6%\n\
    %1.4.6%\n\
%i18n.1.4.11%\n\
    %1.4.11%',
            },
            shortTemplate: {
                type: 'string',
                default: '%i18n.f%: %f.hex%\n\
%i18n.b%: %b.hex%\n\
%i18n.cr%: %cr%:1',
            },
        },
        default: {}
        // Replaced on first modification, to match the user lang.
        //%i18n.f% : "Foreground"
        //%i18n.b% : "Background"
        //%i18n.cr% : "Contrast ratio"
        //%i18n.1.4.3% : "1.4.3 Contrast (Minimum)"
        //%i18n.1.4.6% : "1.4.6 Contrast (Enhanced)"
        //%i18n.1.4.11% : "1.4.11 Non-text Contrast"
    },
    picker: {
        type: 'integer',
        default: (process.platform === 'win32' || process.platform === 'win64' || /^(msys|cygwin)$/.test(process.env.OSTYPE))?2:1, // Disable for Windows until https://github.com/electron/electron/issues/27980
    },
    foreground : {
        type: 'object',
        properties: {
            format: {
                type: 'string',
                default: 'hex',
            },
            picker : {
                type: 'object',
                properties: {
                    shortcut: {
                        type: 'string',
                        default: 'F11'
                    }
                },
                default: {}
            },
            sliders : {
                type: 'object',
                properties: {
                    open: {
                        type: 'boolean',
                        default: false,
                    },
                    tab: {
                        type: 'string',
                        default: 'rgb'
                    }
                },
                default: {}
            }
        },
        default: {}
    },
    background : {
        type: 'object',
        properties: {
            format: {
                type: 'string',
                default: 'hex',
            },
            picker : {
                type: 'object',
                properties: {
                    shortcut: {
                        type: 'string',
                        default: 'F12'
                    }
                },
                default: {}
            },
            sliders : {
                type: 'object',
                properties: {
                    open: {
                        type: 'boolean',
                        default: false,
                    },
                    tab: {
                        type: 'string',
                        default: 'rgb'
                    }
                },
                default: {}
            }
        },
        default: {}
    }
}

const store = new Store({schema,
    migrations: {
        '3.2.0': store => {
            store.clear();
        },
        '3.3.0': store => {
            store.delete('main');
        },
    }
})

// Expose 'electron-store' to Renderer-process through 'ipcMain.handle'
ipcMain.handle('store',
  async (_event, methodSign, ...args) => {
    if (typeof (store)[methodSign] === 'function') {
      return (store)[methodSign](...args)
    }
    return (store)[methodSign]
  }
)

// Monitor store changes
store.onDidChange('rounding', () => {
    mainController.updateContrastRatio()
})
store.onDidChange('lang', (newValue) => {
    i18n = new(require('./i18n'))(newValue)
    setMenu(i18n)
    mainController.sendEventToAll('langChanged')
    mainController.updateLanguage()
});
store.onDidChange('colorScheme',(newValue)=> {
    mainController.sendEventToAll("colorSchemeChanged",newValue);
})
store.onDidChange('foreground.format', ()=>{
    mainController.updateColor('foreground')
})
store.onDidChange('background.format', ()=>{
    mainController.updateColor('background')
})
store.onDidChange('foreground.picker.shortcut', (newValue, oldValue) => {
    mainController.updateShortcut('foreground.picker.shortcut', oldValue, value)
})
store.onDidChange('background.picker.shortcut', (newValue, oldValue) => {
    mainController.updateShortcut('background.picker.shortcut', oldValue, value)
})
store.onDidChange('main.checkForUpdates', (newValue) => {
    if (newValue === true) {
        checkForUpdates()
    } else {
        setUpdatesDisabled()
    }
})

console.log(store.path)
console.log(store.store)
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
//    const { screen } = require('electron')
//    const displays = screen.getAllDisplays()
//    console.log(displays)
    const lang = store.get('lang')
    i18n = new(require('./i18n'))(lang)

    browsers = require('./browsers')(__dirname, store)
    controllers = require('./controllers')(browsers, store)
    mainController = new CCAController(sendEventToAll, store)
    setMenu = require('./menu.js')(browsers, mainController, store).setMenu

    browsers.main.init()

    setMenu(i18n)

    // Register shortcuts
    const foregroundShortcut = store.get('foreground.picker.shortcut')

    mainController.updateShortcut('foreground.picker.shortcut', null, foregroundShortcut)
    const backgroundShortcut = store.get('background.picker.shortcut')
    mainController.updateShortcut('background.picker.shortcut', null, backgroundShortcut)

    const updates = store.get('checkForUpdates')
    if (updates === true) {
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

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function sendEventToAll(event, ...params) {
    Object.keys(controllers).map(function(key, index) {
        controllers[key].sendEvent(event, ...params)
    })
}
