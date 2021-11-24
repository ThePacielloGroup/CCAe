const {ipcMain, app} = require('electron')

module.exports = (browsers, preferences) => {
    const {about} = browsers
    ipcMain.on('init-about', async () => {
        const lang = await preferences.get('main.lang')
        const i18n = new(require('../i18n'))(lang)
        let config = {
            version: app.getVersion(),
            i18n: i18n.asObject().About
        }
        sendEvent('init', config)
    })

    let sendEvent = async (event, ...params) => {
        const win = about.getWindow()
        if (win) {

        switch(event) {
            case 'langChanged':
                const lang = await preferences.get('main.lang')
                const i18n = new(require('../i18n'))(lang)
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