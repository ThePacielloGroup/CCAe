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
        ipcMain.on('switchColors', this.switchColors.bind(this))
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
            this.sharedObject.deficiencies.normal.foregroundColor = color
            this.updateGlobalF()    
        } else if (group === "background") {
            this.sharedObject.deficiencies.normal.backgroundColor = color
            this.updateGlobalB()
        }
    }

    updateForegroundFromString(event, stringColor, format) {
        this.sharedObject.deficiencies.normal.foregroundColor = Color(stringColor)
        this.updateGlobalF()
    }

    updateBackgroundFromString(event, stringColor, format) {
        this.sharedObject.deficiencies.normal.backgroundColor = Color(stringColor)
        this.updateGlobalB()
    }

    updateGlobalF() {
        this.sharedObject.deficiencies.normal.foregroundColorMixed = this.sharedObject.deficiencies.normal.foregroundColor.mixed(this.sharedObject.deficiencies.normal.backgroundColor)
        this.updateDeficiencyForeground()
        this.updateContrastRatio()
        this.updateAdvanced()
        this.sendEventToAll('foregroundColorChanged')    
    }

    updateGlobalB() {
        this.sharedObject.deficiencies.normal.foregroundColorMixed = this.sharedObject.deficiencies.normal.foregroundColor.mixed(this.sharedObject.deficiencies.normal.backgroundColor)
        this.updateDeficiencyBackground()
        if (this.sharedObject.deficiencies.normal.foregroundColor.alpha() !== 1) { // Then mixed has changed
            this.updateDeficiencyForeground()
        }
        this.updateContrastRatio()
        this.updateAdvanced()
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
        this.updateAdvanced()
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
                    this[key].contrastRatioString = `Just below ${crr}:1 (${crr3}:1)`
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

    updateAdvanced() {
        let normal = this.sharedObject.deficiencies.normal
        if (this.sharedObject.options.displayLevelAAA) {
            this.sharedObject.advanced = `Foreground: %F - Background: %B<br>
            <br>
            <br>
            %AA<br>
            %AAA<br>`    
        } else {
            this.sharedObject.advanced = `Foreground: %F - Background: %B<br>
            <br>
            <br>
            %AA<br>`    
        }

        /*
            %F : Foreground colour
            %B : Background colour
            %L : Luminosity level
            %AA : AA result (regular, large, fail)
            %AAA: AAA result (regular, large, fail)
        */
        this.sharedObject.advanced = this.sharedObject.advanced.replace('%F', normal.foregroundColorMixed.hex())
        this.sharedObject.advanced = this.sharedObject.advanced.replace('%B', normal.backgroundColor.hex())
        this.sharedObject.advanced = this.sharedObject.advanced.replace('%L', normal.contrastRatioString)

        let levelAA = ''
        if (normal.levelAA === 'large') {
            levelAA = `Regular text failed at Level AA<br>Large text passed at Level AA`
        } else if (normal.levelAA === 'regular') {
            levelAA = `Regular text passed at Level AA<br>Large text passed at Level AA`
        } else { // Fail
            levelAA = 'Regular and Large text failed at Level AA'
        }
        this.sharedObject.advanced = this.sharedObject.advanced.replace('%AA', levelAA)

        if (this.sharedObject.options.displayLevelAAA) {
            let levelAAA = ''
            if (normal.levelAAA === 'large') {
                levelAAA = `Regular text failed at Level AAA<br>Large text passed at Level AAA`
            } else if (normal.levelAAA === 'regular') {
                levelAAA = `Regular text passed at Level AAA<br>Large text passed at Level AAA`
            } else { // Fail
                levelAAA = 'Regular and Large text failed at Level AAA'
            }
            this.sharedObject.advanced = this.sharedObject.advanced.replace('%AAA', levelAAA)
        }
    }

    optionDisplayLevelAAA(value) {
        this.sharedObject.options.displayLevelAAA = value
        this.updateAdvanced()
        this.sendEventToAll('optionDisplayLevelAAAChanged')
    }

    sendEventToAll(event, params) {
        const {main} = this.browsers
        main.getWindow().webContents.send(event, params)
    }
}

module.exports = CCAController