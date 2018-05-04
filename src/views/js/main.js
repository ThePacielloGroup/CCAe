const { ipcRenderer } = require('electron')
const sharedObjects = require('electron').remote.getGlobal('sharedObject')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

ipcRenderer.on('init', event => {
    applyForegroundColor()
    applyBackgroundColor()
    applyContrastRatio()
    initButtons()
  })

ipcRenderer.on('foregroundColorChanged', event => {
    applyForegroundColor()
    applyContrastRatio()
})

ipcRenderer.on('backgroundColorChanged', event => {
    applyBackgroundColor()
    applyContrastRatio()
})

function initButtons () {
    // Opens color picker on button click
    document.querySelector('#foreground-color .picker').onclick = () => ipcRenderer.send('showForegroundPicker')
    document.querySelector('#background-color .picker').onclick = () => ipcRenderer.send('showBackgroundPicker')
}

function applyForegroundColor () {
    let color = sharedObjects.foregroundColor
    document.querySelector('#foreground-color').style.background = color.rgb().string()  
    document.querySelector('#foreground-color').classList.toggle('darkMode', color.isDark())
}

function applyBackgroundColor () {
    let color = sharedObjects.backgroundColor
    document.querySelector('#background-color').style.background = color.rgb().string()  
    document.querySelector('#background-color').classList.toggle('darkMode', color.isDark())
}

function applyContrastRatio () {
    let cr = sharedObjects.contrastRatio
    document.querySelector('#contrast-ratio').innerHTML = cr + ':1'
}