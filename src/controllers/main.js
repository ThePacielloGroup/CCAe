const {ipcMain} = require('electron')

module.exports = (browsers, store) => {
    const {main} = browsers
    ipcMain.on('init-app', async () => {
        const lang = store.get('lang')
        const i18n = new(require('../i18n'))(lang)
        let config = {
            i18n: i18n.asObject()
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
                const lang = store.get('lang')
                const i18n = new(require('../i18n'))(lang)
                        win.webContents.send(event, i18n.asObject())
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