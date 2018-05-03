const {ipcMain, BrowserWindow} = require('electron')

module.exports = (browsers, eventEmitter) => {
    const {picker, main} = browsers

    let win

    ipcMain.on('init-app', event => {
        win = main.getWindow()

        event.sender.send('init')
    })
}