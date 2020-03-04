const { ipcRenderer } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')
const Color = require('../../CCAcolor')
let i18n = ''

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

ipcRenderer.on('init', (event, config) => {
    i18n = JSON.parse(config.i18n).Main
    translateHTML()

    applyColor('foreground')
    applyColor('background')
    applyContrastRatio()
    var mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight)

    // init format selector
    document.querySelector('#foreground-color .format-selector').value = sharedObject.preferences.foreground.format
    document.querySelector('#background-color .format-selector').value = sharedObject.preferences.background.format

    // init tabs
    initTabs("#foreground-sliders", ()=>{
        var mainHeight = document.querySelector('main').clientHeight
        ipcRenderer.send('height-changed', mainHeight)
    })
    initTabs("#background-sliders", ()=>{
        var mainHeight = document.querySelector('main').clientHeight
        ipcRenderer.send('height-changed', mainHeight)
    })

    initEvents()
})

ipcRenderer.on('colorChanged', (event, section) => {
    applyColor(section)
})

ipcRenderer.on('contrastRatioChanged', event => {
    applyContrastRatio()
})

ipcRenderer.on('pickerTogglled', (event, section, state) => {
    document.querySelector('#' + section + '-color .picker').setAttribute('aria-pressed', state)
})

function initEvents () {
    // Opens color picker on button click
    document.querySelector('#foreground-color .picker').onclick = () => ipcRenderer.send('showPicker', 'foreground')
    document.querySelector('#background-color .picker').onclick = () => ipcRenderer.send('showPicker', 'background')
    document.querySelector('#foreground-rgb .red input[type=range]').oninput = function() {sliderRGBOnInput('foreground', 'red', this.value)}
    document.querySelector('#foreground-rgb .green input[type=range]').oninput = function() {sliderRGBOnInput('foreground', 'green', this.value)}
    document.querySelector('#foreground-rgb .blue input[type=range]').oninput = function() {sliderRGBOnInput('foreground', 'blue', this.value)}
    document.querySelector('#foreground-rgb .alpha input[type=range]').oninput = function() {sliderRGBOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-rgb .red input[type=range]').oninput = function() {sliderRGBOnInput('background', 'red', this.value)}
    document.querySelector('#background-rgb .green input[type=range]').oninput = function() {sliderRGBOnInput('background', 'green', this.value)}
    document.querySelector('#background-rgb .blue input[type=range]').oninput = function() {sliderRGBOnInput('background', 'blue', this.value)}
    document.querySelector('#foreground-rgb .red input[type=number]').oninput = function() {numberRGBOnInput('foreground', 'red', this.value)}
    document.querySelector('#foreground-rgb .green input[type=number]').oninput = function() {numberRGBOnInput('foreground', 'green', this.value)}
    document.querySelector('#foreground-rgb .blue input[type=number]').oninput = function() {numberRGBOnInput('foreground', 'blue', this.value)}
    document.querySelector('#foreground-rgb .alpha input[type=number]').oninput = function() {numberRGBOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-rgb .red input[type=number]').oninput = function() {numberRGBOnInput('background', 'red', this.value)}
    document.querySelector('#background-rgb .green input[type=number]').oninput = function() {numberRGBOnInput('background', 'green', this.value)}
    document.querySelector('#background-rgb .blue input[type=number]').oninput = function() {numberRGBOnInput('background', 'blue', this.value)}
    document.querySelector('#foreground-color .sliders').onclick = function() {showHide(this)}
    document.querySelector('#background-color .sliders').onclick = function() {showHide(this)}
    document.querySelector('#foreground-color input').oninput = function() {validateForegroundText(this.value)}
    document.querySelector('#background-color input').oninput = function() {validateBackgroundText(this.value)}
    document.querySelectorAll('input[type=text], input[type=number]').forEach(function(el) { el.onfocus = function() {this.select()} })
    document.querySelector('#foreground-color input').onblur = function() {leaveText('foreground', this)}
    document.querySelector('#background-color input').onblur = function() {leaveText('background', this)}
    document.querySelector('#foreground-color .switch').onclick = function() {ipcRenderer.send('switchColors')}
    document.querySelector('#foreground-color .help').onclick = function() {showHide(this)}
    document.querySelector('#background-color .help').onclick = function() {showHide(this)}
    document.querySelector('#foreground-color .format-selector').onchange = function() {changeFormat('foreground', this)}
    document.querySelector('#background-color .format-selector').onchange = function() {changeFormat('background', this)}

    document.querySelector('#foreground-hsl .hue input[type=range]').oninput = function() {sliderHSLOnInput('foreground', 'hue', this.value)}
    document.querySelector('#foreground-hsl .saturationl input[type=range]').oninput = function() {sliderHSLOnInput('foreground', 'saturationl', this.value)}
    document.querySelector('#foreground-hsl .lightness input[type=range]').oninput = function() {sliderHSLOnInput('foreground', 'lightness', this.value)}
    document.querySelector('#foreground-hsl .alpha input[type=range]').oninput = function() {sliderHSLOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-hsl .hue input[type=range]').oninput = function() {sliderHSLOnInput('background', 'hue', this.value)}
    document.querySelector('#background-hsl .saturationl input[type=range]').oninput = function() {sliderHSLOnInput('background', 'saturationl', this.value)}
    document.querySelector('#background-hsl .lightness input[type=range]').oninput = function() {sliderHSLOnInput('background', 'lightness', this.value)}
    document.querySelector('#foreground-hsl .hue input[type=number]').oninput = function() {numberHSLOnInput('foreground', 'hue', this.value)}
    document.querySelector('#foreground-hsl .saturationl input[type=number]').oninput = function() {numberHSLOnInput('foreground', 'saturationl', this.value)}
    document.querySelector('#foreground-hsl .lightness input[type=number]').oninput = function() {numberHSLOnInput('foreground', 'lightness', this.value)}
    document.querySelector('#foreground-hsl .alpha input[type=number]').oninput = function() {numberHSLOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-hsl .hue input[type=number]').oninput = function() {numberHSLOnInput('background', 'hue', this.value)}
    document.querySelector('#background-hsl .saturationl input[type=number]').oninput = function() {numberHSLOnInput('background', 'saturationl', this.value)}
    document.querySelector('#background-hsl .lightness input[type=number]').oninput = function() {numberHSLOnInput('background', 'lightness', this.value)}

    document.querySelector('#foreground-hsv .hue input[type=range]').oninput = function() {sliderHSVOnInput('foreground', 'hue', this.value)}
    document.querySelector('#foreground-hsv .saturationv input[type=range]').oninput = function() {sliderHSVOnInput('foreground', 'saturationv', this.value)}
    document.querySelector('#foreground-hsv .value input[type=range]').oninput = function() {sliderHSVOnInput('foreground', 'value', this.value)}
    document.querySelector('#foreground-hsv .alpha input[type=range]').oninput = function() {sliderHSVOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-hsv .hue input[type=range]').oninput = function() {sliderHSVOnInput('background', 'hue', this.value)}
    document.querySelector('#background-hsv .saturationv input[type=range]').oninput = function() {sliderHSVOnInput('background', 'saturationv', this.value)}
    document.querySelector('#background-hsv .value input[type=range]').oninput = function() {sliderHSVOnInput('background', 'value', this.value)}
    document.querySelector('#foreground-hsv .hue input[type=number]').oninput = function() {numberHSVOnInput('foreground', 'hue', this.value)}
    document.querySelector('#foreground-hsv .saturationv input[type=number]').oninput = function() {numberHSVOnInput('foreground', 'saturationv', this.value)}
    document.querySelector('#foreground-hsv .value input[type=number]').oninput = function() {numberHSVOnInput('foreground', 'value', this.value)}
    document.querySelector('#foreground-hsv .alpha input[type=number]').oninput = function() {numberHSVOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-hsv .hue input[type=number]').oninput = function() {numberHSVOnInput('background', 'hue', this.value)}
    document.querySelector('#background-hsv .saturationv input[type=number]').oninput = function() {numberHSVOnInput('background', 'saturationv', this.value)}
    document.querySelector('#background-hsv .value input[type=number]').oninput = function() {numberHSVOnInput('background', 'value', this.value)}

    // init Details
    document.querySelectorAll('details').forEach(function(details) {
        details.ontoggle = function() {
            var mainHeight = document.querySelector('main').clientHeight
            ipcRenderer.send('height-changed', mainHeight)
        }
    });
}

function sliderRGBOnInput(section, component, value) {
    let sync = document.querySelector('#' + section + '-rgb .sync input[type=checkbox]').checked
    ipcRenderer.send('changeFromRGBComponent', section, component, value, sync)
}

function numberRGBOnInput(section, component, value) {
    ipcRenderer.send('changeFromRGBComponent', section, component, value)
}

function sliderHSLOnInput(section, component, value) {
    ipcRenderer.send('changeFromHSLComponent', section, component, value)
}

function numberHSLOnInput(section, component, value) {
    ipcRenderer.send('changeFromHSLComponent', section, component, value)
}

function sliderHSVOnInput(section, component, value) {
    ipcRenderer.send('changeFromHSVComponent', section, component, value)
}

function numberHSVOnInput(section, component, value) {
    ipcRenderer.send('changeFromHSVComponent', section, component, value)
}

function showHide(el) {
    let controls = document.querySelector('#' + el.getAttribute('aria-controls'))
    if (el.getAttribute('aria-expanded') === 'true') {
        controls.setAttribute('hidden', '')
        el.setAttribute('aria-expanded', false)
    } else {
        controls.removeAttribute('hidden')
        el.setAttribute('aria-expanded', true)
    }
    var mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight);
}

function applyColor(section) {
    let colorReal
    let color = sharedObject.deficiencies.normal[section + "Color"]
    if (section == 'foreground') {
        colorReal = sharedObject.deficiencies.normal.foregroundColorMixed
    } else {
        colorReal = color
    }

    applyColorPreview(section, colorReal)
    applyColorTextString(section, colorReal, color)
    applyColorRGBSliders(section, color)
    applyColorHSLSliders(section, color)
    applyColorHSVSliders(section, color)
    applyColorSample(section, colorReal)
}

function getColorTextString(format, colorReal, color) {
    switch (format) {
        case 'rgb':
            return colorReal.rgb().string()
        case 'rgba':
            return color.rgb().string()
        case 'hsl':
            // Return rounded values for HSL. This is due to a bug in `color-string` Qix-/color#127
            return colorReal.hsl().round().string()
        case 'hsla':
            // Return rounded values for HSL. This is due to a bug in `color-string` Qix-/color#127
            return color.hsl().round().string()
        case 'hsv':
            // Return rounded values for HSV. This is due to a bug in `color-string` Qix-/color#127
            return colorReal.hsv().round().string()
        case 'hsva':
            // Return rounded values for HSV. This is due to a bug in `color-string` Qix-/color#127
            return color.hsv().round().string()
        default: //hex
            return colorReal.hex()
    }
}

function applyColorTextString(section, colorReal, color) {
    /* Only change the text input if this isn't the current focused element */
    const textInput = document.querySelector('#' + section + '-color input.free-value')
    if (textInput != document.activeElement) {
        format = sharedObject.preferences[section].format
        textInput.value = getColorTextString(format, colorReal, color)
        const formatSelector =  document.querySelector('#' + section + '-format-selector')
        const freeFormat =  document.querySelector('#' + section + '-free-format')    
        textInput.removeAttribute('aria-invalid')
        freeFormat.removeAttribute('aria-live')
        freeFormat.innerHTML = format.toUpperCase() + " format"
        formatSelector.style.display = "block";
    }
}

function applyColorPreview(section, colorReal) {
    const colorRGB = colorReal.rgb().string()
    const name = colorReal.cssname()
    const isDark = colorReal.isDark()

    document.querySelector('#' + section + '-color').style.background = colorRGB 
    if (name) {
        document.querySelector('#' + section + '-color .name-value').innerHTML = '&nbsp;(' + name + ')'
    } else {
        document.querySelector('#' + section + '-color .name-value').innerHTML = null        
    }
    document.querySelector('#' + section + '-color').classList.toggle('darkMode', isDark)

}

function applyColorRGBSliders(section, color) {
    document.querySelector('#' + section + '-rgb .red input[type=range]').value = Math.round(color.red())
    document.querySelector('#' + section + '-rgb .green input[type=range]').value = Math.round(color.green())
    document.querySelector('#' + section + '-rgb .blue input[type=range]').value = Math.round(color.blue())
    document.querySelector('#' + section + '-rgb .red input[type=number]').value = Math.round(color.red())
    document.querySelector('#' + section + '-rgb .green input[type=number]').value = Math.round(color.green())
    document.querySelector('#' + section + '-rgb .blue input[type=number]').value = Math.round(color.blue())
    if (section === 'foreground') {
        document.querySelector('#' + section + '-rgb .alpha input[type=range]').value = color.alpha()
        if (document.activeElement != document.querySelector('#' + section + '-rgb .alpha input[type=number]')) {
            /* only force update of the alpha number input if it's not current;y focused
               as otherwise, when user enters "0.", it's corrected to "0" and prevents correct text entry */
            document.querySelector('#' + section + '-rgb .alpha input[type=number]').value = color.alpha()
        }  
    }
}

function applyColorHSLSliders(section, color) {
    document.querySelector('#' + section + '-hsl .hue input[type=range]').value = Math.round(color.hue())
    document.querySelector('#' + section + '-hsl .saturationl input[type=range]').value = Math.round(color.saturationl())
    document.querySelector('#' + section + '-hsl .lightness input[type=range]').value = Math.round(color.lightness())
    document.querySelector('#' + section + '-hsl .hue input[type=number]').value = Math.round(color.hue())
    document.querySelector('#' + section + '-hsl .saturationl input[type=number]').value = Math.round(color.saturationl())
    document.querySelector('#' + section + '-hsl .lightness input[type=number]').value = Math.round(color.lightness())
    if (section === 'foreground') {
        document.querySelector('#' + section + '-hsl .alpha input[type=range]').value = color.alpha()
        if (document.activeElement != document.querySelector('#' + section + '-hsl .alpha input[type=number]')) {
            /* only force update of the alpha number input if it's not current;y focused
               as otherwise, when user enters "0.", it's corrected to "0" and prevents correct text entry */
            document.querySelector('#' + section + '-hsl .alpha input[type=number]').value = color.alpha()
        }  
    }
}

function applyColorHSVSliders(section, color) {
    document.querySelector('#' + section + '-hsv .hue input[type=range]').value = Math.round(color.hue())
    document.querySelector('#' + section + '-hsv .saturationv input[type=range]').value = Math.round(color.saturationv())
    document.querySelector('#' + section + '-hsv .value input[type=range]').value = Math.round(color.value())
    document.querySelector('#' + section + '-hsv .hue input[type=number]').value = Math.round(color.hue())
    document.querySelector('#' + section + '-hsv .saturationv input[type=number]').value = Math.round(color.saturationv())
    document.querySelector('#' + section + '-hsv .value input[type=number]').value = Math.round(color.value())
    if (section === 'foreground') {
        document.querySelector('#' + section + '-hsv .alpha input[type=range]').value = color.alpha()
        if (document.activeElement != document.querySelector('#' + section + '-hsv .alpha input[type=number]')) {
            /* only force update of the alpha number input if it's not current;y focused
               as otherwise, when user enters "0.", it's corrected to "0" and prevents correct text entry */
            document.querySelector('#' + section + '-hsv .alpha input[type=number]').value = color.alpha()
        }  
    }
}

function applyColorSample(section, colorReal) {
    const colorRGB = colorReal.rgb().string()

    if (section === 'foreground') {
        document.querySelector('#sample-preview .text').style.color = colorRGB
        document.querySelector('#sample-preview .icon svg').style.stroke = colorRGB    
    } else {
        document.querySelector('#sample-preview .text').style.background = colorRGB
        document.querySelector('#sample-preview .icon').style.background = colorRGB
    }
}

function applyContrastRatio () {
    let level_1_4_3, level_1_4_6, level_1_4_11
    const normal = sharedObject.deficiencies.normal
    if (normal.levelAA === 'large') {
        level_1_4_3 = '<div><img src="icons/fail.svg" alt="" /> Fail (regular text)</div><div><img src="icons/pass.svg" alt="" /> Pass (large text)</div>'
        level_1_4_11 = '<div><img src="icons/pass.svg" alt="" /> Pass (UI components and graphical objects)</div>'
    } else if (normal.levelAA === 'regular') {
        level_1_4_3 = '<div><img src="icons/pass.svg" alt="" /> Pass (regular text)</div><div><img src="icons/pass.svg" alt="" /> Pass (large text)</div>'
        level_1_4_11 = '<div><img src="icons/pass.svg" alt="" /> Pass (UI components and graphical objects)</div>'
    } else { // Fail
        level_1_4_3 = '<div><img src="icons/fail.svg" alt="" /> Fail (regular text)</div><div><img src="icons/fail.svg" alt="" /> Fail (large text)</div>'
        level_1_4_11 = '<div><img src="icons/fail.svg" alt="" /> Fail (UI components and graphical objects)</div>'
    }
    if (normal.levelAAA === 'large') {
        level_1_4_6 = '<div><img src="icons/fail.svg" alt="" /> Fail (regular text)</div><div><img src="icons/pass.svg" alt="" /> Pass (large text)</div>'
    } else if (normal.levelAAA === 'regular') {
        level_1_4_6 = '<div><img src="icons/pass.svg" alt="" /> Pass (regular text)</div><div><img src="icons/pass.svg" alt="" /> Pass (large text)</div>'
    } else { // Fail
        level_1_4_6 = '<div><img src="icons/fail.svg" alt="" /> Fail (regular text)</div><div><img src="icons/fail.svg" alt="" /> Fail (large text)</div>'
    }

    // translate results
    let results = [level_1_4_3, level_1_4_6, level_1_4_11]
    results.forEach( function(item, index) {
        results[index] = item.replace(/Pass/g, i18n['Pass'] )
                .replace(/Fail/g, i18n['Fail'])
                .replace(/regular text/g, i18n['regular text'])
                .replace(/large text/g, i18n['large text'])
                .replace(/UI components and graphical objects/g, i18n['UI components and graphical objects'])
    })

    level_1_4_3 = results.shift()
    level_1_4_6 = results.shift()
    level_1_4_11 = results.shift()

    document.getElementById('contrast-ratio-value').innerHTML = normal.contrastRatioString
    document.getElementById('contrast-level-1-4-3').innerHTML = level_1_4_3
    document.getElementById('contrast-level-1-4-6').innerHTML = level_1_4_6
    document.getElementById('contrast-level-1-4-11').innerHTML = level_1_4_11   
}

function validateForegroundText(value) {
    const string = value.toLowerCase().replace(/\s/g, "") // Clean input value
    let format = null
    if (string) {
        if (Color.isHexA(string)) {
            format = 'hex'
        } else if (Color.isRGB(string)) {
            format = 'rgb'
        } else if (Color.isRGBA(string)) {
            format = 'rgba'
        } else if (Color.isHSL(string)) {
            format = 'hsl'
        } else if (Color.isHSLA(string)) {
            format = 'hsla'
        } else if (Color.isHSV(string)) {
            format = 'hsv'
        } else if (Color.isHSVA(string)) {
            format = 'hsva'
        } else if (Color.isName(string)) {
            format = 'name'
        }
    }
    displayValidate('foreground', format, string)
}

function validateBackgroundText(value) {
    const string = value.toLowerCase().replace(/\s/g, "") // Clean input value
    let format = null
    if (string) {
        if (Color.isHex(string)) {
            format = 'hex'
        } else if (Color.isRGB(string)) {
            format = 'rgb'
        } else if (Color.isHSL(string)) {
            format = 'hsl'
        } else if (Color.isHSV(string)) {
            format = 'hsv'
        } else if (Color.isName(string)) {
            format = 'name'
        }
    }
    displayValidate('background', format, string)
}

function displayValidate(section, format, string) {
    const input = document.querySelector('#' + section + '-color input')
    const formatSelector =  document.querySelector('#' + section + '-format-selector')
    const freeFormat =  document.querySelector('#' + section + '-free-format')
    if (!freeFormat.getAttribute('aria-live')) {
        freeFormat.setAttribute('aria-live', 'polite')
    }
    if (format) {
        ipcRenderer.send('changeFromString', section, string, format)
        input.setAttribute('aria-invalid', false)
        formatSelector.value = format.toLowerCase()
        formatSelector.style.display = "block"
        freeFormat.innerHTML = format + ' format detected'
    } else {
        input.setAttribute('aria-invalid', true)
        formatSelector.style.display = "none"
        freeFormat.innerHTML = null
    }
}

function leaveText(section, el) {
    const freeFormat =  document.querySelector('#' + section + '-free-format')
    if (freeFormat.getAttribute('aria-live')) {
        if (el.getAttribute('aria-invalid') === 'true') {
            freeFormat.innerHTML = 'Error, Incorrect ' + section + ' format'
        }    
    }
}

function changeFormat(section, el) {
    let colorReal
    // We send the selected format to the controller for saving and sharedObject update
    ipcRenderer.send('setPreference', el.value, section, 'format')
    // Then we update the current text field
    if (section == 'foreground') {
        color = sharedObject.deficiencies.normal.foregroundColor
        colorReal = sharedObject.deficiencies.normal.foregroundColorMixed
    } else {
        color = sharedObject.deficiencies.normal.backgroundColor
        colorReal = color
    }
    applyColorTextString(section, colorReal, color)
}

function translateHTML(config) {

    // translate html elements.
    document.querySelector('html').lang = i18n['lang']
    document.querySelector('title').textContent = i18n['Title']

    document.querySelector('h1').textContent = i18n['CCA Main windows']

    document.querySelector('#foreground-color h2').textContent = i18n['Foreground colour']

    document.querySelector('#foreground-format-selector').setAttribute('aria-label', i18n['Select default format for foreground colour']);
    document.querySelector('#foreground-format-selector+input').setAttribute('aria-label', i18n['Foreground colour value']);

    document.querySelector('#foreground-color div:last-child button.switch').setAttribute('aria-label', i18n['Switch Colours'])
    document.querySelector('#foreground-color div:last-child button.sliders').setAttribute('aria-label', i18n['Foreground colour sliders'])
    document.querySelector('#foreground-color div:last-child button.picker').setAttribute('aria-label', i18n['Foreground colour picker'])
    document.querySelector('#foreground-color div:last-child button.help').setAttribute('aria-label', i18n['Foreground help'])

    document.querySelector('#foreground-help').innerHTML
        = document.querySelector('#foreground-help').innerHTML
            .replace('Supported formats are', i18n['Supported formats are'])
            .replace('Names', i18n['Names'])

    document.querySelector('#foreground-rgb h2').textContent = i18n['Foreground RGB input']
    document.querySelector('#foreground-rgb > div.sync > label').innerHTML
        = document.querySelector('#foreground-rgb > div.sync > label').innerHTML
            .replace('Synchronize foreground colour values', i18n['Synchronize foreground colour values'])
            .replace('Synchronize colour values', i18n['Synchronize colour values'])

    document.querySelector('#foreground-rgb > div.slider.slider-rgb.red > label').textContent = i18n['Red']
    document.querySelector('#foreground-rgb > div.slider.slider-rgb.green > label').textContent = i18n['Green']
    document.querySelector('#foreground-rgb > div.slider.slider-rgb.blue > label').textContent = i18n['Blue']
    document.querySelector('#foreground-rgb > div.slider.slider-rgb.alpha > label').textContent = i18n['Alpha']

    document.querySelector('#foreground-hsl > h2').textContent = i18n['Foreground HSL input']
    document.querySelector('#foreground-hsl > div.slider.slider-hsl.hue > label').textContent = i18n['Hue']
    document.querySelector('#foreground-hsl > div.slider.slider-hsl.saturationl > label').textContent = i18n['Saturation']
    document.querySelector('#foreground-hsl > div.slider.slider-hsl.lightness > label').textContent = i18n['Lightness']
    document.querySelector('#foreground-hsl > div.slider.slider-hsl.alpha > label').textContent = i18n['Alpha']

    document.querySelector('#foreground-hsv > h2').textContent = i18n['Foreground HSV input']
    document.querySelector('#foreground-hsv > div.slider.slider-hsv.hue > label').textContent = i18n['Hue']
    document.querySelector('#foreground-hsv > div.slider.slider-hsv.saturationv > label').textContent = i18n['Saturation']
    document.querySelector('#foreground-hsv > div.slider.slider-hsv.value > label').textContent = i18n['Value']
    document.querySelector('#foreground-hsv > div.slider.slider-hsv.alpha > label').textContent = i18n['Alpha']

    document.querySelector('#background-color h2').textContent = i18n['Background colour']
    document.querySelector('#background-format-selector').setAttribute('aria-label', i18n['Select default format for background colour'])
    document.querySelector('#background-color > div.container > input').setAttribute('aria-label', i18n['Background colour value'])

    document.querySelector('#background-color > div.buttons > button.sliders').setAttribute('aria-label', i18n['Background colour sliders'])
    document.querySelector('#background-color > div.buttons > button.picker').setAttribute('aria-label', i18n['Background colour picker'])
    document.querySelector('#background-color > div.buttons > button.help').setAttribute('aria-label', i18n['Background help'])

    document.querySelector('#background-help').innerHTML
        = document.querySelector('#background-help').innerHTML
            .replace('Supported formats are', i18n['Supported formats are'])
            .replace('Names', i18n['Names'])

    document.querySelector('#background-rgb > h2').textContent = i18n['Background RGB input']
    document.querySelector('#background-rgb > div.sync > label').innerHTML
        = document.querySelector('#background-rgb > div.sync > label').innerHTML
            .replace('Synchronize background colour values', i18n['Synchronize background colour values'])
            .replace('Synchronize colour values', i18n['Synchronize colour values'])

    document.querySelector('#background-rgb > div.slider.slider-rgb.red > label').textContent = i18n['Red']
    document.querySelector('#background-rgb > div.slider.slider-rgb.green > label').textContent = i18n['Green']
    document.querySelector('#background-rgb > div.slider.slider-rgb.blue > label').textContent = i18n['Blue']

    document.querySelector('#background-hsl > h2').textContent = i18n['Background HSL input']
    document.querySelector('#background-hsl > div.slider.slider-hsl.hue > label').textContent = i18n['Hue']
    document.querySelector('#background-hsl > div.slider.slider-hsl.saturationl > label').textContent = i18n['Saturation']
    document.querySelector('#background-hsl > div.slider.slider-hsl.lightness > label').textContent = i18n['Lightness']

    document.querySelector('#background-hsv > h2').textContent = i18n['Background HSV input']
    document.querySelector('#background-hsv > div.slider.slider-hsv.hue > label').textContent = i18n['Hue']
    document.querySelector('#background-hsv > div.slider.slider-hsv.saturationv > label').textContent = i18n['Saturation']
    document.querySelector('#background-hsv > div.slider.slider-hsv.value > label').textContent = i18n['Value']

    document.querySelector('#sample-preview details summary h2').textContent = i18n['Sample preview']
    document.querySelector('#sample-preview details summary+div.preview-box div.text').textContent = i18n['example text showing contrast']

    document.querySelector('#results header h2').textContent = i18n['WCAG 2.1 results']
    document.querySelector('#contrast-ratio h3').textContent = i18n['Contrast ratio']

    document.querySelector('#results header+details summary h3').textContent = i18n['1.4.3 Contrast (Minimum) (AA)']
    document.querySelector('#contrast-level-1-4-3+details summary h3').textContent = i18n['1.4.6 Contrast (Enhanced) (AAA)']
    document.querySelector('#contrast-level-1-4-6+details summary h3').textContent = i18n['1.4.11 Non-text Contrast (AA)']

    document.querySelector('#results > details:nth-child(2) > p').innerHTML
        = document.querySelector('#results > details:nth-child(2) > p').innerHTML
            .replace('Paraphrased', i18n['Paraphrased'])
            .replace(
                'Text (including images of text) has a contrast ratio of at least <strong>4.5:1</strong> for "regular" sized text and at least <strong>3:1</strong> for large scale text (at least <code>18pt</code> / <code>24px</code>, or bold and at least <code>14pt</code> / <code>18.5px</code>), unless the text is purely decorative.',
                i18n['sc_1_4_3']
            )

    document.querySelector('#results > details:nth-child(4) > p').innerHTML
        = document.querySelector('#results > details:nth-child(4) > p').innerHTML
            .replace('Paraphrased', i18n['Paraphrased'])
            .replace(
                'Text (including images of text) has a contrast ratio of at least <strong>7:1</strong> for "regular" sized text and at least <strong>4.5:1</strong> for large scale text (at least <code>18pt</code> / <code>24px</code>, or bold and at least <code>14pt</code> / <code>18.5px</code>), unless the text is purely decorative.',
                i18n['sc_1_4_6']
            )
    
            document.querySelector('#results > details:nth-child(6) > p').innerHTML
            = document.querySelector('#results > details:nth-child(6) > p').innerHTML
                .replace('Paraphrased', i18n['Paraphrased'])
                .replace(
                    'The visual presentation of user interface components (their states – including focus indication – and boundaries) and graphical objects has a contrast ratio of at least <strong>3:1</strong> against adjacent colour(s)',
                    i18n['sc_1_4_11']
                )

}
