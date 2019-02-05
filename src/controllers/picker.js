// From https://github.com/Toinane/
const {ipcMain} = require('electron')
const robot = require('robotjs')

let mouseEvent;

module.exports = (browsers, mainController) => {
    const {picker, main} = browsers

    let closePicker = hexColor => {
      if (picker.getWindow()) {
        mainController.sendEventToAll('pickerToggelled', global['currentPicker'], false)   
        picker.getWindow().close()
        if (typeof hexColor === 'string') { // If ESC wasn't used
            mainController.updateFromString(null, global['currentPicker'], hexColor)
        }
        main.getWindow().focus()
        ipcMain.removeListener('closePicker', closePicker)
        ipcMain.removeListener('pickerRequested', event => {})
        global['currentPicker'] = null
      }
    }

    ipcMain.on('showPicker', (event, section) => {
      global['currentPicker'] = section
      mainController.sendEventToAll('pickerToggelled', global['currentPicker'], true)   
      picker.init()
    })
  
    ipcMain.on('init-picker', (event, ratio) => {
      mainController.sendEventToAll('pickerToggelled', global['currentPicker'], true)   
        if (process.platform === 'darwin') mouseEvent = require('osx-mouse')()
        // if (process.platform === 'linux') mouseEvent = require('linux-mouse')()
        if (process.platform === 'win32') mouseEvent = require('win-mouse')()
    
        picker.getWindow().on('close', () => mouseEvent.destroy())
    
        mouseEvent.on('move', (x, y) => {
          let posx, posy
          if (process.platform === 'win32' && ratio > 1) {
            posx = x / ratio
            posy = y / ratio
          } else {
            posx = x
            posy = y
          }
          let color = '#' + robot.getPixelColor(parseInt(x), parseInt(y))
          picker.getWindow().setPosition(parseInt(posx) - 100, parseInt(posy) - 50)
          picker.getWindow().webContents.send('updatePicker', color)
        })
    
        mouseEvent.on('left-up', (x, y) => {
          closePicker('#' + robot.getPixelColor(parseInt(x), parseInt(y)))
        })
    
        let pos = robot.getMousePos()
        let posx, posy
        if (process.platform === 'win32' && ratio > 1) {
          posx = pos.x / ratio
          posy = pos.y / ratio
        } else {
          posx = pos.x
          posy = pos.y
        }
        picker.getWindow().setPosition(parseInt(posx) - 100, parseInt(posy) - 50)
        picker.getWindow().webContents.send('updatePicker', robot.getPixelColor(pos.x, pos.y))
    
        ipcMain.on('closePicker', closePicker)
        mouseEvent.on('right-up', closePicker)
        event.sender.send('init')
      })
}
