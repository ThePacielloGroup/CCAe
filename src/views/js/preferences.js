const { ipcRenderer } = require('electron')
const store = require('../../store.js')
let i18n;

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-preferences'), false)
ipcRenderer.on('init', async (event, config) => {
    const theme = await store.get("colorScheme");
    const rounding = await store.get('rounding')
    setColorScheme(theme)
    document.getElementById('option-rounding').value = rounding
    const checkForUpdates = await store.get('checkForUpdates')
    document.getElementById('option-checkForUpdates').checked = checkForUpdates
    const lang = await store.get('lang')
    document.getElementById('option-lang').value = lang
    document.getElementById('option-theme').value = theme
    const foregroundPickerShortcut = await store.get('foreground.picker.shortcut')
    document.getElementById('shortcut-foreground-picker').value = foregroundPickerShortcut
    const backgroundPickerShortcut = await store.get('background.picker.shortcut')
    document.getElementById('shortcut-background-picker').value = backgroundPickerShortcut

    if (process.platform === 'win32' || process.platform === 'win64' || /^(msys|cygwin)$/.test(process.env.OSTYPE)) {
        document.getElementById('option-picker-group').hidden = true
    } else {
        const picker = await store.get('picker')
        document.getElementById('option-picker').value = picker
    }
    const regularResultsTemplate = await store.get('copy.regularTemplate');
    document.getElementById('copy-regular-results-template').textContent = replaceTemplateValues(config.i18n, regularResultsTemplate)
    const shortResultsTemplate = await store.get('copy.shortTemplate')
    document.getElementById('copy-short-results-template').textContent = replaceTemplateValues(config.i18n, shortResultsTemplate)
    i18n = config.i18n;
    translateHTML(i18n);
})


document.getElementById('save').addEventListener('click', function () {
    const rounding = document.getElementById('option-rounding').value;
    store.set('rounding', parseInt(rounding));
    const checkForUpdates = document.getElementById('option-checkForUpdates').checked;
    store.set('checkForUpdates', checkForUpdates);
    const lang = document.getElementById('option-lang').value;
    store.set('lang', lang);
    const theme = document.getElementById('option-theme').value;
    store.set('colorScheme', theme);
    const foregroundPickerShortcut = document.getElementById('shortcut-foreground-picker').value;
    store.set('foreground.picker.shortcut', foregroundPickerShortcut);
    const backgroundPickerShortcut = document.getElementById('shortcut-background-picker').value;
    store.set('background.picker.shortcut', backgroundPickerShortcut);

    if (!(process.platform === 'win32' || process.platform === 'win64' || /^(msys|cygwin)$/.test(process.env.OSTYPE))) {
        const picker = document.getElementById('option-picker').value;
        store.set('picker', parseInt(picker));
    }

    const regularResultsTemplate = document.getElementById('copy-regular-results-template').value;
    const shortResultsTemplate = document.getElementById('copy-short-results-template').value;
    store.set('copy.regularTemplate', regularResultsTemplate);
    store.set('copy.shortTemplate', shortResultsTemplate);
    close();
});

document.getElementById("reset-regular-text").addEventListener("click",async function(){
    const regularText = "%i18n.f%: %f.hex%\n\
%i18n.b%: %b.hex%\n\
%i18n.cr%: %cr%:1\n\
    %i18n.1.4.3%\n\
        %1.4.3%\n\
    %i18n.1.4.6%\n\
        %1.4.6%\n\
    %i18n.1.4.11%\n\
        %1.4.11%";
    document.getElementById('copy-regular-results-template').value = replaceTemplateValues(i18n, regularText);
});
document.getElementById("reset-short-text").addEventListener("click",async function(){
    const shortText = "%i18n.f%: %f.hex%\n\
%i18n.b%: %b.hex%\n\
%i18n.cr%: %cr%:1";
    document.getElementById('copy-short-results-template').value = replaceTemplateValues(i18n, shortText);
});

document.getElementById('cancel').addEventListener('click', function () {
    close();
});

function close() {window.close();}

/** 
 * @function translateHTML
 * @typedef {import('../translations/en.json')} I18N
 * @param {I18N} _i18n
 * @returns {void}
 * @description translate html elements.
*/
function translateHTML(_i18n) {
    const i18n = _i18n["Preferences"];
    document.title = i18n['Title'];
    document.querySelector('h1').textContent = i18n['Preferences'];

    /* Options fieldset */
    document.querySelector('fieldset#options>legend').textContent = i18n['Options'];   
    // Rounding Precision
    document.querySelector('label[for="option-rounding"]').textContent = i18n['Contrast ratio precision'];
    document.querySelectorAll('#option-rounding > option').forEach((opt,idx)=>{
        const optNum = idx+1;
        switch(idx){
            case 0:
                opt.textContent = i18n[`${optNum} decimal place`];
                break;
            case 1:
                opt.textContent = i18n[`${optNum} decimal places`];
                break;
        }
    });

    // Check for update
    document.querySelector('label[for="option-checkForUpdates"] span').innerText = i18n["Enable update checking"];

    // Language
    document.querySelector('label[for="option-lang"]').textContent = i18n['Language'];
    document.querySelector('#option-lang>option:first-child').textContent = i18n["System (Default)"];

    // Apllication Theme
    document.querySelector('label[for="option-theme"]').textContent = i18n['Application Theme'];
    document.querySelectorAll('#option-theme>option').forEach((opt,idx)=>{
        switch(idx) {
            case 0:
                opt.textContent = i18n["System (Default)"];
                break;
            case 1:
                opt.textContent = i18n["Light"];
                break;
            case 2:
                opt.textContent = i18n["Dark"];
                break;
        }
    });
    
    // Color Picker Type
    document.querySelector('label[for="option-picker"]').textContent = i18n['Color Picker type'];
    document.querySelectorAll("#option-picker > option").forEach((option,index)=>{
        switch(index){
            case 0:
                option.innerText = i18n["Electron"];
                break;
            case 1:
                option.innerText = i18n["Add-on"];
                break;
        }
    })

    /* Shortcuts fieldset */
    document.querySelector('fieldset#shortcuts > legend').textContent = i18n['Shortcuts']
    // background, foreground picker
    document.querySelector('label[for="shortcut-background-picker"]').textContent = i18n['Picker foreground'];
    document.querySelector('label[for="shortcut-foreground-picker"]').textContent = i18n['Picker background'];
    
    document.querySelector('fieldset#copy > legend').textContent = i18n['Copy results'];
    /* Copy results fieldset */
    document.querySelectorAll("#copy-format-example>li>span").forEach((el,idx)=>{
        const i18nTexts = [i18n["Foreground colour in hexa format"],
        i18n['Background colour in hexa format'],
        i18n["Contrast ratio (raw)"],
        i18n["Contrast ratio (rounded)"],
        _i18n.Main['1.4.3 Contrast (Minimum) (AA)'],
        _i18n.Main['1.4.6 Contrast (Enhanced) (AAA)'],
        _i18n.Main['1.4.11 Non-text Contrast (AA)']]
        el.textContent = i18nTexts[idx];
    })

    document.querySelector("label[for=copy-regular-results-template]").textContent = i18n["Regular results template"];
    document.querySelector("label[for=copy-short-results-template]").textContent = i18n["Short results template"];
    const [reset_regular,reset_short] = [document.querySelector("#reset-regular-text"),document.querySelector("#reset-short-text")]
    reset_regular.textContent = i18n["Reset"];
    reset_short.textContent = i18n["Reset"];
    reset_regular.setAttribute('aria-description',i18n["Regular results template"]);
    reset_short.setAttribute('aria-description',i18n["Reset results template"]);
    
    // Save, Cancel button
    document.getElementById('save').innerText = i18n['Save'];
    document.getElementById('cancel').innerText = i18n['Cancel'];
}

/**
 * @function setColorScheme
 * @param {("system"|"force-dark"|"force-light")} scheme
 * @return {void}
 * @description Function to add or remove the HTML class for supporting application theme
*/
function setColorScheme ( scheme ) {
    switch (scheme) {
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

/**
 * @function replaceTemplateValues
 * @param {import("../translations/en.json")} i18n
 * @param {string} template
 * @returns {string}
 * @description Function to apply internationalized string to a result of CopyResult feature.
 */
function replaceTemplateValues(i18n, template) {
    for (const item of [
        ['%i18n.f%', i18n.CopyPaste["Foreground"]],
        ['%i18n.b%', i18n.CopyPaste["Background"]],
        ['%i18n.cr%', i18n.Main["Contrast ratio"]],
        ['%i18n.1.4.3%', i18n.Main["1.4.3 Contrast (Minimum) (AA)"]],
        ['%i18n.1.4.6%', i18n.Main["1.4.6 Contrast (Enhanced) (AAA)"]],
        ['%i18n.1.4.11%', i18n.Main["1.4.11 Non-text Contrast (AA)"]],
    ]) {
        template = template.replaceAll(item[0], item[1]);
    }
    return template;
}