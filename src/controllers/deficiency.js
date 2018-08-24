const {ipcMain} = require('electron')

module.exports = (browsers, mainController) => {
    ipcMain.on('init-deficiency', event => {
        event.sender.send('init')
    })
}