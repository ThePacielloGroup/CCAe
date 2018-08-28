const { ipcRenderer } = require('electron')
const sharedObject = require('electron').remote.getGlobal('sharedObject')
const Color = require('../../CCAcolor')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

ipcRenderer.on('init', event => {
    applyForegroundColor()
    applyBackgroundColor()
    applyContrastRatio()
    displayLevelAAA()
    var mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight)
    initEvents()
})

ipcRenderer.on('foregroundColorChanged', event => {
    applyForegroundColor()
    applyContrastRatio()
})

ipcRenderer.on('backgroundColorChanged', event => {
    applyBackgroundColor()
    applyContrastRatio()
})

ipcRenderer.on('optionDisplayLevelAAAChanged', event => {
    displayLevelAAA()
    var mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight)
})

ipcRenderer.on('foregroundPickerToggelled', (event, state) => {
    document.querySelector('#foreground-color .picker').setAttribute('aria-expanded', state)
})

ipcRenderer.on('backgroundPickerToggelled', (event, state) => {
    document.querySelector('#background-color .picker').setAttribute('aria-expanded', state)
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

function applyForegroundColor () {
    let color = sharedObject.deficiencies.normal.foregroundColor
    let colorMixed = sharedObject.deficiencies.normal.foregroundColorMixed
    let name = colorMixed.cssname()
    document.querySelector('#foreground-color').style.background = colorMixed.rgb().string()  
    if (name) {
        document.querySelector('#foreground-color .name-value').innerHTML = '&nbsp;(' + name + ')'
    } else {
        document.querySelector('#foreground-color .name-value').innerHTML = null        
    }
    document.querySelector('#foreground-color').classList.toggle('darkMode', colorMixed.isDark())
    document.querySelector('#foreground-rgb .red input[type=range]').value = color.red()
    document.querySelector('#foreground-rgb .green input[type=range]').value = color.green()
    document.querySelector('#foreground-rgb .blue input[type=range]').value = color.blue()
    document.querySelector('#foreground-rgb .alpha input[type=range]').value = color.alpha()
    document.querySelector('#foreground-rgb .red input[type=number]').value = color.red()
    document.querySelector('#foreground-rgb .green input[type=number]').value = color.green()
    document.querySelector('#foreground-rgb .blue input[type=number]').value = color.blue()
    document.querySelector('#foreground-rgb .alpha input[type=number]').value = color.alpha()
    document.querySelector('#sample-preview .text').style.color = color.rgb().string()
    document.querySelector('#sample-preview .icon svg').style.fill = color.rgb().string()

    /* Only change the text input if this isn't the current focused element */
    let textInput = document.querySelector('#foreground-color input.free-value')
    if (textInput != document.activeElement) {
        textInput.value = colorMixed.hex()
        textInput.classList.toggle('invalid', false)
        textInput.classList.toggle('valid', false)
    }
}

function applyBackgroundColor () {
    let color = sharedObject.deficiencies.normal.backgroundColor
    let name = color.cssname()
    document.querySelector('#background-color').style.background = color.rgb().string()
    if (name) {
        document.querySelector('#background-color .name-value').innerHTML = '&nbsp;(' + name + ')'
    } else {
        document.querySelector('#background-color .name-value').innerHTML = null        
    }
    document.querySelector('#background-color').classList.toggle('darkMode', color.isDark())
    document.querySelector('#background-rgb .red input[type=range]').value = color.red()
    document.querySelector('#background-rgb .green input[type=range]').value = color.green()
    document.querySelector('#background-rgb .blue input[type=range]').value = color.blue()
    document.querySelector('#background-rgb .red input[type=number]').value = color.red()
    document.querySelector('#background-rgb .green input[type=number]').value = color.green()
    document.querySelector('#background-rgb .blue input[type=number]').value = color.blue()
    document.querySelector('#sample-preview .text').style.background = color.rgb().string()  
    document.querySelector('#sample-preview .icon').style.background = color.rgb().string()  

    /* Only change the text input if this isn't the current focused element */
    let textInput = document.querySelector('#background-color input.free-value')
    if (textInput != document.activeElement) {
        textInput.value = color.hex()
        textInput.classList.toggle('invalid', false)
        textInput.classList.toggle('valid', false)
    }
}

function applyContrastRatio () {
    let levelAA, levelAAico, levelAAA

    Object.keys(sharedObject.deficiencies).forEach(function(key, index) {
        if (key === 'normal') {
            if (this[key].levelAA === 'large') {
                levelAA = '<img src="icons/pass.svg" alt="" /> Pass AA for large text only <img src="icons/fail.svg" alt="" /> Fail for regular text'
                levelAAico = '<img src="icons/pass.svg" alt="" /> Pass AA for icons and UI components'
            } else if (this[key].levelAA === 'regular') {
                levelAA = '<img src="icons/pass.svg" alt="" /> Pass AA for large and regular text'
                levelAAico = '<img src="icons/pass.svg" alt="" /> Pass AA for icons and UI components'
            } else { // Fail
                levelAA = '<img src="icons/fail.svg" alt="" /> Fail AA large and regular text'
                levelAAico = '<img src="icons/fail.svg" alt="" /> Fail AA for icons and UI components'
            }
            if (this[key].levelAAA === 'large') {
                levelAAA = '<img src="icons/pass.svg" alt="" /> Pass AAA for large text only <img src="icons/fail.svg" alt="" /> Fail for regular text'
            } else if (this[key].levelAAA === 'regular') {
                levelAAA = '<img src="icons/pass.svg" alt="" /> Pass AAA for large and regular text'
            } else { // Fail
                levelAAA = '<img src="icons/fail.svg" alt="" /> Fail AAA large and regular text'
            }
            document.getElementById('contrast-ratio-value').innerHTML = this[key].contrastRatioString
            document.getElementById('contrast-level-1-4-3').innerHTML = levelAA   
            document.getElementById('contrast-level-1-4-11').innerHTML = levelAAico   
            document.getElementById('contrast-level-1-4-6').innerHTML = levelAAA   
        }
    }, sharedObject.deficiencies)
}

function validateForegroundText(value) {
    let string = value.toLowerCase().replace(/\s/g, "") // Clean input value
    let classList = document.querySelector('#foreground-color input').classList
    if (string) {
        let format = null
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
        if (format) {
            ipcRenderer.send('changeForeground', string, format)
            classList.toggle('invalid', false)
            classList.toggle('valid', true)
        } else {
            classList.toggle('invalid', true)
            classList.toggle('valid', false)
        }    
    } else {
        classList.toggle('invalid', false)
        classList.toggle('valid', false)
    }
}

function validateBackgroundText(value) {
    let string = value.toLowerCase().replace(/\s/g, "") // Clean input value
    let classList = document.querySelector('#background-color input').classList
    if (string) {
        let format = null
        if (Color.isHex(string)) {
            format = 'hex'
        } else if (Color.isRGB(string)) {
            format = 'rgb'
        } else if (Color.isHSL(string)) {
            format = 'hsl'
        } else if (Color.isName(string)) {
            format = 'name'
        }
        if (format) {
            ipcRenderer.send('changeBackground', string, format)
            classList.toggle('invalid', false)
            classList.toggle('valid', true)
        } else {
            classList.toggle('invalid', true)
            classList.toggle('valid', false)
        }    
    } else {
        classList.toggle('invalid', false)
        classList.toggle('valid', false)
    }
}

function displayLevelAAA() {
    document.body.classList.toggle('hideLevelAAA', !sharedObject.options.displayLevelAAA)
}