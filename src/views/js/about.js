const { ipcRenderer, shell } = require('electron')

ipcRenderer.send('init-about');

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

