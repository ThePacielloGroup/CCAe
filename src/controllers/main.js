const {ipcMain} = require('electron')

module.exports = (browsers, preferences) => {
    const {main} = browsers
    ipcMain.on('init-app', async () => {
        const lang = await preferences.get('main.lang')
        const i18n = new(require('../i18n'))(lang)
        let config = {
            i18n: i18n.asObject().Main
        }
        sendEvent('init', config)
    })

    ipcMain.on('height-changed', (event, height) => {
        main.changeSize(null, height)
    })

    let sendEvent = async (event, ...params) => {
        const win = main.getWindow()
        if (win) {

        switch(event) {
            case 'langChanged':
                const lang = await preferences.get('main.lang')
                const i18n = new(require('../i18n'))(lang)
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