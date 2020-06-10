const {ipcMain, app} = require('electron')

module.exports = (browsers, sharedObject) => {
    const {about} = browsers
    ipcMain.on('init-about', () => {
        const i18n = new(require('../i18n'))(sharedObject.preferences.main.lang)
        let config = {
            version: app.getVersion(),
            i18n: i18n.asObject().About
        }
        sendEvent('init', config)
    })

    let sendEvent = (event, ...params) => {
        const win = about.getWindow()
        if (win) {

        switch(event) {
            case 'langChanged':
                const i18n = new(require('../i18n'))(sharedObject.preferences.main.lang)
                win.webContents.send(event, i18n.asObject().About)
                break
            default:
                win.webContents.send(event, ...params)
            }
        }
    }

    return {
        sendEvent: sendEvent,
    }
}