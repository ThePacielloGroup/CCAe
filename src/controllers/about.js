const {ipcMain, app} = require('electron')

module.exports = (browsers, mainController) => {
    ipcMain.on('init-about', event => {
        let config = {
            version: app.getVersion(),
        }
        event.sender.send('init', config)
    })
}