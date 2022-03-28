const { ipcMain, app } = require('electron')
const GlobalStorage = require('./globalStorage.js')
const { checkForUpdates, setUpdatesDisabled } = require('./update.js')
const CCAController = require('./CCAcontroller')
let browsers, controllers, mainController, setMenu, i18n, preferences

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
//    const { screen } = require('electron')
//    const displays = screen.getAllDisplays()
//    console.log(displays)
    preferences = new GlobalStorage()
    const lang = await preferences.get('main.lang')
    i18n = new(require('./i18n'))(lang)

    browsers = require('./browsers')(__dirname, preferences)
    controllers = require('./controllers')(browsers, preferences)
    mainController = new CCAController(sendEventToAll, preferences)
    setMenu = require('./menu.js')(browsers, mainController, preferences).setMenu

    browsers.main.init()

    setMenu(i18n)

    // Register shortcuts
    const foregroundShortcut = await preferences.get('foreground.picker.shortcut')
    mainController.updateShortcut('foreground.picker.shortcut', null, foregroundShortcut)
    const backgroundShortcut = await preferences.get('background.picker.shortcut')
    mainController.updateShortcut('background.picker.shortcut', null, backgroundShortcut)

    const updates = await preferences.get('main.checkForUpdates')
    if (updates === true) {
        checkForUpdates()
    } else {
        setUpdatesDisabled()
    }
    // Monitor preferences changes
    // TODO
    // window.addEventListener('storage', async function(e) {
    //     switch(e.key) {
    //         case 'main.rounding':
    //             mainController.updateContrastRatio()
    //         break;
    //         case 'main.lang':
    //             const lang = await preferences.get('main.lang')
    //             i18n = new(require('./i18n'))(lang)
    //             setMenu(i18n)
    //             mainController.sendEventToAll('langChanged')
    //             mainController.updateLanguage()
    //         break;
    //         case 'foreground.picker.shortcut':
    //             mainController.updateShortcut(option, oldValue, value)
    //         break;
    //         case 'background.picker.shortcut':
    //             mainController.updateShortcut(option, oldValue, value)
    //         break;
    //         case 'main.checkForUpdates':
    //             if (value === true) {
    //                 checkForUpdates()
    //             } else {
    //                 setUpdatesDisabled()
    //             }
    //         break;
    //     }
    // })
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