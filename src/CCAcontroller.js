const {ipcMain} = require('electron')
const Color = require('./CCAcolor')

class CCAController {
    constructor(browsers, sharedObject) {
        this.browsers = browsers
        this.sharedObject = sharedObject
        this.initEvents()
    }
    
    initEvents() {
        ipcMain.on('init-app', event => {
            this.updateDeficiencyForeground()
            this.updateDeficiencyBackground()
            this.updateContrastRatio()
            this.updateAdvanced()
            this.sendEventToAll('foregroundColorChanged')        
            this.sendEventToAll('backgroundColorChanged')
        })
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
            color = this.sharedObject.normal.foregroundColor
        } else if (group === "background") {
            color = this.sharedObject.normal.backgroundColor
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
            this.sharedObject.normal.foregroundColor = color
            this.updateGlobalF()    
        } else if (group === "background") {
            this.sharedObject.normal.backgroundColor = color
            this.updateGlobalB()
        }
    }

    updateForegroundFromString(event, stringColor, format) {
        this.sharedObject.normal.foregroundColor = Color(stringColor)
        this.updateGlobalF()
    }

    updateBackgroundFromString(event, stringColor, format) {
        this.sharedObject.normal.backgroundColor = Color(stringColor)
        this.updateGlobalB()
    }

    updateGlobalF() {
        this.sharedObject.normal.foregroundColorMixed = this.sharedObject.normal.foregroundColor.mixed(this.sharedObject.normal.backgroundColor)
        this.updateDeficiencyForeground()
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')    
    }

    updateGlobalB() {
        this.sharedObject.normal.foregroundColorMixed = this.sharedObject.normal.foregroundColor.mixed(this.sharedObject.normal.backgroundColor)
        this.updateDeficiencyBackground()
        if (this.sharedObject.normal.foregroundColor.alpha() !== 1) { // Then mixed has changed
            this.updateDeficiencyForeground()
        }
        this.updateContrastRatio()
        if (this.sharedObject.normal.foregroundColor.alpha() !== 1) { // Then mixed has changed
            this.sendEventToAll('foregroundColorChanged')
        }
        this.sendEventToAll('backgroundColorChanged')
    }

    updateDeficiencyForeground() {
        this.sharedObject.protanopia.foregroundColor = this.sharedObject.normal.foregroundColorMixed.protanopia()
        this.sharedObject.deuteranopia.foregroundColor = this.sharedObject.normal.foregroundColorMixed.deuteranopia()
        this.sharedObject.tritanopia.foregroundColor = this.sharedObject.normal.foregroundColorMixed.tritanopia()
        this.sharedObject.achromatopsia.foregroundColor = this.sharedObject.normal.foregroundColorMixed.achromatopsia()
    }

    updateDeficiencyBackground() {
        this.sharedObject.protanopia.backgroundColor = this.sharedObject.normal.backgroundColor.protanopia()
        this.sharedObject.deuteranopia.backgroundColor = this.sharedObject.normal.backgroundColor.deuteranopia()
        this.sharedObject.tritanopia.backgroundColor = this.sharedObject.normal.backgroundColor.tritanopia()
        this.sharedObject.achromatopsia.backgroundColor = this.sharedObject.normal.backgroundColor.achromatopsia()   
    }

    updateContrastRatio() {
        Object.keys(this.sharedObject).forEach(function(key, index) {
            this[key].contrastRatioRaw  = this[key].foregroundColor.contrast(this[key].backgroundColor)
            this[key].contrastRatioString = this[key].contrastRatioRaw.toFixed(1) + ":1"
        }, this.sharedObject)

        let cr = this.sharedObject.normal.contrastRatioRaw
        let crr = cr.toFixed(1)
        if ((cr >= 6.95 && cr < 7) || (cr >= 4.45 && cr < 4.5) || (cr >= 2.95 && cr < 3)) {
            this.sharedObject.normal.contrastRatioString = "Just below " + crr + ":1 (" + Number(cr.toFixed(3)) + ":1)"
        } else {
            this.sharedObject.normal.contrastRatioString = crr + ":1"
        }
        this.sharedObject.normal.contrastRatioRounded = crr
        this.sharedObject.normal.levelAA = 'regular'
        this.sharedObject.normal.levelAAA = 'regular'
        if (cr < 7) {
            this.sharedObject.normal.levelAAA = 'large'
        }
        if (cr < 4.5) {
            this.sharedObject.normal.levelAA = 'large'
            this.sharedObject.normal.levelAAA = 'fail'
        }
        if (cr < 3) {
            this.sharedObject.normal.levelAA = 'fail'
        }
    }

    updateAdvanced() {
        let normal = this.sharedObject.normal
        normal.advanced = `Foreground: %F - Background: %B<br>
        <br>
        The contrast ratio is: %L<br>
        <br>
        For level AA: %AA<br>
        For level AAA: %AAA<br>
        <br>
        <strong>1.4.3 Contrast (Minimum):</strong> Text (and images of text) have a contrast ratio of at least 4.5:1, except if the text is pure decoration.  Larger scale text (at least 18 point or 14 point bold) or images of text can have a contrast ratio of 3:1. (Level AA)<br>
        <br>
        <strong>1.4.6 Contrast (Enhanced):</strong> Text (and images of text) have a contrast ratio of at least 7:1, except if the text is pure decoration.  Larger scale text (at least 18 point or 14 point bold) or images of text can have a contrast ratio of 4.5:1. (Level AAA)<br>
        <br>
        <strong>Note:</strong> Fonts that are extraordinarily thin or decorative are harder to read at lower contrast levels.`
        /*
            %F : Foreground colour
            %B : Background colour
            %L : Luminosity level
            %AA : AA result (regular, large, fail)
            %AAA: AAA result (regular, large, fail)
        */
       normal.advanced = normal.advanced.replace('%F', normal.foregroundColorMixed.hex())
       normal.advanced = normal.advanced.replace('%B', normal.backgroundColor.hex())
       normal.advanced = normal.advanced.replace('%L', normal.contrastRatioString)
       normal.advanced = normal.advanced.replace('%AA', normal.levelAA)
       normal.advanced = normal.advanced.replace('%AAA', normal.levelAAA)
    }

    sendEventToAll(event) {
        const {main} = this.browsers
        main.getWindow().webContents.send(event)
    }
}

module.exports = CCAController