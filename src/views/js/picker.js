// From https://github.com/Toinane/colorpicker
const {ipcRenderer} = require('electron')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-picker', window.devicePixelRatio), false)

document.querySelector('#picker').style.border = `10px solid rgba(200, 200, 200, 0.3)`

ipcRenderer.on('init', (event) => {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') ipcRenderer.send('closePicker')
  }, false)
})

ipcRenderer.on('updatePicker', (event, color) => {
  document.querySelector('#picker').style.border = `10px solid ${color}`
  document.querySelector('#picker .hex').innerHTML = color
})