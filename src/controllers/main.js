const {ipcMain} = require('electron')

module.exports = (browsers, store) => {
    const {main} = browsers
    ipcMain.on('init-app', async () => {
        const lang = await store.get('lang')
        const localLang = await store.get('localLang')
        let config = {
            lang, localLang
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