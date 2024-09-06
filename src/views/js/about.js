const { ipcRenderer, shell } = require('electron');
const store = require('../../store.js');
document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-about'), false)

ipcRenderer.on('init', async (event, config) => {
    document.querySelector('#cca-version').innerHTML = config.version
    const i18n = new(require('../../i18n'))(config.lang, config.localLang)
    translateHTML(i18n)
    store.get("colorScheme").then(theme=>{
        setColorScheme(theme);
    });
})

document.getElementById('close').addEventListener('click', () => {
    window.close();
});

var externalLinks = document.querySelectorAll('.external-link')

Array.from(externalLinks).forEach(link => {
    var url = link.getAttribute('href')
    link.addEventListener('click', function(event) {
        shell.openExternal(url)
        event.preventDefault()
    })
});

ipcRenderer.on('langChanged', (event, lang, localLang) => {
    const i18n = new(require('../../i18n'))(lang, localLang)
    translateHTML(i18n)
})

function translateHTML(i18n) {
    document.querySelector('html').lang = i18n.T('Main', 'lang');
    // translate html elements.
    document.title = i18n.T('About', 'Title');
    document.querySelector('h1#header-main').textContent = i18n.T('About', 'Colour Contrast Analyser (CCA)');
    document.querySelector('#i18n-version').textContent = i18n.T('About', 'Version');
    document.querySelector('#i18n-developed').textContent = i18n.T('About', 'Developed by');
    document.querySelector('#i18n-under').textContent = i18n.T('About', 'Under');
    document.querySelector('#i18n-nidrr').textContent = i18n.T('About', 'NIDRR');
    document.querySelector('h2#header-translations').textContent = i18n.T('About', 'Translations');
    document.querySelector('h2#header-exLinks').textContent = i18n.T('About', 'External links');
    document.querySelector('#close').textContent = i18n.T('Main', 'Close');
    const exLink_listitem = document.querySelectorAll('ul#list-exLinks > li > A');
    exLink_listitem[0].textContent = i18n.T('About', 'TPGi Resources');
    exLink_listitem[1].textContent = i18n.T('About', 'Github page');
    exLink_listitem[2].textContent = i18n.T('About', 'Report an issue');
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