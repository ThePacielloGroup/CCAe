const { ipcRenderer, remote } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-preferences'), false)

ipcRenderer.on('init', (event, config) => {
    document.getElementById('option-rounding').value = sharedObject.preferences.main.rounding
    document.getElementById('option-checkForUpdates').checked = sharedObject.preferences.main.checkForUpdates
    document.getElementById('shortcut-foreground-picker').value = sharedObject.preferences.foreground.picker.shortcut
    document.getElementById('shortcut-background-picker').value = sharedObject.preferences.background.picker.shortcut

    translateHTML(config)
})

document.getElementById('save').addEventListener('click', function () {
    var rounding = document.getElementById('option-rounding').value
    if (rounding != sharedObject.preferences.main.rounding) {
        ipcRenderer.send('setPreference', rounding, 'main', 'rounding')
    }
    var checkForUpdates = document.getElementById('option-checkForUpdates').checked
    if (checkForUpdates != sharedObject.preferences.main.checkForUpdates) {
        ipcRenderer.send('setPreference', checkForUpdates, 'main', 'checkForUpdates')
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

function translateHTML(config) {
    // translate html elements.
    const i18n = JSON.parse(config.i18n).Preferences

    document.title = i18n['Title']
    document.querySelector('h1').textContent = i18n['Preferences']

    document.querySelector('body > main > fieldset:nth-child(2) > legend').textContent = i18n['Options']
    document.querySelector('body > main > fieldset:nth-child(2) > label:nth-child(2)').textContent = i18n['Contrast ratio precision']

    document.querySelector('#option-rounding > option:nth-child(1)').textContent = i18n['1 decimal place']
    document.querySelector('#option-rounding > option:nth-child(2)').textContent = i18n['2 decimal places']

    document.querySelector('body > main > fieldset:nth-child(2) > label:nth-child(4)').innerHTML
        = document.querySelector('body > main > fieldset:nth-child(2) > label:nth-child(4)').innerHTML.replace('Enable Auto-Update', i18n['Enable Auto-Update'])

    document.querySelector('body > main > fieldset:nth-child(3) > legend').textContent = i18n['Shortcuts']

    document.querySelector('body > main > fieldset:nth-child(3) > label:nth-child(2)').textContent = i18n['Picker foreground']
    document.querySelector('body > main > fieldset:nth-child(3) > label:nth-child(4)').textContent = i18n['Picker background']

    document.getElementById('save').innerText = i18n['Save']
    document.getElementById('cancel').innerText = i18n['Cancel']
}