// From https://github.com/Toinane/
const {ipcMain} = require('electron')
const robot = require('robotjs')

let mouseEvent;

module.exports = (browsers, sharedObjects) => {
    const {picker, main} = browsers
    let foregroundPicker // Keep which picker is openned

    let closePicker = newColor => {
        if (picker.getWindow()) {
          picker.getWindow().close()
          if (foregroundPicker === true) {
            sharedObjects.foregroundColor.setColorFromHex(newColor)
            main.getWindow().webContents.send('foregroundColorChanged')
          } else {
            sharedObjects.backgroundColor.setColorFromHex(newColor)
            main.getWindow().webContents.send('backgroundColorChanged')            
          }
          main.getWindow().focus()
          ipcMain.removeListener('closePicker', closePicker)
          ipcMain.removeListener('pickerRequested', event => {})
          foregroundPicker = null
        }
    }

    ipcMain.on('showForegroundPicker', event => {
      foregroundPicker = true
      picker.init()
    })
    ipcMain.on('showBackgroundPicker', event => { 
      foregroundPicker = false
      picker.init()
    })

    ipcMain.on('pickerRequested', event => {
        if (process.platform === 'darwin') mouseEvent = require('osx-mouse')()
        // if (process.platform === 'linux') mouseEvent = require('linux-mouse')()
        if (process.platform === 'win32') mouseEvent = require('win-mouse')()
    
        picker.getWindow().on('close', () => mouseEvent.destroy())
    
        mouseEvent.on('move', (x, y) => {
          let color = '#' + robot.getPixelColor(parseInt(x), parseInt(y))
          picker.getWindow().setPosition(parseInt(x) - 50, parseInt(y) - 50)
          picker.getWindow().webContents.send('updatePicker', color)
        })
    
        mouseEvent.on('left-up', (x, y) => {
          closePicker('#' + robot.getPixelColor(parseInt(x), parseInt(y)))
        })
    
        let pos = robot.getMousePos()
        picker.getWindow().setPosition(parseInt(pos.x) - 50, parseInt(pos.y) - 50)
        picker.getWindow().webContents.send('updatePicker', robot.getPixelColor(pos.x, pos.y))
    
        ipcMain.on('closePicker', closePicker)
        mouseEvent.on('right-up', closePicker)
      })
}
