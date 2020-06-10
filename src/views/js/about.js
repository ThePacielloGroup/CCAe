const { ipcRenderer, shell } = require('electron')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-about'), false)

ipcRenderer.on('init', (event, config) => {
    document.querySelector('#cca-version').innerHTML = config.version

    translateHTML(config.i18n)
})

var externalLinks = document.querySelectorAll('.external-link')

Array.from(externalLinks).forEach(link => {
    var url = link.getAttribute('href')
    link.addEventListener('click', function(event) {
        shell.openExternal(url)
        event.preventDefault()
    })
});

ipcRenderer.on('langChanged', (event, i18n) => {
    translateHTML(i18n)
})

function translateHTML(i18n) {
    // translate html elements.
    document.title = i18n['Title']
    document.querySelector('h1').textContent = i18n['Colour Contrast Analyser (CCA)']

    document.querySelector('body > main > div > p:nth-child(1)').textContent
        = document.querySelector('body > main > div > p:nth-child(1)').textContent.replace('Version', i18n['Version'])
    document.querySelector('body > main > div > p:nth-child(3)').textContent
        = document.querySelector('body > main > div > p:nth-child(3)').textContent.replace('Developed by',i18n['Developed by'])

    document.querySelector('h2:nth-child(1)').textContent = i18n['Translations']

    document.querySelector('h2:nth-child(2)').textContent = i18n['External links']
    document.querySelector('body > main > ul > li:nth-child(1) > a').textContent = i18n['TPG Resources']
    document.querySelector('body > main > ul > li:nth-child(2) > a').textContent = i18n['Github page']
    document.querySelector('body > main > ul > li:nth-child(3) > a').textContent = i18n['Report an issue']
}