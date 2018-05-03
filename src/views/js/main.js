const { ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

const Color = require('./color.js')

let foregroundColor

ipcRenderer.on('init', event => {
    foregroundColor = new Color(0, 0, 0) // Black
    applyColor()
    initButtons()
  })

ipcRenderer.on('changeColor', (event, color) => {
    foregroundColor.setColorFromHex(color)
    applyColor()
})

function initButtons () {
    // Opens color picker on button click
    document.querySelector('#foreground-color .picker').onclick = () => ipcRenderer.send('showPicker')
}

function applyColor () {
    document.querySelector('#foreground-color').style.background = foregroundColor.getCSSFromRGB(foregroundColor.rgb)    
    document.querySelector('#foreground-color').classList.toggle('darkMode', foregroundColor.isDark())
}