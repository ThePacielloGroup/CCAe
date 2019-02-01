const { ipcRenderer, remote } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')

ipcRenderer.send('init-preferences')

ipcRenderer.on('init', event => {
    document.getElementById('option-rounding').value = sharedObject.preferences.options.rounding
    initTabs("main")
})

/* Tab Options */
document.getElementById('save').addEventListener('click', function () {
    var rounding = document.getElementById('option-rounding').value
    ipcRenderer.send('setOption', 'rounding', rounding)
    close()
})

document.getElementById('cancel').addEventListener('click', function () {
    close()
})

function close() {
    var win = remote.getCurrentWindow()
    win.close()
}