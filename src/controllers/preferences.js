const {ipcMain, app} = require('electron')

module.exports = (browsers, prefs) => {
    const {preferences} = browsers
    ipcMain.on('init-preferences', () => {
        const i18n = new(require('../i18n'))(prefs.get('main.lang'))
        let config = {
            i18n: i18n.asObject().Preferences
        }
        sendEvent('init', config)
    })
    let sendEvent = (event, ...params) => {
        const win = preferences.getWindow()
        if (win) {
            win.webContents.send(event, ...params)
        }
    }

    return {
        sendEvent: sendEvent,
    }
}