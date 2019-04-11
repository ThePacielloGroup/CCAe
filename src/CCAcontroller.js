const { ipcMain, clipboard, globalShortcut } = require('electron')
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
            this.updateDeficiency('foreground')
            this.updateDeficiency('background')
            this.updateContrastRatio()
            this.sendEventToAll('colorChanged', 'foreground')        
            this.sendEventToAll('colorChanged', 'background')
        })
        ipcMain.on('changeFromRGBComponent', this.updateRGBComponent.bind(this))
        ipcMain.on('changeFromHSLComponent', this.updateHSLComponent.bind(this))
        ipcMain.on('changeFromString', this.updateFromString.bind(this))
        ipcMain.on('switchColors', this.switchColors.bind(this))
        ipcMain.on('setPreference', this.setPreference.bind(this))
    }

    updateRGBComponent(event, section, component, value, synced = false) {
        if (component === 'alpha') {
            value = parseFloat(value)
            if (value > 1) value = 1
            if (value < 0) value = 0    
        } else {
            value = parseInt(value)
            if (value > 255) value = 255
            if (value < 0) value = 0    
        }

        let color = this.sharedObject.deficiencies.normal[section + 'Color']

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

        this.sharedObject.deficiencies.normal[section + 'Color'] = color
        this.updateGlobal(section)
    }

    updateHSLComponent(event, section, component, value) {
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

        let color = this.sharedObject.deficiencies.normal[section + 'Color']

        if (component === "hue") {
            color = color.hue(value)
        } else if (component === "saturation") {
            color = color.saturationl(value)
        } else if (component === "lightness") {
            color = color.lightness(value)
        } else if (component === "alpha") {
            color = color.alpha(value)
        }

        this.sharedObject.deficiencies.normal[section + 'Color'] = color
        this.updateGlobal(section)    
    }

    updateFromString(event, section, stringColor) {
        try {
            this.sharedObject.deficiencies.normal[section + "Color"] = Color(stringColor)
        }
        catch(error) {
            console.error(error)
        }
        this.updateGlobal(section)
    }

    updateGlobal(section) {
        this.sharedObject.deficiencies.normal.foregroundColorMixed = this.sharedObject.deficiencies.normal.foregroundColor.mixed(this.sharedObject.deficiencies.normal.backgroundColor)
        this.updateDeficiency(section)
        if (section == 'background' && this.sharedObject.deficiencies.normal.foregroundColor.alpha() !== 1) { // Then mixed has changed
            this.updateDeficiency('foreground')
        }
        this.updateContrastRatio()
        if (section == 'background' && this.sharedObject.deficiencies.normal.foregroundColor.alpha() !== 1) { // Then mixed has changed
            this.sendEventToAll('colorChanged', 'foreground')
        }
        this.sendEventToAll('colorChanged', section)    
    }

    switchColors(event) {
        let background = this.sharedObject.deficiencies.normal.backgroundColor
        this.sharedObject.deficiencies.normal.backgroundColor = this.sharedObject.deficiencies.normal.foregroundColorMixed
        this.sharedObject.deficiencies.normal.foregroundColor = background
        this.sharedObject.deficiencies.normal.foregroundColorMixed = this.sharedObject.deficiencies.normal.foregroundColor.mixed(this.sharedObject.deficiencies.normal.backgroundColor)
        this.updateDeficiencyForeground()
        this.updateDeficiencyBackground()
        this.updateContrastRatio()
        this.sendEventToAll('colorChanged', 'foreground')    
        this.sendEventToAll('colorChanged', 'background')        
    }

    updateDeficiency(section) {
        let fromColor = (section == 'foreground')?'foregroundColorMixed':'backgroundColor' 
        this.sharedObject.deficiencies.protanopia[section + "Color"] = this.sharedObject.deficiencies.normal[fromColor].protanopia()
        this.sharedObject.deficiencies.deuteranopia[section + "Color"] = this.sharedObject.deficiencies.normal[fromColor].deuteranopia()
        this.sharedObject.deficiencies.tritanopia[section + "Color"] = this.sharedObject.deficiencies.normal[fromColor].tritanopia()
        this.sharedObject.deficiencies.protanomaly[section + "Color"] = this.sharedObject.deficiencies.normal[fromColor].protanomaly()
        this.sharedObject.deficiencies.deuteranomaly[section + "Color"] = this.sharedObject.deficiencies.normal[fromColor].deuteranomaly()
        this.sharedObject.deficiencies.tritanomaly[section + "Color"] = this.sharedObject.deficiencies.normal[fromColor].tritanomaly()
        this.sharedObject.deficiencies.achromatopsia[section + "Color"] = this.sharedObject.deficiencies.normal[fromColor].achromatopsia()
        this.sharedObject.deficiencies.achromatomaly[section + "Color"] = this.sharedObject.deficiencies.normal[fromColor].achromatomaly()
    }

    updateContrastRatio() {
        let rounding = this.sharedObject.preferences.main.rounding
        Object.keys(this.sharedObject.deficiencies).forEach(function(key, index) {
            if (key === 'normal') {
                this[key].contrastRatioRaw  = this[key].foregroundColorMixed.contrast(this[key].backgroundColor)
                let cr = this[key].contrastRatioRaw
                let crr = Number(cr.toFixed(rounding)).toString() // toString removes trailing zero
                this[key].contrastRatioString = `${crr}:1`
                if ((cr >= 6.95 && cr < 7) || (cr >= 4.45 && cr < 4.5) || (cr >= 2.95 && cr < 3)) {
                    let crr3 = Number(cr.toFixed(3)).toString()
                    this[key].contrastRatioString = `<span class="smaller">just below </span>${crr}:1<span class="smaller"> (${crr3}:1)</span>`
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
                let crr = Number(cr.toFixed(rounding)).toString() // toString removes trailing zero
                this[key].contrastRatioString = `${crr}:1`
            }
        }, this.sharedObject.deficiencies)
        this.sendEventToAll('contrastRatioChanged')
    }

    sendEventToAll(event, ...params) {
        const browsers = this.browsers
        Object.keys(browsers).map(function(key, index) {
            const browser = browsers[key]
            if (browser.getWindow()) {
                browser.getWindow().webContents.send(event, ...params)
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

        // sanitize output (if there's HTML, e.g. in "just below" case)
        text = text.replace(/<[^>]*>?/g, '')

        clipboard.writeText(text)
    }

    setPreference(event, value, section, level, sublevel) {
        var option, oldValue
        if (sublevel) {
            oldValue = this.sharedObject.preferences[section][level][sublevel]
            this.sharedObject.preferences[section][level][sublevel] = value
            option = section + '.' + level + '.' + sublevel
        } else {
            oldValue = this.sharedObject.preferences[section][level]
            this.sharedObject.preferences[section][level] = value
            option = section + '.' + level   
        }
        store.set(option, value)    
        switch(option) {
            case 'main.rounding':
                this.updateContrastRatio()
            break;
            case 'foreground.picker.shortcut':
                this.updateShortcut(option, oldValue, value)
            break;
            case 'background.picker.shortcut':
                this.updateShortcut(option, oldValue, value)
            break;
        }
    }

    updateShortcut(shortcut, oldValue, newValue) {
        const browsers = this.browsers
        if (oldValue) {
            globalShortcut.unregister(oldValue)
        }

        switch(shortcut) {
            case 'foreground.picker.shortcut':
                globalShortcut.register(newValue, () => {
                    global['currentPicker'] = 'foreground'
                    browsers['picker'].init()
                })
                break;
            case 'background.picker.shortcut':
                globalShortcut.register(newValue, () => {
                    global['currentPicker'] = 'background'
                    browsers['picker'].init()
                })
                break;
        }
    }
}

module.exports = CCAController