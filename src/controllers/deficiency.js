const {ipcMain} = require('electron')
const i18n = new(require('../i18n'))

module.exports = (browsers, mainController) => {
    ipcMain.on('init-deficiency', event => {
        let config = {
            i18n: i18n.asJSON()
        }
        event.sender.send('init', config)
    })
}