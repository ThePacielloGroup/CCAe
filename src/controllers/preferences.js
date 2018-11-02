const {ipcMain, app} = require('electron')

module.exports = (browsers, mainController) => {
    ipcMain.on('init-preferences', event => {
    })
}