// From https://github.com/Toinane/
const {ipcMain} = require('electron')
const robot = require('robotjs')

let mouseEvent

module.exports = (browsers, mainController) => {
    const {picker, main} = browsers

    let closePicker = hexColor => {
      if (picker.getWindow()) {
        mainController.sendEventToAll('pickerTogglled', global['currentPicker'], false)   
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

    let selectColor = () => {
      const currentMousePos = robot.getMousePos();
      closePicker('#' + robot.getPixelColor(currentMousePos.x, currentMousePos.y))
    }
    
    ipcMain.on('showPicker', (event, section) => {
      global['currentPicker'] = section
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

    ipcMain.on('movePickerUp', (evt) => movePicker('up'))
    ipcMain.on('movePickerRight', (evt) => movePicker('right'))
    ipcMain.on('movePickerDown', (evt) => movePicker('down'))
    ipcMain.on('movePickerLeft', (evt) => movePicker('left'))
    ipcMain.on('selectPickerColor', (evt) => selectColor())
}
