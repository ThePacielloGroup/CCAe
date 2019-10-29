const { ipcRenderer } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-deficiency'), false)

ipcRenderer.on('init', (event, config) => {
    applyColor('foreground')
    applyColor('background')
    applyContrastRatio()

    translateHTML(config)
})

ipcRenderer.on('colorChanged', (event, section) => {
    applyColor(section)
})

ipcRenderer.on('contrastRatioChanged', event => {
    applyContrastRatio()
})

function applyColor (section) {
    Object.keys(sharedObject.deficiencies).forEach(function(key, index) {
        if (key !== 'normal') {
            if (section === 'foreground') {
                document.getElementById('deficiency-' + key + '-preview').style.color = this[key].foregroundColor.rgb().string()
            } else {
                document.getElementById('deficiency-' + key + '-preview').style.background = this[key].backgroundColor.rgb().string()
            }
        }
    }, sharedObject.deficiencies)
}

function applyContrastRatio () {
    Object.keys(sharedObject.deficiencies).forEach(function(key, index) {
        if (key !== 'normal') {
            document.getElementById('deficiency-' + key + '-cr').innerHTML = `(${this[key].contrastRatioString})` 
        }
    }, sharedObject.deficiencies)
}

function translateHTML(config) {
    // translate html elements.
    const i18n = JSON.parse(config.i18n).Deficiency

    document.title = i18n['Title']
    document.querySelector('body > main > h1').textContent = i18n['Colour blindness simulation']
    document.querySelector('body > main > h2:nth-child(2)').textContent = i18n['Monochromacy']

    document.querySelector('#deficiency-achromatopsia > h3').innerHTML
        = document.querySelector('#deficiency-achromatopsia > h3').innerHTML
            .replace('Achromatopsia', i18n['Achromatopsia'])
    document.querySelector('#deficiency-achromatopsia > div.desc').textContent = i18n['no colour']
    document.querySelector('#deficiency-achromatopsia-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-achromatomaly > h3').textContent = i18n['Achromatomaly']
    document.querySelector('#deficiency-achromatomaly > div.desc').textContent = i18n['almost no colour']
    document.querySelector('#deficiency-achromatomaly-preview').textContent = i18n['Sample']

    document.querySelector('body > main > h2:nth-child(4)').textContent = i18n['Dichromacy']
    document.querySelector('#deficiency-protanopia > h3').textContent = i18n['Protanopia']
    document.querySelector('#deficiency-protanopia > div.desc').textContent = i18n['no red']
    document.querySelector('#deficiency-protanopia-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-deuteranopia > h3').textContent = i18n['Deuteranopia']
    document.querySelector('#deficiency-deuteranopia > div.desc').textContent = i18n['no green']
    document.querySelector('#deficiency-deuteranopia-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-tritanopia > h3').textContent = i18n['Tritanopia']
    document.querySelector('#deficiency-tritanopia > div.desc').textContent = i18n['no blue']
    document.querySelector('#deficiency-tritanopia-preview').textContent = i18n['Sample']

    document.querySelector('body > main > h2:nth-child(6)').textContent = i18n['Trichromacy']
    document.querySelector('#deficiency-protanomaly > h3').textContent = i18n['Protanomaly']
    document.querySelector('#deficiency-protanomaly > div.desc').textContent = i18n['low red']
    document.querySelector('#deficiency-protanomaly-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-deuteranomaly > h3').textContent = i18n['Deuteranomaly']
    document.querySelector('#deficiency-deuteranomaly > div.desc').textContent = i18n['low green']
    document.querySelector('#deficiency-deuteranomaly-preview').textContent = i18n['Sample']

    document.querySelector('#deficiency-tritanomaly > h3').textContent = i18n['Tritanomaly']
    document.querySelector('#deficiency-tritanomaly > div.desc').textContent = i18n['low blue']
    document.querySelector('#deficiency-tritanomaly-preview').textContent = i18n['Sample']
}