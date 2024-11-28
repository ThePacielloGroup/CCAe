const { ipcMain, clipboard } = require('electron')
const { getColorFromPickerAddOn } = require('./picker/index.js')

const CCAColor = require('./color/CCAcolor.js')
const white = CCAColor.rgb(0, 0, 0)
const black = CCAColor.rgb(255, 255, 255)

let i18n, t

class CCAController {
    constructor(sendEventToAll, store) {
        this.store = store
        this.sendEventToAll = sendEventToAll
        this.sharedObject = {
            'general.foregroundColor': white,
            'general.backgroundColor': black,
            'general.contrastRatioRaw': 0,
            'general.levelAA': 'regular',
            'general.levelAAA': 'regular',
            'achromatopsia.foregroundColor': null,
            'achromatopsia.backgroundColor': null,
            'achromatopsia.contrastRatioRaw': 0,
            'achromatomaly.foregroundColor': null,
            'achromatomaly.backgroundColor': null,
            'achromatomaly.contrastRatioRaw': 0,
            'protanopia.foregroundColor': null,
            'protanopia.backgroundColor': null,
            'protanopia.contrastRatioRaw': 0,
            'deuteranopia.foregroundColor': null,
            'deuteranopia.backgroundColor': null,
            'deuteranopia.contrastRatioRaw': 0,
            'tritanopia.foregroundColor': null,
            'tritanopia.backgroundColor': null,
            'tritanopia.contrastRatioRaw': 0,
            'protanomaly.foregroundColor': null,
            'protanomaly.backgroundColor': null,
            'protanomaly.contrastRatioRaw': 0,
            'deuteranomaly.foregroundColor': null,
            'deuteranomaly.backgroundColor': null,
            'deuteranomaly.contrastRatioRaw': 0,
            'tritanomaly.foregroundColor': null,
            'tritanomaly.backgroundColor': null,
            'tritanomaly.contrastRatioRaw': 0
        }
        this.init()
    }

    async init() {
        const lang = await this.store.get('lang')
        const localLang = await this.store.get('localLang')
        i18n = new(require('./i18n'))(lang, localLang)
        t = i18n.asObject()

        ipcMain.on('init-app', event => {
            this.updateDeficiency('foreground')
            this.updateDeficiency('background')
            this.updateContrastRatio()
            this.updateColor('foreground')
            this.updateColor('background')
        })
        ipcMain.on('changeFromRGBComponent', this.updateRGBComponent.bind(this))
        ipcMain.on('changeFromHSLComponent', this.updateHSLComponent.bind(this))
        ipcMain.on('changeFromHSVComponent', this.updateHSVComponent.bind(this))
        ipcMain.on('changeFromString', this.updateFromString.bind(this))
        ipcMain.on('switchColors', this.switchColors.bind(this))
        ipcMain.on("darkMode",this.updateColor)
        ipcMain.on('getColorFromPicker', this.getColorFromPicker.bind(this))
        ipcMain.handle('getColorObject', (event, section) => {
            return this.getColorObject(section)
        })
        ipcMain.handle('getContrastRatioObject', (event) => {
            return this.updateContrastRatio()
        })
        ipcMain.on('colorFromPicker', this.receivedColorFromPicker.bind(this))
    }

    async getColorFromPicker(event, section) {
        this.sendEventToAll('pickerToggled', section, true)
        const pickerType = this.store.get(`picker`)
        let hexColor
        if (pickerType == 2) { // legacy add-on picker
            hexColor = await getColorFromPickerAddOn()
                .catch((error) => {
                    console.warn(`[ERROR] getColorFromPickerAddOn`, error)
                })
            this.receivedColorFromPicker(event, section, hexColor)
        } else { // Electron picker
            this.sendEventToAll('showPicker', section)
        }
    }

    receivedColorFromPicker(event, section, hexColor) {
        if (hexColor) {
            this.updateFromString(null, section, hexColor)
        }
        this.sendEventToAll('pickerToggled', section, false)
    }

    async updateLanguage() {
        const lang = await this.store.get('lang')
        const localLang = await this.store.get('localLang')
        i18n = new(require('./i18n'))(lang, localLang)
        t = i18n.asObject()
        this.updateContrastRatio()
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

        let color = this.sharedObject[`general.${section}Color`]

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
        this.sharedObject[`general.${section}Color`] = color
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

        let color = this.sharedObject[`general.${section}Color`]

        if (component === "hue") {
            color = color.hue(value)
        } else if (component === "saturationl") {
            color = color.saturationl(value)
        } else if (component === "lightness") {
            color = color.lightness(value)
        } else if (component === "alpha") {
            color = color.alpha(value)
        }

        this.sharedObject[`general.${section}Color`] = color.hsl()
        this.updateGlobal(section)    
    }

    updateHSVComponent(event, section, component, value) {
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

        let color = this.sharedObject[`general.${section}Color`]

        if (component === "hue") {
            color = color.hue(value)
        } else if (component === "saturationv") {
            color = color.saturationv(value)
        } else if (component === "value") {
            color = color.value(value)
        } else if (component === "alpha") {
            color = color.alpha(value)
        }

        this.sharedObject[`general.${section}Color`] = color.hsv()
        this.updateGlobal(section)
    }

    updateFromString(event, section, stringColor) {
        try {
            this.sharedObject[`general.${section}Color`] = CCAColor(stringColor)
        }
        catch(error) {
            console.error(error)
        }
        this.updateGlobal(section)
    }

    updateGlobal(section) {
        this.sharedObject[`general.foregroundColor`].setReal(this.sharedObject[`general.backgroundColor`])
        this.updateDeficiency(section)
        if (section == 'background' && this.sharedObject[`general.foregroundColor`].alpha() !== 1) { // Then mixed has changed
            this.updateDeficiency('foreground')
        }
        this.updateContrastRatio()
        if (section == 'background' && this.sharedObject[`general.foregroundColor`].alpha() !== 1) { // Then mixed has changed
            this.updateColor('foreground')
        }
        this.updateColor(section)
    }

    switchColors(event) {
        let background = this.sharedObject[`general.backgroundColor`]
        this.sharedObject[`general.backgroundColor`] = this.sharedObject[`general.foregroundColor`].getReal()
        this.sharedObject[`general.foregroundColor`] = background
        this.updateDeficiency("foreground")
        this.updateDeficiency("background")
        this.updateContrastRatio()
        this.updateColor('foreground')
        this.updateColor('background')
    }

    updateDeficiency(section) {
        this.sharedObject[`protanopia.${section}Color`] = this.sharedObject[`general.${section}Color`].protanopia()
        this.sharedObject[`deuteranopia.${section}Color`] = this.sharedObject[`general.${section}Color`].deuteranopia()
        this.sharedObject[`tritanopia.${section}Color`] = this.sharedObject[`general.${section}Color`].tritanopia()
        this.sharedObject[`protanomaly.${section}Color`] = this.sharedObject[`general.${section}Color`].protanomaly()
        this.sharedObject[`deuteranomaly.${section}Color`] = this.sharedObject[`general.${section}Color`].deuteranomaly()
        this.sharedObject[`tritanomaly.${section}Color`] = this.sharedObject[`general.${section}Color`].tritanomaly()
        this.sharedObject[`achromatopsia.${section}Color`] = this.sharedObject[`general.${section}Color`].achromatopsia()
        this.sharedObject[`achromatomaly.${section}Color`] = this.sharedObject[`general.${section}Color`].achromatomaly()
    }

    async getColorObject(section) {
        const color = this.sharedObject[`general.${section}Color`]
        const format = this.store.get(`${section}.format`) // to remove from loop

        const object = {
            string: color.getColorTextString(format),
            format,
            rgb: color.getReal().rgb().string(),
            name: color.getReal().keyword(),
            isDark: color.getReal().isDark(),
            red: Math.round(color.red()),
            green: Math.round(color.green()),
            blue: Math.round(color.blue()),
            alpha: color.alpha(),
            hue: Math.round(color.hue()),
            saturationl: Math.round(color.saturationl()),
            lightness: Math.round(color.lightness()),
            hue: Math.round(color.hue()),
            saturationv: Math.round(color.saturationv()),
            value: Math.round(color.value()),
        }

        const def = ['achromatopsia', 'achromatomaly', 'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly', 'tritanopia', 'tritanomaly']
        def.forEach(key => {
            object[key] = this.sharedObject[`${key}.${section}Color`].rgb().string()
        })
        return object
    }

    async updateColor(section) {
        const object = await this.getColorObject(section)
        this.sendEventToAll('colorChanged', section, object)
    }

    async getContrastRatioObject() {
        const rounding = this.store.get('rounding') // TO REMOVE FROM THE UPDATE LOOP

        this.sharedObject['general.contrastRatioRaw']  = this.sharedObject['general.foregroundColor'].getReal().contrast(this.sharedObject['general.backgroundColor'])
        this.sharedObject['general.contrastRatioRaw'] = Number(this.sharedObject['general.contrastRatioRaw'].toFixed(3))
        const cr = this.sharedObject['general.contrastRatioRaw']
        const crr = Number(cr.toFixed(rounding))

        this.sharedObject['general.levelAA'] = 'regular'
        this.sharedObject['general.levelAAA'] = 'regular'
        if (cr < 7) {
            this.sharedObject['general.levelAAA'] = 'large'
        }
        if (cr < 4.5) {
            this.sharedObject['general.levelAA'] = 'large'
            this.sharedObject['general.levelAAA'] = 'fail'
        }
        if (cr < 3) {
            this.sharedObject['general.levelAA'] = 'fail'
        }

        const object = {
            levelAA: this.sharedObject['general.levelAA'],
            levelAAA: this.sharedObject['general.levelAAA'],
            raw: cr,
            rounded: crr,
            rounding: rounding,
        }
        const def = ['achromatopsia', 'achromatomaly', 'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly', 'tritanopia', 'tritanomaly']
        def.forEach(key => {
            const cr = this.sharedObject[`${key}.foregroundColor`].contrast(this.sharedObject[`${key}.backgroundColor`])
            this.sharedObject[`${key}.contrastRatioRaw`] = Number(cr.toFixed(3))
            const crr = Number(cr.toFixed(rounding))
            object[key] = crr
        })
        return object
    }

    async updateContrastRatio() {
        const object = await this.getContrastRatioObject()
        this.sendEventToAll('contrastRatioChanged', object)
    }

    async copyResults(template) {
        let level_1_4_3, level_1_4_6, level_1_4_11
        const levelAA = this.sharedObject['general.levelAA']
        const levelAAA = this.sharedObject['general.levelAAA']
        if (levelAA === 'large') {
            level_1_4_3 = t.CopyPaste["level_1_4_3_pass_large"]
            level_1_4_11 = t.CopyPaste["level_1_4_11_pass"]
        } else if (levelAA === 'regular') {
            level_1_4_3 = t.CopyPaste["level_1_4_3_pass_regular"]
            level_1_4_11 = t.CopyPaste["level_1_4_11_pass"]
        } else { // Fail
            level_1_4_3 = t.CopyPaste["level_1_4_3_fail"]
            level_1_4_11 = t.CopyPaste["level_1_4_11_fail"]
        }
        if (levelAAA === 'large') {
            level_1_4_6 = t.CopyPaste["level_1_4_6_pass_large"]
        } else if (levelAAA === 'regular') {
            level_1_4_6 = t.CopyPaste["level_1_4_6_pass_regular"]
        } else { // Fail
            level_1_4_6 = t.CopyPaste["level_1_4_6_fail"]
        }

        const foregroundColor = this.sharedObject[`general.foregroundColor`]
        const foregroundFormat = this.store.get(`foreground.format`)
        const foregroundColorString = foregroundColor.getColorTextString(foregroundFormat)

        const backgroundColor = this.sharedObject[`general.backgroundColor`]
        const backgroundFormat = this.store.get(`background.format`)
        const backgroundColorString = backgroundColor.getColorTextString(backgroundFormat)

        const rounding = this.store.get('rounding')
        const cr = this.sharedObject['general.contrastRatioRaw']
        const crr = Number(cr.toFixed(rounding)).toLocaleString(i18n.lang)
        // toLocalString removes trailing zero and use the correct decimal separator, based on the app select lang.

        let text = template;
        for (const item of [
            ['%f.hex%', foregroundColorString],
            ['%b.hex%', backgroundColorString],
            ['%cr%', cr],
            ['%crr%', crr],
            ['%1.4.3%', level_1_4_3],
            ['%1.4.6%', level_1_4_6],
            ['%1.4.11%', level_1_4_11],
            ['%i18n.f%', t.CopyPaste["Foreground"]],
            ['%i18n.b%', t.CopyPaste["Background"]],
            ['%i18n.cr%', t.Main["Contrast ratio"]],
            ['%i18n.1.4.3%', t.Main["1.4.3 Contrast (Minimum) (AA)"]],
            ['%i18n.1.4.6%', t.Main["1.4.6 Contrast (Enhanced) (AAA)"]],
            ['%i18n.1.4.11%', t.Main["1.4.11 Non-text Contrast (AA)"]],
        ]) {
            text = text.replaceAll(item[0], item[1])
        }

        clipboard.writeText(text)
    }

    async copyRegularResults() {
        const template = await this.store.get('copy.regularTemplate')
        this.copyResults(template)
    }

    async copyShortResults() {
        const template = await this.store.get('copy.shortTemplate')
        this.copyResults(template)
    }
}

module.exports = CCAController
