const {ipcMain, app} = require('electron')
const i18n = new(require('../i18n'))

module.exports = (browsers, mainController) => {
    ipcMain.on('init-about', event => {
        let config = {
            version: app.getVersion(),
            i18n: i18n.asJSON()
        }
        event.sender.send('init', config)
    })
}