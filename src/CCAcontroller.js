const {ipcMain} = require('electron')
const Color = require('./CCAcolor')

class CCAController {
    constructor(browsers, sharedObject) {
        this.browsers = browsers
        this.sharedObject = sharedObject
        this.initEvents()
    }
    
    initEvents() {
        ipcMain.on('changeRGBComponent', this.updateRGBComponent.bind(this))
        ipcMain.on('changeForeground', this.updateForegroundFromString.bind(this))
        ipcMain.on('changeBackground', this.updateBackgroundFromString.bind(this))
    }

    updateRGBComponent(event, group, component, value, synced = false) {
        if (component === 'alpha') {
            value = parseFloat(value)
            if (value > 1) value = 1
            if (value < 0) value = 0    
        } else {
            value = parseInt(value)
            if (value > 255) value = 255
            if (value < 0) value = 0    
        }

        let color 
        if (group === "foreground") {
            color = this.sharedObject.foregroundColor
        } else if (group === "background") {
            color = this.sharedObject.backgroundColor
        }

        let dist
        if (synced && component !== "alpha") {
            if (component === "red") {
                dist = value - color.red()
            } else if (component === "green") {
                dist = value - color.green()
            } else if (component === "blue") {
                dist = value - color.blue()
            }    
            let red = color.red() + dist
            if (red > 255) red = 255
            if (red < 0) red = 0  
            let green = color.green() + dist
            if (green > 255) green = 255
            if (green < 0) green = 0  
            let blue = color.blue() + dist
            if (blue > 255) blue = 255
            if (blue < 0) blue = 0  
            color = color.red(red).green(green).blue(blue)
        } else {
            if (component === "red") {
                color = color.red(value)
            } else if (component === "green") {
                color = color.green(value)
            } else if (component === "blue") {
                color = color.blue(value)
            } else if (component === "alpha") {
                color = color.alpha(value)
            }    
        }

        if (group === "foreground") {
            this.sharedObject.foregroundColor = color
            this.updateGlobalF()    
        } else if (group === "background") {
            this.sharedObject.backgroundColor = color
            this.updateGlobalB()
        }
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