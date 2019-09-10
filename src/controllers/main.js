const {ipcMain} = require('electron')
const i18n = new(require('../i18n'))

module.exports = (browsers, mainController) => {
    const {main} = browsers

    let win

    ipcMain.on('init-app', event => {
        win = main.getWindow()
        let config = {
            i18n: i18n.asJSON()
        }
        event.sender.send('init', config)
    })

    ipcMain.on('height-changed', (event, height) => {
        main.changeSize(null, height)
    })
}