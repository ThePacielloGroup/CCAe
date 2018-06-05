const { ipcRenderer } = require('electron')
const sharedObjects = require('electron').remote.getGlobal('sharedObject')
const Color = require('../../CCAcolor')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

ipcRenderer.on('init', event => {
    var mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight)
    applyForegroundColor()
    applyBackgroundColor()
    applyContrastRatio()
    applyAdvancedResults()
    initEvents()
})

ipcRenderer.on('foregroundColorChanged', event => {
    applyForegroundColor()
    applyContrastRatio()
    applyAdvancedResults()
})

ipcRenderer.on('backgroundColorChanged', event => {
    applyBackgroundColor()
    applyContrastRatio()
    applyAdvancedResults()
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
    document.querySelector('#foreground-color .text').onclick = function() {showHide(this)}
    document.querySelector('#background-color .text').onclick = function() {showHide(this)}
    document.querySelector('#foreground-text input').oninput = function() {validateForegroundText(this.value)}
    document.querySelector('#background-text input').oninput = function() {validateBackgroundText(this.value)}
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
    let color = sharedObjects.normal.foregroundColor
    let colorMixed = sharedObjects.normal.foregroundColorMixed
    let name = colorMixed.cssname()
    document.querySelector('#foreground-color').style.background = colorMixed.rgb().string()  
    document.querySelector('#foreground-color .hex-value').innerHTML = colorMixed.hex()
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
    /* Clear the text input if this isn't the current focused element */
    let textInput = document.querySelector('#foreground-text input')
    if (textInput != document.activeElement) {
        textInput.value = ''
        textInput.classList.toggle('invalid', false)
        textInput.classList.toggle('valid', false)
    }

    /* Deficiency */
    Object.keys(sharedObjects).forEach(function(key, index) {
        document.getElementById('deficiency-' + key).style.color = this[key].foregroundColor.rgb().string()
        document.getElementById('deficiency-' + key + '-cr').innerHTML = this[key].contrastRatioString
        document.getElementById('deficiency-' + key + '-cb').innerHTML = this[key].backgroundColor.hex() + " | " + this[key].foregroundColor.hex()
    }, sharedObjects)
}

function applyBackgroundColor () {
    let color = sharedObjects.normal.backgroundColor
    let name = color.cssname()
    document.querySelector('#background-color').style.background = color.rgb().string()
    document.querySelector('#background-color .hex-value').innerHTML = color.hex()
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
    /* Clear the text input if this isn't the current focused element */
    let textInput = document.querySelector('#background-text input')
    if (textInput != document.activeElement) {
        textInput.value = ''
        textInput.classList.toggle('invalid', false)
        textInput.classList.toggle('valid', false)
    }

    /* Deficiency */
    Object.keys(sharedObjects).forEach(function(key, index) {
        document.getElementById('deficiency-' + key).style.background = this[key].backgroundColor.rgb().string()
        document.getElementById('deficiency-' + key + '-cr').innerHTML = this[key].contrastRatioString
        document.getElementById('deficiency-' + key + '-cb').innerHTML = this[key].backgroundColor.hex() + " | " + this[key].foregroundColor.hex()
    }, sharedObjects)
}

function applyContrastRatio () {
    let normal = sharedObjects.normal
    let cr = normal.contrastRatioString
    document.querySelector('#results #contrast-ratio .value').innerHTML = cr
    let levelAA, levelAAA
    if (normal.levelAA === 'large') {
        levelAA = '<img src="icons/pass.svg" alt="Pass" /> AA Large'
    } else if (normal.levelAA === 'regular') {
        levelAA = '<img src="icons/pass.svg" alt="Pass" /> AA'
    } else { // Fail
        levelAA = '<img src="icons/fail.svg" alt="Fail" /> AA'
    }
    if (normal.levelAAA === 'large') {
        levelAAA = '<img src="icons/pass.svg" alt="Pass" /> AAA Large'
    } else if (normal.levelAAA === 'regular') {
        levelAAA = '<img src="icons/pass.svg" alt="Pass" /> AAA'
    } else { // Fail
        levelAAA = '<img src="icons/fail.svg" alt="Fail" /> AAA'
    }
    document.querySelector('#results #level').innerHTML = levelAA + "<br/>" + levelAAA
}

function applyAdvancedResults() {
    document.querySelector('#advanced-results .text').innerHTML = sharedObjects.normal.advanced
}

function validateForegroundText(value) {
    let string = value.toLowerCase()
    let classList = document.querySelector('#foreground-text input').classList
    if (string) {
        let format = null
        if (Color.isHex(string)) {
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
    let string = value.toLowerCase()
    let classList = document.querySelector('#background-text input').classList
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
