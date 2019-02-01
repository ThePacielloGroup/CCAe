const { ipcMain, clipboard } = require('electron')
const Color = require('./CCAcolor')
const Store = require('electron-store');
const store = new Store();

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
            this.sendEventToAll('foregroundColorChanged')        
            this.sendEventToAll('backgroundColorChanged')
        })
        ipcMain.on('changeRGBComponent', this.updateRGBComponent.bind(this))
        ipcMain.on('changeHSLComponent', this.updateHSLComponent.bind(this))
        ipcMain.on('changeForeground', this.updateForegroundFromString.bind(this))
        ipcMain.on('changeBackground', this.updateBackgroundFromString.bind(this))
        ipcMain.on('switchColors', this.switchColors.bind(this))
        ipcMain.on('changeFormat', this.changeFormat.bind(this))
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
            color = this.sharedObject.deficiencies.normal.foregroundColor
        } else if (group === "background") {
            color = this.sharedObject.deficiencies.normal.backgroundColor
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
            let red = color.red()
            if ((red + dist) > 255) {
                dist -= red + dist - 255
            }
            if ((red + dist) < 0) {
                dist -= red + dist
            }
            let green = color.green()
            if ((green + dist) > 255) {
                dist -= green + dist - 255
            }
            if ((green + dist) < 0) {
                dist -= green + dist
            }
            let blue = color.blue()
            if ((blue + dist) > 255) {
                dist -= blue + dist - 255
            }
            if ((blue + dist) < 0) {
                dist -= blue + dist
            }
            color = color.red(red+dist).green(green+dist).blue(blue+dist)
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
            this.sharedObject.deficiencies.normal.foregroundColor = color
            this.updateGlobalF()    
        } else if (group === "background") {
            this.sharedObject.deficiencies.normal.backgroundColor = color
            this.updateGlobalB()
        }
    }

    updateHSLComponent(event, group, component, value) {
        if (component === 'alpha') {
            value = parseFloat(value)
            if (value > 1) value = 1
            if (value < 0) value = 0    
        } else if (component === 'hue') {
            value = parseFloat(value)
            if (value > 360) value = 360
            if (value < 0) value = 0    
        } else {
            value = parseInt(value)
            if (value > 100) value = 100
            if (value < 0) value = 0    
        }

        let color 
        if (group === "foreground") {
            color = this.sharedObject.deficiencies.normal.foregroundColor
        } else if (group === "background") {
            color = this.sharedObject.deficiencies.normal.backgroundColor
        }

        if (component === "hue") {
            color = color.hue(value)
        } else if (component === "saturation") {
            color = color.saturationl(value)
        } else if (component === "lightness") {
            color = color.lightness(value)
        } else if (component === "alpha") {
            color = color.alpha(value)
        }

        if (group === "foreground") {
            this.sharedObject.deficiencies.normal.foregroundColor = color
            this.updateGlobalF()    
        } else if (group === "background") {
            this.sharedObject.deficiencies.normal.backgroundColor = color
            this.updateGlobalB()
        }
    }

    updateForegroundFromString(event, stringColor, format) {
        try {
            this.sharedObject.deficiencies.normal.foregroundColor = Color(stringColor)
        }
        catch(error) {
            console.error(error)
        }
        this.updateGlobalF()
    }

    updateBackgroundFromString(event, stringColor, format) {
        try {
            this.sharedObject.deficiencies.normal.backgroundColor = Color(stringColor)
        }
        catch(error) {
            console.error(error)
        }
        this.updateGlobalB()
    }

    updateGlobalF() {
        this.sharedObject.deficiencies.normal.foregroundColorMixed = this.sharedObject.deficiencies.normal.foregroundColor.mixed(this.sharedObject.deficiencies.normal.backgroundColor)
        this.updateDeficiencyForeground()
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')    
    }

    updateGlobalB() {
        this.sharedObject.deficiencies.normal.foregroundColorMixed = this.sharedObject.deficiencies.normal.foregroundColor.mixed(this.sharedObject.deficiencies.normal.backgroundColor)
        this.updateDeficiencyBackground()
        if (this.sharedObject.deficiencies.normal.foregroundColor.alpha() !== 1) { // Then mixed has changed
            this.updateDeficiencyForeground()
        }
        this.updateContrastRatio()
        if (this.sharedObject.deficiencies.normal.foregroundColor.alpha() !== 1) { // Then mixed has changed
            this.sendEventToAll('foregroundColorChanged')
        }
        this.sendEventToAll('backgroundColorChanged')
    }

    switchColors(event) {
        let background = this.sharedObject.deficiencies.normal.backgroundColor
        this.sharedObject.deficiencies.normal.backgroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed
        this.sharedObject.deficiencies.normal.foregroundColor = background
        this.sharedObject.deficiencies.normal.foregroundColorMixed = this.sharedObject.deficiencies.normal.foregroundColor.mixed(this.sharedObject.deficiencies.normal.backgroundColor)
        this.updateDeficiencyForeground()
        this.updateDeficiencyBackground()
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')    
        this.sendEventToAll('backgroundColorChanged')        
    }

    updateDeficiencyForeground() {
        this.sharedObject.deficiencies.protanopia.foregroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed.protanopia()
        this.sharedObject.deficiencies.deuteranopia.foregroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed.deuteranopia()
        this.sharedObject.deficiencies.tritanopia.foregroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed.tritanopia()
        this.sharedObject.deficiencies.protanomaly.foregroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed.protanomaly()
        this.sharedObject.deficiencies.deuteranomaly.foregroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed.deuteranomaly()
        this.sharedObject.deficiencies.tritanomaly.foregroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed.tritanomaly()
        this.sharedObject.deficiencies.achromatopsia.foregroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed.achromatopsia()
        this.sharedObject.deficiencies.achromatomaly.foregroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed.achromatomaly()
    }

    updateDeficiencyBackground() {
        this.sharedObject.deficiencies.protanopia.backgroundColor = this.sharedObject.deficiencies.normal.backgroundColor.protanopia()
        this.sharedObject.deficiencies.deuteranopia.backgroundColor = this.sharedObject.deficiencies.normal.backgroundColor.deuteranopia()
        this.sharedObject.deficiencies.tritanopia.backgroundColor = this.sharedObject.deficiencies.normal.backgroundColor.tritanopia()
        this.sharedObject.deficiencies.protanomaly.backgroundColor = this.sharedObject.deficiencies.normal.backgroundColor.protanomaly()
        this.sharedObject.deficiencies.deuteranomaly.backgroundColor = this.sharedObject.deficiencies.normal.backgroundColor.deuteranomaly()
        this.sharedObject.deficiencies.tritanomaly.backgroundColor = this.sharedObject.deficiencies.normal.backgroundColor.tritanomaly()
        this.sharedObject.deficiencies.achromatopsia.backgroundColor = this.sharedObject.deficiencies.normal.backgroundColor.achromatopsia()  
        this.sharedObject.deficiencies.achromatomaly.backgroundColor = this.sharedObject.deficiencies.normal.backgroundColor.achromatomaly()    
    }

    updateContrastRatio() {
        let cr, crr
        Object.keys(this.sharedObject.deficiencies).forEach(function(key, index) {
            if (key === 'normal') {
                this[key].contrastRatioRaw  = this[key].foregroundColorMixed.contrast(this[key].backgroundColor)
                let cr = this[key].contrastRatioRaw
                let crr = Number(cr.toFixed(1)).toString() // toString removes trailing zero
                this[key].contrastRatioString = `${crr}:1`
                if ((cr >= 6.95 && cr < 7) || (cr >= 4.45 && cr < 4.5) || (cr >= 2.95 && cr < 3)) {
                    let crr3 = Number(cr.toFixed(3)).toString()
                    this[key].contrastRatioString = `just below ${crr}:1 (${crr3}:1)`
                }
                this[key].levelAA = 'regular'
                this[key].levelAAA = 'regular'
                if (cr < 7) {
                    this[key].levelAAA = 'large'
                }
                if (cr < 4.5) {
                    this[key].levelAA = 'large'
                    this[key].levelAAA = 'fail'
                }
                if (cr < 3) {
                    this[key].levelAA = 'fail'
                }
            } else {
                this[key].contrastRatioRaw  = this[key].foregroundColor.contrast(this[key].backgroundColor)
                let cr = this[key].contrastRatioRaw
                let crr = Number(cr.toFixed(1)).toString() // toString removes trailing zero
                this[key].contrastRatioString = `${crr}:1`
            }
        }, this.sharedObject.deficiencies)
    }

    sendEventToAll(event, params) {
        const browsers = this.browsers
        Object.keys(browsers).map(function(key, index) {
            const browser = browsers[key]
            if (browser.getWindow()) {
                browser.getWindow().webContents.send(event, params)
            }
        });
    }

    copyResults() {
        let normal = this.sharedObject.deficiencies.normal
        let level_1_4_3, level_1_4_6, level_1_4_11

        if (normal.levelAA === 'large') {
            level_1_4_3 = 'Pass for large text only. Fail for regular text'
            level_1_4_11 = 'Pass for UI components and graphical objects'
        } else if (normal.levelAA === 'regular') {
            level_1_4_3 = 'Pass for large and regular text'
            level_1_4_11 = 'Pass for UI components and graphical objects'
        } else { // Fail
            level_1_4_3 = 'Fail for large and regular text'
            level_1_4_11 = 'Fail for UI components and graphical objects'
        }
        if (normal.levelAAA === 'large') {
            level_1_4_6 = 'Pass for large text only. Fail for regular text'
        } else if (normal.levelAAA === 'regular') {
            level_1_4_6 = 'Pass for large and regular text'
        } else { // Fail
            level_1_4_6 = 'Fail for large and regular text'
        }

        let text = `Foreground: ${normal.foregroundColorMixed.hex()}
Background: ${normal.backgroundColor.hex()}
The contrast ratio is: ${normal.contrastRatioString}
1.4.3 Contrast (Minimum) (AA)
    ${level_1_4_3}
1.4.6 Contrast (Enhanced) (AAA)
    ${level_1_4_6}
1.4.11 Non-text Contrast (AA)
    ${level_1_4_11}`

        clipboard.writeText(text)
    }

    changeFormat(event, section, format) {
        this.sharedObject.preferences[section].format = format
        store.set(section + '.format', format)
    }
}

module.exports = CCAController