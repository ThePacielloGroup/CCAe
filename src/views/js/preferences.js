const { ipcRenderer, remote } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-preferences'), false)

ipcRenderer.on('init', event => {
    document.getElementById('option-rounding').value = sharedObject.preferences.main.rounding
    document.getElementById('shortcut-foreground-picker').value = sharedObject.preferences.foreground.picker.shortcut
    document.getElementById('shortcut-background-picker').value = sharedObject.preferences.background.picker.shortcut
})

document.getElementById('save').addEventListener('click', function () {
    var rounding = document.getElementById('option-rounding').value
    if (rounding != sharedObject.preferences.main.rounding) {
        ipcRenderer.send('setPreference', rounding, 'main', 'rounding')
    } 
    var foregroundPickerShortcut = document.getElementById('shortcut-foreground-picker').value
    if (foregroundPickerShortcut != sharedObject.preferences.foreground.picker.shortcut) {
        ipcRenderer.send('setPreference', foregroundPickerShortcut, 'foreground', 'picker', 'shortcut')
    } 
    var backgroundPickerShortcut = document.getElementById('shortcut-background-picker').value
    if (backgroundPickerShortcut != sharedObject.preferences.background.picker.shortcut) {
        ipcRenderer.send('setPreference', backgroundPickerShortcut, 'background', 'picker', 'shortcut')
    } 
    close()
})

document.getElementById('cancel').addEventListener('click', function () {
    close()
})

function close() {
    var win = remote.getCurrentWindow()
    win.close()
}