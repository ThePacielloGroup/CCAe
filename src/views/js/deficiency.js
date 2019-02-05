const { ipcRenderer } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-deficiency'), false)

ipcRenderer.on('init', event => {
    applyForegroundColor()
    applyBackgroundColor()
    applyContrastRatio()
})

ipcRenderer.on('foregroundColorChanged', event => {
    applyForegroundColor()
})

ipcRenderer.on('backgroundColorChanged', event => {
    applyBackgroundColor()
})

ipcRenderer.on('contrastRatioChanged', event => {
    applyContrastRatio()
})

function applyForegroundColor () {
    Object.keys(sharedObject.deficiencies).forEach(function(key, index) {
        if (key !== 'normal') {
            document.getElementById('deficiency-' + key + '-preview').style.color = this[key].foregroundColor.rgb().string()
        }
    }, sharedObject.deficiencies)
}

function applyBackgroundColor () {
    Object.keys(sharedObject.deficiencies).forEach(function(key, index) {
        if (key !== 'normal') {
            document.getElementById('deficiency-' + key + '-preview').style.background = this[key].backgroundColor.rgb().string()
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
