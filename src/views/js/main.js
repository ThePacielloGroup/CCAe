const { ipcRenderer } = require('electron')
const sharedObjects = require('electron').remote.getGlobal('sharedObject')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

ipcRenderer.on('init', event => {
    applyForegroundColor()
    applyBackgroundColor()
    applyContrastRatio()
    initInputs()
  })

ipcRenderer.on('foregroundColorChanged', event => {
    applyForegroundColor()
    applyContrastRatio()
})

ipcRenderer.on('backgroundColorChanged', event => {
    applyBackgroundColor()
    applyContrastRatio()
})

function initInputs () {
    // Opens color picker on button click
    document.querySelector('#foreground-color .picker').onclick = () => ipcRenderer.send('showForegroundPicker')
    document.querySelector('#background-color .picker').onclick = () => ipcRenderer.send('showBackgroundPicker')
    document.querySelector('#foreground-rgb .red input[type=range]').oninput = function() {ipcRenderer.send('changeForegroundRed', this.value)}
    document.querySelector('#foreground-rgb .green input[type=range]').oninput = function() {ipcRenderer.send('changeForegroundGreen', this.value)}
    document.querySelector('#foreground-rgb .blue input[type=range]').oninput = function() {ipcRenderer.send('changeForegroundBlue', this.value)}
    document.querySelector('#background-rgb .red input[type=range]').oninput = function() {ipcRenderer.send('changeBackgroundRed', this.value)}
    document.querySelector('#background-rgb .green input[type=range]').oninput = function() {ipcRenderer.send('changeBackgroundGreen', this.value)}
    document.querySelector('#background-rgb .blue input[type=range]').oninput = function() {ipcRenderer.send('changeBackgroundBlue', this.value)}
    document.querySelector('#foreground-rgb .red input[type=number]').oninput = function() {ipcRenderer.send('changeForegroundRed', this.value)}
    document.querySelector('#foreground-rgb .green input[type=number]').oninput = function() {ipcRenderer.send('changeForegroundGreen', this.value)}
    document.querySelector('#foreground-rgb .blue input[type=number]').oninput = function() {ipcRenderer.send('changeForegroundBlue', this.value)}
    document.querySelector('#background-rgb .red input[type=number]').oninput = function() {ipcRenderer.send('changeBackgroundRed', this.value)}
    document.querySelector('#background-rgb .green input[type=number]').oninput = function() {ipcRenderer.send('changeBackgroundGreen', this.value)}
    document.querySelector('#background-rgb .blue input[type=number]').oninput = function() {ipcRenderer.send('changeBackgroundBlue', this.value)}
    document.querySelector('#foreground-color .rgb').onclick = function() {showHide(this)}
    document.querySelector('#background-color .rgb').onclick = function() {showHide(this)}
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
}

function applyForegroundColor () {
    let color = sharedObjects.foregroundColor
    let name = color.cssname()
    document.querySelector('#foreground-color').style.background = color.rgb().string()  
    document.querySelector('#foreground-color .hex-value').innerHTML = color.hex()
    if (name) {
        document.querySelector('#foreground-color .name-value').innerHTML = '&nbsp;(' + name + ')'
    } else {
        document.querySelector('#foreground-color .name-value').innerHTML = null        
    }
    document.querySelector('#foreground-color').classList.toggle('darkMode', color.isDark())
    document.querySelector('#foreground-rgb .red input[type=range]').value = color.red()
    document.querySelector('#foreground-rgb .green input[type=range]').value = color.green()
    document.querySelector('#foreground-rgb .blue input[type=range]').value = color.blue()
    document.querySelector('#foreground-rgb .red input[type=number]').value = color.red()
    document.querySelector('#foreground-rgb .green input[type=number]').value = color.green()
    document.querySelector('#foreground-rgb .blue input[type=number]').value = color.blue()
    document.querySelector('#sample-preview .text').style.color = color.rgb().string()  
}

function applyBackgroundColor () {
    let color = sharedObjects.backgroundColor
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
}

function applyContrastRatio () {
    let cr = sharedObjects.contrastRatioString
    document.querySelector('#contrast-ratio .value').innerHTML = cr
}