const { ipcRenderer } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')
const Color = require('../../CCAcolor')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

ipcRenderer.on('init', event => {
    applyColor('foreground')
    applyColor('background')
    applyContrastRatio()
    var mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight)
    initEvents()
})

ipcRenderer.on('foregroundColorChanged', event => {
    applyColor('foreground')
    applyContrastRatio()
})

ipcRenderer.on('backgroundColorChanged', event => {
    applyColor('background')
    applyContrastRatio()
})

ipcRenderer.on('foregroundPickerToggelled', (event, state) => {
    document.querySelector('#foreground-color .picker').setAttribute('aria-pressed', state)
})

ipcRenderer.on('backgroundPickerToggelled', (event, state) => {
    document.querySelector('#background-color .picker').setAttribute('aria-pressed', state)
})

function initEvents () {
    // Opens color picker on button click
    document.querySelector('#foreground-color .picker').onclick = () => ipcRenderer.send('showForegroundPicker')
    document.querySelector('#background-color .picker').onclick = () => ipcRenderer.send('showBackgroundPicker')
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
    document.querySelector('#foreground-color .format-selector').onchange = function() {console.log("teset");changeFormat('foreground', this)}
    document.querySelector('#background-color .format-selector').onchange = function() {changeFormat('background', this)}

    document.querySelector('#foreground-hsl .hue input[type=range]').oninput = function() {sliderHSLOnInput('foreground', 'hue', this.value)}
    document.querySelector('#foreground-hsl .saturation input[type=range]').oninput = function() {sliderHSLOnInput('foreground', 'saturation', this.value)}
    document.querySelector('#foreground-hsl .lightness input[type=range]').oninput = function() {sliderHSLOnInput('foreground', 'lightness', this.value)}
    document.querySelector('#foreground-hsl .alpha input[type=range]').oninput = function() {sliderHSLOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-hsl .hue input[type=range]').oninput = function() {sliderHSLOnInput('background', 'hue', this.value)}
    document.querySelector('#background-hsl .saturation input[type=range]').oninput = function() {sliderHSLOnInput('background', 'saturation', this.value)}
    document.querySelector('#background-hsl .lightness input[type=range]').oninput = function() {sliderHSLOnInput('background', 'lightness', this.value)}
    document.querySelector('#foreground-hsl .hue input[type=number]').oninput = function() {numberHSLOnInput('foreground', 'hue', this.value)}
    document.querySelector('#foreground-hsl .saturation input[type=number]').oninput = function() {numberHSLOnInput('foreground', 'saturation', this.value)}
    document.querySelector('#foreground-hsl .lightness input[type=number]').oninput = function() {numberHSLOnInput('foreground', 'lightness', this.value)}
    document.querySelector('#foreground-hsl .alpha input[type=number]').oninput = function() {numberHSLOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-hsl .hue input[type=number]').oninput = function() {numberHSLOnInput('background', 'hue', this.value)}
    document.querySelector('#background-hsl .saturation input[type=number]').oninput = function() {numberHSLOnInput('background', 'saturation', this.value)}
    document.querySelector('#background-hsl .lightness input[type=number]').oninput = function() {numberHSLOnInput('background', 'lightness', this.value)}

    // init Details
    document.querySelectorAll('details').forEach(function(details) {
        details.ontoggle = function() {
            var mainHeight = document.querySelector('main').clientHeight
            ipcRenderer.send('height-changed', mainHeight)
        }
    });

    // init format selector
    document.querySelector('#foreground-color .format-selector').value = sharedObject.preferences.foreground.format
    document.querySelector('#background-color .format-selector').value = sharedObject.preferences.background.format

    // init tabs
    initTabs("#foreground-sliders", ipcRenderer)
    initTabs("#background-sliders", ipcRenderer)
}

function sliderRGBOnInput(group, component, value) {
    let sync = document.querySelector('#' + group + '-rgb .sync input[type=checkbox]').checked
    ipcRenderer.send('changeRGBComponent', group, component, value, sync)
}

function numberRGBOnInput(group, component, value) {
    ipcRenderer.send('changeRGBComponent', group, component, value)
}

function sliderHSLOnInput(group, component, value) {
    ipcRenderer.send('changeHSLComponent', group, component, value)
}

function numberHSLOnInput(group, component, value) {
    ipcRenderer.send('changeHSLComponent', group, component, value)
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
    let color, colorReal
    if (section == 'foreground') {
        color = sharedObject.deficiencies.normal.foregroundColor
        colorReal = sharedObject.deficiencies.normal.foregroundColorMixed
    } else {
        color = sharedObject.deficiencies.normal.backgroundColor
        colorReal = color
    }

    applyColorPreview(section, colorReal)
    applyColorTextString(section, colorReal)
    applyColorRGBSliders(section, color)
    applyColorHSLSliders(section, color)
    applyColorSample(section, colorReal)
}

function applyColorTextString(section, colorReal) {
    /* Only change the text input if this isn't the current focused element */
    const textInput = document.querySelector('#' + section + '-color input.free-value')
    if (textInput != document.activeElement) {
        format = sharedObject.preferences[section].format

        switch (format) {
            case 'rgb':
                colorString = colorReal.rgb().string()
                break;
            case 'hsl':
                // Return rounded values for HSL. This is due to a bug in `color-string` Qix-/color#127
                colorString = colorReal.hsl().round().string()
                break;
            default: //hex
                colorString = colorReal.hex()
        }

        textInput.value = colorString
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
    document.querySelector('#' + section + '-rgb .red input[type=range]').value = color.red()
    document.querySelector('#' + section + '-rgb .green input[type=range]').value = color.green()
    document.querySelector('#' + section + '-rgb .blue input[type=range]').value = color.blue()
    document.querySelector('#' + section + '-rgb .red input[type=number]').value = color.red()
    document.querySelector('#' + section + '-rgb .green input[type=number]').value = color.green()
    document.querySelector('#' + section + '-rgb .blue input[type=number]').value = color.blue()
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
    document.querySelector('#' + section + '-hsl .hue input[type=range]').value = color.hue()
    document.querySelector('#' + section + '-hsl .saturation input[type=range]').value = color.saturationl()
    document.querySelector('#' + section + '-hsl .lightness input[type=range]').value = color.lightness()
    document.querySelector('#' + section + '-hsl .hue input[type=number]').value = color.hue()
    document.querySelector('#' + section + '-hsl .saturation input[type=number]').value = color.saturationl()
    document.querySelector('#' + section + '-hsl .lightness input[type=number]').value = color.lightness()
    if (section === 'foreground') {
        document.querySelector('#' + section + '-hsl .alpha input[type=range]').value = color.alpha()
        if (document.activeElement != document.querySelector('#' + section + '-hsl .alpha input[type=number]')) {
            /* only force update of the alpha number input if it's not current;y focused
               as otherwise, when user enters "0.", it's corrected to "0" and prevents correct text entry */
            document.querySelector('#' + section + '-hsl .alpha input[type=number]').value = color.alpha()
        }  
    }
}

function applyColorSample(section, colorReal) {
    const colorRGB = colorReal.rgb().string()

    if (section === 'foreground') {
        document.querySelector('#sample-preview .text').style.color = colorRGB
        document.querySelector('#sample-preview .icon svg').style.fill = colorRGB    
    } else {
        document.querySelector('#sample-preview .text').style.background = colorRGB
        document.querySelector('#sample-preview .icon').style.background = colorRGB
    }
}

function applyContrastRatio () {
    let level_1_4_3, level_1_4_6, level_1_4_11
    const normal = sharedObject.deficiencies.normal
    if (normal.levelAA === 'large') {
        level_1_4_3 = '<img src="icons/pass.svg" alt="" /> Pass for large text only <img src="icons/fail.svg" alt="" /> Fail for regular text'
        level_1_4_11 = '<img src="icons/pass.svg" alt="" /> Pass for UI components and graphical objects'
    } else if (normal.levelAA === 'regular') {
        level_1_4_3 = '<img src="icons/pass.svg" alt="" /> Pass for large and regular text'
        level_1_4_11 = '<img src="icons/pass.svg" alt="" /> Pass for UI components and graphical objects'
    } else { // Fail
        level_1_4_3 = '<img src="icons/fail.svg" alt="" /> Fail for large and regular text'
        level_1_4_11 = '<img src="icons/fail.svg" alt="" /> Fail for UI components and graphical objects'
    }
    if (normal.levelAAA === 'large') {
        level_1_4_6 = '<img src="icons/pass.svg" alt="" /> Pass for large text only <img src="icons/fail.svg" alt="" /> Fail for regular text'
    } else if (normal.levelAAA === 'regular') {
        level_1_4_6 = '<img src="icons/pass.svg" alt="" /> Pass for large and regular text'
    } else { // Fail
        level_1_4_6 = '<img src="icons/fail.svg" alt="" /> Fail for large and regular text'
    }
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
        if (section == 'foreground') {
            ipcRenderer.send('changeForeground', string, format)
        } else {
            ipcRenderer.send('changeBackground', string, format)
        }
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
    ipcRenderer.send('changeFormat', section, el.value)
    // Then we update the current text field
    if (section == 'foreground') {
        colorReal = sharedObject.deficiencies.normal.foregroundColorMixed
    } else {
        colorReal = sharedObject.deficiencies.normal.backgroundColor
    }
    applyColorTextString(section, colorReal)
}