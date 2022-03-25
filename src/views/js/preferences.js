const { ipcRenderer } = require('electron')
const GlobalStorage = require('../../globalStorage.js')

let i18n, preferences

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-preferences'), false)

ipcRenderer.on('init', async (event, config) => {
    preferences = new GlobalStorage(window)

    const rounding = await preferences.get('main.rounding')
    document.getElementById('option-rounding').value = rounding
    const checkForUpdates = await preferences.get('main.checkForUpdates')
    document.getElementById('option-checkForUpdates').checked = checkForUpdates
    const lang = await preferences.get('main.lang')
    document.getElementById('option-lang').value = lang
    const foregroundPickerShortcut = preferences.get('foreground.picker.shortcut')
    document.getElementById('shortcut-foreground-picker').value = foregroundPickerShortcut
    const backgroundPickerShortcut = await preferences.get('background.picker.shortcut')
    document.getElementById('shortcut-background-picker').value = backgroundPickerShortcut

    i18n = config.i18n
    translateHTML(i18n)

})

document.getElementById('save').addEventListener('click', function () {
    const rounding = document.getElementById('option-rounding').value
    preferences.set('main.rounding', rounding)
    const checkForUpdates = document.getElementById('option-checkForUpdates').checked
    preferences.set(checkForUpdates, 'main', 'checkForUpdates')
    const lang = document.getElementById('option-lang').value
    preferences.set('main.lang', lang)
    const foregroundPickerShortcut = document.getElementById('shortcut-foreground-picker').value
    preferences.set('foreground.picker.shortcut', foregroundPickerShortcut)
    let backgroundPickerShortcut = document.getElementById('shortcut-background-picker').value
    preferences.set('background.picker.shortcut', backgroundPickerShortcut)
    close()
})

document.getElementById('cancel').addEventListener('click', function () {
    close()
})

function close() {
    window.close()
}

function translateHTML(i18n) {
    // translate html elements.

    document.title = i18n['Title']
    document.querySelector('h1').textContent = i18n['Preferences']

    document.querySelector('body > main > fieldset:nth-child(2) > legend').textContent = i18n['Options']
    document.querySelector('body > main > fieldset:nth-child(2) > label:nth-child(2)').textContent = i18n['Contrast ratio precision']

    document.querySelector('#option-rounding > option:nth-child(1)').textContent = i18n['1 decimal place']
    document.querySelector('#option-rounding > option:nth-child(2)').textContent = i18n['2 decimal places']

    document.querySelector('body > main > fieldset:nth-child(2) > label:nth-child(4)').innerHTML
        = document.querySelector('body > main > fieldset:nth-child(2) > label:nth-child(4)').innerHTML.replace('Enable Auto-Update', i18n['Enable Auto-Update'])

    document.querySelector('label[for="option-lang"]').textContent = i18n['Language']

    document.querySelector('body > main > fieldset:nth-child(3) > legend').textContent = i18n['Shortcuts']

    document.querySelector('body > main > fieldset:nth-child(3) > label:nth-child(2)').textContent = i18n['Picker foreground']
    document.querySelector('body > main > fieldset:nth-child(3) > label:nth-child(4)').textContent = i18n['Picker background']

    document.getElementById('save').innerText = i18n['Save']
    document.getElementById('cancel').innerText = i18n['Cancel']
}