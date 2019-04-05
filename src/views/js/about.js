const { ipcRenderer, shell } = require('electron')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-about'), false)

ipcRenderer.on('init', (event, config) => {
    document.querySelector('#cca-version').innerHTML = config.version
})

var externalLinks = document.querySelectorAll('.external-link')

Array.from(externalLinks).forEach(link => {
    var url = link.getAttribute('href')
    link.addEventListener('click', function(event) {
        shell.openExternal(url)
        event.preventDefault()
    })
});
