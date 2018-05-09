const {ipcMain} = require('electron')
const Color = require('./CCAcolor')

class CCAController {
    constructor(browsers, sharedObject) {
        this.browsers = browsers
        this.sharedObject = sharedObject
        this.initEvents()
    }
    
    initEvents() {
        ipcMain.on('changeForegroundRed', this.updateForegroundRed.bind(this))
        ipcMain.on('changeForegroundGreen', this.updateForegroundGreen.bind(this))
        ipcMain.on('changeForegroundBlue', this.updateForegroundBlue.bind(this))
        ipcMain.on('changeBackgroundRed', this.updateBackgroundRed.bind(this))
        ipcMain.on('changeBackgroundGreen', this.updateBackgroundGreen.bind(this))
        ipcMain.on('changeBackgroundBlue', this.updateBackgroundBlue.bind(this))
    }

    updateForegroundRed(event, red) {
        red = parseInt(red)
        if (red > 255) red = 255
        if (red < 0) red = 0
        let oldColor = this.sharedObject.foregroundColor
        this.sharedObject.foregroundColor = Color.rgb(red, oldColor.green(), oldColor.blue())
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')        
    }

    updateForegroundGreen(event, green) {
        green = parseInt(green)
        if (green > 255) green = 255
        if (green < 0) green = 0
        let oldColor = this.sharedObject.foregroundColor
        this.sharedObject.foregroundColor = Color.rgb(oldColor.red(), green, oldColor.blue())
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')        
    }

    updateForegroundBlue(event, blue) {
        blue = parseInt(blue)
        if (blue > 255) blue = 255
        if (blue < 0) blue = 0
        let oldColor = this.sharedObject.foregroundColor
        this.sharedObject.foregroundColor = Color.rgb(oldColor.red(), oldColor.green(), blue)
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')        
    }

    updateBackgroundRed(event, red) {
        red = parseInt(red)
        if (red > 255) red = 255
        if (red < 0) red = 0
        let oldColor = this.sharedObject.backgroundColor
        this.sharedObject.backgroundColor = Color.rgb(red, oldColor.green(), oldColor.blue())
        this.updateContrastRatio()
        this.sendEventToAll('backgroundColorChanged')        
    }

    updateBackgroundGreen(event, green) {
        green = parseInt(green)
        if (green > 255) green = 255
        if (green < 0) green = 0
        let oldColor = this.sharedObject.backgroundColor
        this.sharedObject.backgroundColor = Color.rgb(oldColor.red(), green, oldColor.blue())
        this.updateContrastRatio()
        this.sendEventToAll('backgroundColorChanged')        
    }

    updateBackgroundBlue(event, blue) {
        blue = parseInt(blue)
        if (blue > 255) blue = 255
        if (blue < 0) blue = 0
        let oldColor = this.sharedObject.backgroundColor
        this.sharedObject.backgroundColor = Color.rgb(oldColor.red(), oldColor.green(), blue)
        this.updateContrastRatio()
        this.sendEventToAll('backgroundColorChanged')        
    }

    updateForegroundFromHex(hexColor) {
        this.sharedObject.foregroundColor = Color(hexColor)
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')
    }

    updateBackgroundFromHex(hexColor) {
        this.sharedObject.backgroundColor = Color(hexColor)
        this.updateContrastRatio()
        this.sendEventToAll('backgroundColorChanged')
    }

    updateContrastRatio() {
        this.sharedObject.contrastRatio = this.sharedObject.foregroundColor.contrast(this.sharedObject.backgroundColor)
        this.sharedObject.contrastRatioRounded = Number(this.sharedObject.contrastRatio.toFixed(1))
    }

    sendEventToAll(event) {
        const {main} = this.browsers
        main.getWindow().webContents.send(event)
    }
}

module.exports = CCAController