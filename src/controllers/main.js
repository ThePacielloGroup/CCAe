const {ipcMain} = require('electron')

module.exports = (browsers, sharedObject) => {
    const {main} = browsers
    ipcMain.on('init-app', () => {
        const i18n = new(require('../i18n'))(sharedObject.preferences.main.lang)
        let config = {
            i18n: i18n.asObject().Main
        }
        sendEvent('init', config)
    })

    ipcMain.on('height-changed', (event, height) => {
        main.changeSize(null, height)
    })

    let sendEvent = (event, ...params) => {
        const win = main.getWindow()
        if (win) {

        switch(event) {
            case 'langChanged':
                const i18n = new(require('../i18n'))(sharedObject.preferences.main.lang)
                win.webContents.send(event, i18n.asObject().Main)
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