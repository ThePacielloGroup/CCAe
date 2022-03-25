const { ipcRenderer } = require('electron')
document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-deficiency'), false)

let i18n

ipcRenderer.on('init', (event, config) => {
    i18n = config.i18n
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

ipcRenderer.on('langChanged', (event, i18nNew) => {
    i18n = i18nNew
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
    // translate html elements.
    document.title = i18n['Title']
    document.querySelector('body > main > h1').textContent = i18n['Colour blindness simulation']
    document.querySelector('body > main > h2:nth-child(2)').textContent = i18n['Monochromacy']

    document.querySelector('#deficiency-achromatopsia > h3 > span.text').innerHTML = i18n['Achromatopsia']
    document.querySelector('#deficiency-achromatopsia > div.desc').textContent = i18n['no colour']
    document.querySelector('#deficiency-achromatopsia-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-achromatomaly > h3 > span.text').textContent = i18n['Achromatomaly']
    document.querySelector('#deficiency-achromatomaly > div.desc').textContent = i18n['almost no colour']
    document.querySelector('#deficiency-achromatomaly-preview').textContent = i18n['Sample']

    document.querySelector('body > main > h2:nth-child(4)').textContent = i18n['Dichromacy']
    document.querySelector('#deficiency-protanopia > h3 > span.text').textContent = i18n['Protanopia']
    document.querySelector('#deficiency-protanopia > div.desc').textContent = i18n['no red']
    document.querySelector('#deficiency-protanopia-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-deuteranopia > h3 > span.text').textContent = i18n['Deuteranopia']
    document.querySelector('#deficiency-deuteranopia > div.desc').textContent = i18n['no green']
    document.querySelector('#deficiency-deuteranopia-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-tritanopia > h3 > span.text').textContent = i18n['Tritanopia']
    document.querySelector('#deficiency-tritanopia > div.desc').textContent = i18n['no blue']
    document.querySelector('#deficiency-tritanopia-preview').textContent = i18n['Sample']

    document.querySelector('body > main > h2:nth-child(6)').textContent = i18n['Trichromacy']
    document.querySelector('#deficiency-protanomaly > h3 > span.text').textContent = i18n['Protanomaly']
    document.querySelector('#deficiency-protanomaly > div.desc').textContent = i18n['low red']
    document.querySelector('#deficiency-protanomaly-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-deuteranomaly > h3 > span.text').textContent = i18n['Deuteranomaly']
    document.querySelector('#deficiency-deuteranomaly > div.desc').textContent = i18n['low green']
    document.querySelector('#deficiency-deuteranomaly-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-tritanomaly > h3 > span.text').textContent = i18n['Tritanomaly']
    document.querySelector('#deficiency-tritanomaly > div.desc').textContent = i18n['low blue']
    document.querySelector('#deficiency-tritanomaly-preview').textContent = i18n['Sample']
}
