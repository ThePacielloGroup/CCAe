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
        ipcMain.on('changeForegroundAlpha', this.updateForegroundAlpha.bind(this))
        ipcMain.on('changeBackgroundRed', this.updateBackgroundRed.bind(this))
        ipcMain.on('changeBackgroundGreen', this.updateBackgroundGreen.bind(this))
        ipcMain.on('changeBackgroundBlue', this.updateBackgroundBlue.bind(this))
        ipcMain.on('changeForeground', this.updateForegroundFromString.bind(this))
        ipcMain.on('changeBackground', this.updateBackgroundFromString.bind(this))
    }

    updateForegroundRed(event, red) {
        red = parseInt(red)
        if (red > 255) red = 255
        if (red < 0) red = 0
        this.sharedObject.foregroundColor = this.sharedObject.foregroundColor.red(red)
        this.updateGlobalF()    
    }

    updateForegroundGreen(event, green) {
        green = parseInt(green)
        if (green > 255) green = 255
        if (green < 0) green = 0
        this.sharedObject.foregroundColor = this.sharedObject.foregroundColor.green(green)
        this.updateGlobalF()    
    }

    updateForegroundBlue(event, blue) {
        blue = parseInt(blue)
        if (blue > 255) blue = 255
        if (blue < 0) blue = 0
        this.sharedObject.foregroundColor = this.sharedObject.foregroundColor.blue(blue)
        this.updateGlobalF()    
    }

    updateForegroundAlpha(event, alpha) {
        alpha = parseFloat(alpha)
        if (alpha > 1) alpha = 1
        if (alpha < 0) alpha = 0
        this.sharedObject.foregroundColor = this.sharedObject.foregroundColor.alpha(alpha)
        this.updateGlobalF()    
    }

    updateBackgroundRed(event, red) {
        red = parseInt(red)
        if (red > 255) red = 255
        if (red < 0) red = 0
        this.sharedObject.backgroundColor = this.sharedObject.backgroundColor.red(red)
        this.updateGlobalB()        
    }

    updateBackgroundGreen(event, green) {
        green = parseInt(green)
        if (green > 255) green = 255
        if (green < 0) green = 0
        this.sharedObject.backgroundColor = this.sharedObject.backgroundColor.green(green)
        this.updateGlobalB()        
    }

    updateBackgroundBlue(event, blue) {
        blue = parseInt(blue)
        if (blue > 255) blue = 255
        if (blue < 0) blue = 0
        this.sharedObject.backgroundColor = this.sharedObject.backgroundColor.blue(blue)
        this.updateGlobalB()        
    }

    updateForegroundFromString(event, stringColor, format) {
        this.sharedObject.foregroundColor = Color(stringColor)
        this.updateGlobalF()
    }

    updateBackgroundFromString(event, stringColor, format) {
        this.sharedObject.backgroundColor = Color(stringColor)
        this.updateGlobalB()
    }

    updateGlobalF() {
        this.sharedObject.foregroundColorMixed = this.sharedObject.foregroundColor.mixed(this.sharedObject.backgroundColor)
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')    
    }

    updateGlobalB() {
        this.sharedObject.foregroundColorMixed = this.sharedObject.foregroundColor.mixed(this.sharedObject.backgroundColor)
        this.updateContrastRatio()
        this.sendEventToAll('backgroundColorChanged')
        if (this.sharedObject.foregroundColor.alpha() !== 1) { // Then mixed has changed
            this.sendEventToAll('foregroundColorChanged')
        }
    }

    updateContrastRatio() {
        let cr = this.sharedObject.foregroundColorMixed.contrast(this.sharedObject.backgroundColor)
        let crr = cr.toFixed(1)
        if ((cr >= 6.95 && cr < 7) || (cr >= 4.45 && cr < 4.5) || (cr >= 2.95 && cr < 3)) {
            this.sharedObject.contrastRatioString = "Just below " + crr + ":1 (" + Number(cr.toFixed(3)) + ":1)"
        } else {
            this.sharedObject.contrastRatioString = crr + ":1"
        }
        this.sharedObject.contrastRatioRounded = crr
        this.sharedObject.levelAA = 'regular'
        this.sharedObject.levelAAA = 'regular'
        if (cr < 7) {
            this.sharedObject.levelAAA = 'large'
        }
        if (cr < 4.5) {
            this.sharedObject.levelAA = 'large'
            this.sharedObject.levelAAA = 'fail'
        }
        if (cr < 3) {
            this.sharedObject.levelAA = 'fail'
        }
    }

    sendEventToAll(event) {
        const {main} = this.browsers
        main.getWindow().webContents.send(event)
    }
}

module.exports = CCAController