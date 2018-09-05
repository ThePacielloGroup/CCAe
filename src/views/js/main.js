const { ipcRenderer } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')
const Color = require('../../CCAcolor')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

ipcRenderer.on('init', event => {
    applyColor('foreground')
    applyColor('background')
    applyContrastRatio()
    displayLevelAAA()
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

ipcRenderer.on('optionDisplayLevelAAAChanged', event => {
    displayLevelAAA()
    var mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight)
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
    document.querySelector('#foreground-rgb .red input[type=range]').oninput = function() {sliderOnInput('foreground', 'red', this.value)}
    document.querySelector('#foreground-rgb .green input[type=range]').oninput = function() {sliderOnInput('foreground', 'green', this.value)}
    document.querySelector('#foreground-rgb .blue input[type=range]').oninput = function() {sliderOnInput('foreground', 'blue', this.value)}
    document.querySelector('#foreground-rgb .alpha input[type=range]').oninput = function() {sliderOnInput('foreground', 'alpha', this.value)}
    document.querySelector('#background-rgb .red input[type=range]').oninput = function() {sliderOnInput('background', 'red', this.value)}
    document.querySelector('#background-rgb .green input[type=range]').oninput = function() {sliderOnInput('background', 'green', this.value)}
    document.querySelector('#background-rgb .blue input[type=range]').oninput = function() {sliderOnInput('background', 'blue', this.value)}
    document.querySelector('#foreground-rgb .red input[type=number]').oninput = function() {ipcRenderer.send('changeRGBComponent', 'foreground', 'red', this.value)}
    document.querySelector('#foreground-rgb .green input[type=number]').oninput = function() {ipcRenderer.send('changeRGBComponent', 'foreground', 'green', this.value)}
    document.querySelector('#foreground-rgb .blue input[type=number]').oninput = function() {ipcRenderer.send('changeRGBComponent', 'foreground', 'blue', this.value)}
    document.querySelector('#foreground-rgb .alpha input[type=number]').oninput = function() {ipcRenderer.send('changeRGBComponent', 'foreground', 'alpha', this.value)}
    document.querySelector('#background-rgb .red input[type=number]').oninput = function() {ipcRenderer.send('changeRGBComponent', 'background', 'red', this.value)}
    document.querySelector('#background-rgb .green input[type=number]').oninput = function() {ipcRenderer.send('changeRGBComponent', 'background', 'green', this.value)}
    document.querySelector('#background-rgb .blue input[type=number]').oninput = function() {ipcRenderer.send('changeRGBComponent', 'background', 'blue', this.value)}
    document.querySelector('#foreground-color .rgb').onclick = function() {showHide(this)}
    document.querySelector('#background-color .rgb').onclick = function() {showHide(this)}
    document.querySelector('#foreground-color input').oninput = function() {validateForegroundText(this.value)}
    document.querySelector('#background-color input').oninput = function() {validateBackgroundText(this.value)}
    document.querySelector('#foreground-color .switch').onclick = function() {ipcRenderer.send('switchColors')}
    document.querySelector('#foreground-color .help').onclick = function() {showHide(this)}
    document.querySelector('#background-color .help').onclick = function() {showHide(this)}

    // initDetails
    document.querySelectorAll('details').forEach(function(details) {
        details.ontoggle = function() {
            var mainHeight = document.querySelector('main').clientHeight;
            ipcRenderer.send('height-changed', mainHeight)
        }
    });  
}

function sliderOnInput(group, color, value) {
    let sync = document.querySelector('#' + group + '-rgb .sync input[type=checkbox]').checked
    ipcRenderer.send('changeRGBComponent', group, color, value, sync)
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
    ipcRenderer.send('height-changed', mainHeight)
}

function applyColor(section) {
    let color, colorMixed, name, colorRGB, colorHEX, isDark
    if (section == 'foreground') {
        color = sharedObject.deficiencies.normal.foregroundColor
        colorMixed = sharedObject.deficiencies.normal.foregroundColorMixed
        name = colorMixed.cssname()
        colorRGB = colorMixed.rgb().string()
        colorHEX = colorMixed.hex()
        isDark = colorMixed.isDark()
    } else {
        color = sharedObject.deficiencies.normal.backgroundColor
        name = color.cssname()
        colorRGB = color.rgb().string()
        colorHEX = color.hex()
        isDark = color.isDark()
    }

    document.querySelector('#' + section + '-color').style.background = colorRGB 
    if (name) {
        document.querySelector('#' + section + '-color .name-value').innerHTML = '&nbsp;(' + name + ')'
    } else {
        document.querySelector('#' + section + '-color .name-value').innerHTML = null        
    }
    document.querySelector('#' + section + '-color').classList.toggle('darkMode', isDark)
    document.querySelector('#' + section + '-rgb .red input[type=range]').value = color.red()
    document.querySelector('#' + section + '-rgb .green input[type=range]').value = color.green()
    document.querySelector('#' + section + '-rgb .blue input[type=range]').value = color.blue()
    document.querySelector('#' + section + '-rgb .red input[type=number]').value = color.red()
    document.querySelector('#' + section + '-rgb .green input[type=number]').value = color.green()
    document.querySelector('#' + section + '-rgb .blue input[type=number]').value = color.blue()
    if (section === 'foreground') {
        document.querySelector('#' + section + '-rgb .alpha input[type=range]').value = color.alpha()
        document.querySelector('#' + section + '-rgb .alpha input[type=number]').value = color.alpha()    
    }
    document.querySelector('#sample-preview .text').style.color = colorRGB
    document.querySelector('#sample-preview .icon svg').style.fill = colorRGB

    /* Only change the text input if this isn't the current focused element */
    const textInput = document.querySelector('#' + section + '-color input.free-value')
    if (textInput != document.activeElement) {
        textInput.value = colorHEX
        const freeTag =  document.querySelector('#' + section + '-free-tag')
        const freeFormat =  document.querySelector('#' + section + '-free-format')    
        textInput.removeAttribute('aria-invalid')
        freeFormat.removeAttribute('aria-live')
        freeFormat.innerHTML = "HEX format"
        freeTag.innerHTML = "HEX"
        freeTag.style.display = "block";
    }
}

function applyContrastRatio () {
    let levelAA, levelAAico, levelAAA

    Object.keys(sharedObject.deficiencies).forEach(function(key, index) {
        if (key === 'normal') {
            if (this[key].levelAA === 'large') {
                levelAA = '<img src="icons/pass.svg" alt="" /> Pass for large text only <img src="icons/fail.svg" alt="" /> Fail for regular text'
                levelAAico = '<img src="icons/pass.svg" alt="" /> Pass for UI components and graphical objects'
            } else if (this[key].levelAA === 'regular') {
                levelAA = '<img src="icons/pass.svg" alt="" /> Pass for large and regular text'
                levelAAico = '<img src="icons/pass.svg" alt="" /> Pass for UI components and graphical objects'
            } else { // Fail
                levelAA = '<img src="icons/fail.svg" alt="" /> Fail for large and regular text'
                levelAAico = '<img src="icons/fail.svg" alt="" /> Fail for UI components and graphical objects'
            }
            if (this[key].levelAAA === 'large') {
                levelAAA = '<img src="icons/pass.svg" alt="" /> Pass for large text only <img src="icons/fail.svg" alt="" /> Fail for regular text'
            } else if (this[key].levelAAA === 'regular') {
                levelAAA = '<img src="icons/pass.svg" alt="" /> Pass for large and regular text'
            } else { // Fail
                levelAAA = '<img src="icons/fail.svg" alt="" /> Fail for large and regular text'
            }
            document.getElementById('contrast-ratio-value').innerHTML = this[key].contrastRatioString
            document.getElementById('contrast-level-1-4-3').innerHTML = levelAA   
            document.getElementById('contrast-level-1-4-11').innerHTML = levelAAico   
            document.getElementById('contrast-level-1-4-6').innerHTML = levelAAA   
        }
    }, sharedObject.deficiencies)
}

function validateForegroundText(value) {
    const string = value.toLowerCase().replace(/\s/g, "") // Clean input value
    let format = null
    if (string) {
        if (Color.isHexA(string)) {
            format = 'HEX'
        } else if (Color.isRGB(string)) {
            format = 'RGB'
        } else if (Color.isRGBA(string)) {
            format = 'RGBa'
        } else if (Color.isHSL(string)) {
            format = 'HSL'
        } else if (Color.isHSLA(string)) {
            format = 'HLSa'
        } else if (Color.isName(string)) {
            format = 'Name'
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
    const freeTag =  document.querySelector('#' + section + '-free-tag')
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
        freeTag.innerHTML = format.toUpperCase()
        freeTag.style.display = "block"
        freeFormat.innerHTML = format + ' fomat detected'
    } else {
        input.setAttribute('aria-invalid', true)
        freeTag.style.display = "none"
        freeFormat.innerHTML = null
    }
}

function displayLevelAAA() {
    document.body.classList.toggle('hideLevelAAA', !sharedObject.options.displayLevelAAA)
}