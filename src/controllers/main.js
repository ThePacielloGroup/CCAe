const {ipcMain} = require('electron')

module.exports = (browsers, mainController) => {
    const {main} = browsers

    let win

    ipcMain.on('init-app', event => {
        win = main.getWindow()
        event.sender.send('init')
    })

    ipcMain.on('height-changed', (event, height) => {
        csize = win.getContentSize()
        if (process.platform === 'win32') {
            height += 20 // Add extra height for menubar size
        }
        win.setContentSize(csize[0], height)
    })
}