const { ipcRenderer, remote } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-preferences'), false)

ipcRenderer.on('init', event => {
    document.getElementById('option-rounding').value = sharedObject.preferences.main.rounding
    initTabs("main")
})

/* Tab Options */
document.getElementById('save').addEventListener('click', function () {
    var rounding = document.getElementById('option-rounding').value
    ipcRenderer.send('setPreference', 'main', 'rounding', null, rounding)
    close()
})

document.getElementById('cancel').addEventListener('click', function () {
    close()
})

function close() {
    var win = remote.getCurrentWindow()
    win.close()
}