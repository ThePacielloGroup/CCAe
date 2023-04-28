const { ipcRenderer } = require('electron')
const store = require('../../store.js')
let i18n

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-preferences'), false)

ipcRenderer.on('init', async (event, config) => {
    const theme = await store.get("colorScheme");
    const rounding = await store.get('rounding')
    setColorScheme(theme)
    document.getElementById('option-rounding').value = rounding
    const checkForUpdates = await store.get('checkForUpdates')
    document.getElementById('option-checkForUpdates').checked = checkForUpdates
    const lang = await store.get('lang')
    document.getElementById('option-lang').value = lang
    document.getElementById('option-theme').value = theme
    const foregroundPickerShortcut = await store.get('foreground.picker.shortcut')
    document.getElementById('shortcut-foreground-picker').value = foregroundPickerShortcut
    const backgroundPickerShortcut = await store.get('background.picker.shortcut')
    document.getElementById('shortcut-background-picker').value = backgroundPickerShortcut

    if (process.platform === 'win32' || process.platform === 'win64' || /^(msys|cygwin)$/.test(process.env.OSTYPE)) {
        document.getElementById('option-picker-group').hidden = true
    } else {
        const picker = await store.get('picker')
        document.getElementById('option-picker').value = picker
    }

    i18n = config.i18n
    translateHTML(i18n)

})

document.getElementById('save').addEventListener('click', function () {
    const rounding = document.getElementById('option-rounding').value
    store.set('rounding', parseInt(rounding))
    const checkForUpdates = document.getElementById('option-checkForUpdates').checked
    store.set('checkForUpdates', checkForUpdates)
    const lang = document.getElementById('option-lang').value
    store.set('lang', lang)
    const theme = document.getElementById('option-theme').value
    store.set('colorScheme', theme)
    const foregroundPickerShortcut = document.getElementById('shortcut-foreground-picker').value
    store.set('foreground.picker.shortcut', foregroundPickerShortcut)
    const backgroundPickerShortcut = document.getElementById('shortcut-background-picker').value
    store.set('background.picker.shortcut', backgroundPickerShortcut)
    if (!(process.platform === 'win32' || process.platform === 'win64' || /^(msys|cygwin)$/.test(process.env.OSTYPE))) {
        const picker = document.getElementById('option-picker').value
        store.set('picker', parseInt(picker))
    }
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
    document.querySelector('label[for="option-theme"]').textContent = i18n['Application Theme']
    document.querySelectorAll('#option-theme>option').forEach((opt,idx)=>{
        switch(idx) {
            case 0:
                opt.textContent = i18n["System (Default)"];
                break;
            case 1:
                opt.textContent = i18n["Light"];
                break;
            case 2:
                opt.textContent = i18n["Dark"];
                break;
        }
    })
    document.querySelector('label[for="option-picker"]').textContent = i18n['Color Picker type']

    document.querySelector('body > main > fieldset:nth-child(3) > legend').textContent = i18n['Shortcuts']

    document.querySelector('body > main > fieldset:nth-child(3) > label:nth-child(2)').textContent = i18n['Picker foreground']
    document.querySelector('body > main > fieldset:nth-child(3) > label:nth-child(4)').textContent = i18n['Picker background']

    document.getElementById('save').innerText = i18n['Save']
    document.getElementById('cancel').innerText = i18n['Cancel']
}

function setColorScheme ( v ) {
    switch (v) {
        case "system":
            document.documentElement.classList.remove('force-dark','force-light');
            document.documentElement.classList.add("system")
        break;
        case "force-dark":
            document.documentElement.classList.remove('force-light','system');
            document.documentElement.classList.add("force-dark");
            break;
        case "force-dark":
            document.documentElement.classList.remove('force-light','system');
            document.documentElement.classList.add("force-dark");
            break;
        case "force-light":
            document.documentElement.classList.remove('force-dark','system');
            document.documentElement.classList.add('force-light');
        break;
    }
};