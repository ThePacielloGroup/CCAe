const { ipcRenderer } = require('electron');
const store = require('../../store');

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-deficiency'), false)

ipcRenderer.on('init', async (event, config) => {
    const theme = await store.get("colorScheme");
    setColorScheme(theme)
    const i18n = new(require('../../i18n'))(config.lang, config.localLang)
    translateHTML(i18n)
    ipcRenderer.invoke('getColorObject', 'foreground').then((color) => {
        applyColor('foreground', color)
    })
    ipcRenderer.invoke('getColorObject', 'background').then((color) => {
        applyColor('background', color)
    })
    ipcRenderer.invoke('getContrastRatioObject', 'background').then((contrastRatio) => {
        applyContrastRatio(contrastRatio)
    })
})

ipcRenderer.on('colorChanged', (event, section, color) => {
    applyColor(section, color)
})

ipcRenderer.on('contrastRatioChanged', (event, contrastRatio) => {
    applyContrastRatio(contrastRatio)
})

ipcRenderer.on('langChanged', (event, lang, localLang) => {
    const i18n = new(require('../../i18n'))(lang, localLang)
    translateHTML(i18n)
})

function applyColor (section, color) {
    ['achromatopsia', 'achromatomaly', 'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly', 'tritanopia', 'tritanomaly'].forEach(function(key, index) {
        if (section === 'foreground') {
            document.getElementById('deficiency-' + key + '-preview').style.color = color[key]
        } else {
            document.getElementById('deficiency-' + key + '-preview').style.background = color[key]
        }
    })
}

function applyContrastRatio (contrastRatio) {
    ['achromatopsia', 'achromatomaly', 'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly', 'tritanopia', 'tritanomaly'].forEach(function(key, index) {
        const crr = contrastRatio[key].toLocaleString(i18n.lang)
        document.getElementById('deficiency-' + key + '-cr').innerHTML = `${crr}:1`
    })
}

function translateHTML(i18n) {
    document.querySelector('html').lang = i18n.T('Main', 'lang')

    // translate html elements.
    document.title = i18n.T('Deficiency', 'Title')
    document.querySelector('body > main > h1').textContent = i18n.T('Deficiency', 'Colour blindness simulation')
    document.querySelector('body > main > h2:nth-child(2)').textContent = i18n.T('Deficiency', 'Monochromacy')

    document.querySelector('#deficiency-achromatopsia > h3 > span.text').innerHTML = i18n.T('Deficiency', 'Achromatopsia')
    document.querySelector('#deficiency-achromatopsia > div.desc').textContent = i18n.T('Deficiency', 'no colour')
    document.querySelector('#deficiency-achromatopsia-preview').textContent = i18n.T('Deficiency', 'Sample')

    document.querySelector('#deficiency-achromatomaly > h3 > span.text').textContent = i18n.T('Deficiency', 'Achromatomaly')
    document.querySelector('#deficiency-achromatomaly > div.desc').textContent = i18n.T('Deficiency', 'almost no colour')
    document.querySelector('#deficiency-achromatomaly-preview').textContent = i18n.T('Deficiency', 'Sample')

    document.querySelector('body > main > h2:nth-child(4)').textContent = i18n.T('Deficiency', 'Dichromacy')
    document.querySelector('#deficiency-protanopia > h3 > span.text').textContent = i18n.T('Deficiency', 'Protanopia')
    document.querySelector('#deficiency-protanopia > div.desc').textContent = i18n.T('Deficiency', 'no red')
    document.querySelector('#deficiency-protanopia-preview').textContent = i18n.T('Deficiency', 'Sample')

    document.querySelector('#deficiency-deuteranopia > h3 > span.text').textContent = i18n.T('Deficiency', 'Deuteranopia')
    document.querySelector('#deficiency-deuteranopia > div.desc').textContent = i18n.T('Deficiency', 'no green')
    document.querySelector('#deficiency-deuteranopia-preview').textContent = i18n.T('Deficiency', 'Sample')

    document.querySelector('#deficiency-tritanopia > h3 > span.text').textContent = i18n.T('Deficiency', 'Tritanopia')
    document.querySelector('#deficiency-tritanopia > div.desc').textContent = i18n.T('Deficiency', 'no blue')
    document.querySelector('#deficiency-tritanopia-preview').textContent = i18n.T('Deficiency', 'Sample')

    document.querySelector('body > main > h2:nth-child(6)').textContent = i18n.T('Deficiency', 'Trichromacy')
    document.querySelector('#deficiency-protanomaly > h3 > span.text').textContent = i18n.T('Deficiency', 'Protanomaly')
    document.querySelector('#deficiency-protanomaly > div.desc').textContent = i18n.T('Deficiency', 'low red')
    document.querySelector('#deficiency-protanomaly-preview').textContent = i18n.T('Deficiency', 'Sample')

    document.querySelector('#deficiency-deuteranomaly > h3 > span.text').textContent = i18n.T('Deficiency', 'Deuteranomaly')
    document.querySelector('#deficiency-deuteranomaly > div.desc').textContent = i18n.T('Deficiency', 'low green')
    document.querySelector('#deficiency-deuteranomaly-preview').textContent = i18n.T('Deficiency', 'Sample')

    document.querySelector('#deficiency-tritanomaly > h3 > span.text').textContent = i18n.T('Deficiency', 'Tritanomaly')
    document.querySelector('#deficiency-tritanomaly > div.desc').textContent = i18n.T('Deficiency', 'low blue')
    document.querySelector('#deficiency-tritanomaly-preview').textContent = i18n.T('Deficiency', 'Sample')
}

function setColorScheme (v) {
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
}