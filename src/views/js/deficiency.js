const { ipcRenderer } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-deficiency'), false)

ipcRenderer.on('init', event => {
    applyColor('foreground')
    applyColor('background')
    applyContrastRatio()
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
