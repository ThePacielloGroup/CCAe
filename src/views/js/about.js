const { ipcRenderer, shell } = require('electron');
const store = require('../../store.js');
document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-about'), false)

ipcRenderer.on('init', async (event, config) => {
    document.querySelector('#cca-version').innerHTML = config.version
    translateHTML(config.i18n)
    store.get("colorScheme").then(theme=>{
        setColorScheme(theme);
    });
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
    document.title = i18n['Title'];
    document.querySelector('h1#header-main').textContent = i18n['Colour Contrast Analyser (CCA)'];
    document.querySelector('#i18n-version').textContent = i18n['Version'];
    document.querySelector('#i18n-developed').textContent = i18n['Developed by'];
    document.querySelector('h2#header-translations').textContent = i18n['Translations'];
    document.querySelector('h2#header-exLinks').textContent = i18n['External links'];
    const exLink_listitem = document.querySelectorAll('ul#list-exLinks > li > A');
    exLink_listitem[0].textContent = i18n['TPG Resources'];
    exLink_listitem[1].textContent = i18n['Github page'];
    exLink_listitem[2].textContent = i18n['Report an issue'];
}

function setColorScheme (v) {
    switch (v) {
        case "system":
            document.documentElement.classList.remove('force-dark','force-light');
            document.documentElement.classList.add("system")
        break;
        case "force-dark":
            document.documentElement.classList.remove('force-light','system');
            document.documentElement.classList.add("force-dark");
            break;
        case "force-dark":
            document.documentElement.classList.remove('force-light','system');
            document.documentElement.classList.add("force-dark");
            break;
        case "force-light":
            document.documentElement.classList.remove('force-dark','system');
            document.documentElement.classList.add('force-light');
        break;
    }
};