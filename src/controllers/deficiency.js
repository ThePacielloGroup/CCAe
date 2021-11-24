const {ipcMain} = require('electron')

module.exports = (browsers, preferences) => {
    const {deficiency} = browsers
    ipcMain.on('init-deficiency', async () => {
        const lang = await preferences.get('main.lang')
        const i18n = new(require('./i18n'))(lang)
        let config = {
            i18n: i18n.asObject().Deficiency
        }
        sendEvent('init', config)
    })

    let sendEvent = async (event, ...params) => {
        const win = deficiency.getWindow()
        if (win) {

        switch(event) {
            case 'langChanged':
                const lang = await preferences.get('main.lang')
                const i18n = new(require('./i18n'))(lang)
                win.webContents.send(event, i18n.asObject().Deficiency)
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