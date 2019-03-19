// From https://github.com/Toinane/
const {ipcMain} = require('electron')
const robot = require('robotjs')

let mouseEvent
if (process.platform === 'darwin') mouseEvent = require('osx-mouse')()
// if (process.platform === 'linux') mouseEvent = require('linux-mouse')()
if (process.platform === 'win32') mouseEvent = require('win-mouse')()

module.exports = (browsers, mainController) => {
    const {picker, main} = browsers
    let foregroundPicker // Keep which picker is openned

    let closePicker = hexColor => {
      if (picker.getWindow()) {
        picker.getWindow().close()
        if (foregroundPicker === true) {
          mainController.sendEventToAll('foregroundPickerToggelled', false)   
        } else {
          mainController.sendEventToAll('backgroundPickerToggelled', false)   
        }
        if (typeof hexColor === 'string') { // If ESC wasn't used
          if (foregroundPicker === true) {
            mainController.updateForegroundFromString(null, hexColor)
          } else {
            mainController.updateBackgroundFromString(null, hexColor)
          }
        }
        main.getWindow().focus()
        ipcMain.removeListener('closePicker', closePicker)
        ipcMain.removeListener('pickerRequested', event => {})
        foregroundPicker = null
      }
    }

    let movePicker = direction => {
      if (picker.getWindow()) {
        const currentPosition = robot.getMousePos()
        const screenSize = robot.getScreenSize()
        let newPositionX = currentPosition.x
        let newPositionY = currentPosition.y

        if (direction === 'up' && currentPosition.y > 0) {
          newPositionY -= 1
        } else if (direction === 'right' && currentPosition.x < screenSize.width) {
          newPositionX += 1
        } else if (direction === 'down' && currentPosition.y < screenSize.height) {
          newPositionY += 1
        } else if (direction === 'left' && currentPosition.x > 0) {
          newPositionX -= 1
        }

        robot.moveMouse(newPositionX, newPositionY)
        mouseEvent.emit('move', newPositionX, newPositionY)
      }
    }

    ipcMain.on('showForegroundPicker', event => {
      foregroundPicker = true
      picker.init()
      mainController.sendEventToAll('foregroundPickerToggelled', true)   
    })
    ipcMain.on('showBackgroundPicker', event => { 
      foregroundPicker = false
      picker.init()
      mainController.sendEventToAll('backgroundPickerToggelled', true)   
    })

    ipcMain.on('pickerRequested', (event, ratio) => {    
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
      })

    ipcMain.on('movePickerUp', (evt) => movePicker('up'))
    ipcMain.on('movePickerRight', (evt) => movePicker('right'))
    ipcMain.on('movePickerDown', (evt) => movePicker('down'))
    ipcMain.on('movePickerLeft', (evt) => movePicker('left'))
}
