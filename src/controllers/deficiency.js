const {ipcMain} = require('electron')

module.exports = (browsers, store) => {
    const {deficiency} = browsers
    ipcMain.on('init-deficiency', async () => {
        const lang = await store.get('lang')
        const localLang = await store.get('localLang')
        let config = {
            lang, localLang
        }
        sendEvent('init', config)
    })

    let sendEvent = async (event, ...params) => {
        const win = deficiency.getWindow()
        if (win) {

        switch(event) {
            case 'langChanged':
                const lang = await store.get('lang')
                const localLang = await store.get('localLang')
                win.webContents.send(event, lang, localLang)
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