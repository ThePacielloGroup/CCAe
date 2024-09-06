const {ipcMain, app} = require('electron')

module.exports = (browsers, store) => {
    const {about} = browsers
    ipcMain.on('init-about', async () => {
        const lang = await store.get('lang')
        const localLang = await store.get('localLang')
        let config = {
            version: app.getVersion(),
            lang, localLang
        }
        sendEvent('init', config)
    })

    let sendEvent = async (event, ...params) => {
        const win = about.getWindow()
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