// From https://github.com/Toinane/colorpicker
const {ipcRenderer} = require('electron')
document.querySelector('#picker').style.border = `10px solid rgba(200, 200, 200, 0.3)`

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('pickerRequested', window.devicePixelRatio), false)
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    ipcRenderer.send('closePicker')
  } else if (event.key === 'ArrowUp') {
    ipcRenderer.send('movePickerUp');
  } else if (event.key === 'ArrowRight') {
    ipcRenderer.send('movePickerRight');
  } else if (event.key === 'ArrowDown') {
    ipcRenderer.send('movePickerDown');
  } else if (event.key === 'ArrowLeft') {
    ipcRenderer.send('movePickerLeft');
  }
}, false)

ipcRenderer.on('updatePicker', (event, color) => {
  document.querySelector('#picker').style.border = `10px solid ${color}`
  document.querySelector('#picker .hex').innerHTML = color
})