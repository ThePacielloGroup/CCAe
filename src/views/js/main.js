const { ipcRenderer } = require('electron')
const isMacOS = process.platform === 'darwin'
const CCAColor = require('../../color/CCAcolor.js')
const store = require('../../store.js')
let i18n, pickerShortcutForeground, pickerShortcutBackground
document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('init-app')
    document.body.addEventListener("keydown",(evt)=>{
        // keyboard event for switch color by Ctrl-Tab on main view
        if(evt.ctrlKey && evt.code == "Tab"){
            evt.preventDefault();
            document.querySelector("button.switch").click();
        }

        //keyboard event for copy results announcement
        const ctrlOrCmd = isMacOS ? evt.metaKey : evt.ctrlKey;
        if(ctrlOrCmd && evt.shiftKey && evt.code == "KeyC"){
            evt.preventDefault();
            announceForAccessibility(i18n["messages"]["Results copied."]);
        }

        if(ctrlOrCmd && evt.altKey && evt.code == "KeyC"){
            evt.preventDefault();
            announceForAccessibility(i18n["messages"]["Short results copied."]);
        }

        //keyboard event for colorpickers
        if (pickerShortcutForeground && evt.code == pickerShortcutForeground){
            evt.preventDefault();
            ipcRenderer.send('getColorFromPicker', 'foreground')
        }
        if (pickerShortcutBackground && evt.code == pickerShortcutBackground){
            evt.preventDefault();
            ipcRenderer.send('getColorFromPicker', 'background')
        }
    })
}, false);

const announceForAccessibility = (message)=>{
    const srAnnouncer = document.querySelector(".sr-announcer");
    srAnnouncer.innerHTML=`<p>${message}</p>`;
    let sendAnnouncement = setTimeout(()=>{
        clearTimeout(sendAnnouncement);
        srAnnouncer.innerHTML = "";
    },300);
}

ipcRenderer.on('init', async (event, config) => {
    i18n = config.i18n
    translateHTML(i18n)
    const theme = await store.get("colorScheme");
    setColorScheme(theme);
    // init format selector
    const foregroundFormat = await store.get('foreground.format')
    document.querySelector('#foreground-color .format-selector').value = foregroundFormat
    const backgroundFormat = await store.get('background.format')
    document.querySelector('#background-color .format-selector').value = backgroundFormat

    // init sliders state
    const foregroundSlidersOpen = await store.get('foreground.sliders.open')
    showHide(document.querySelector('#foreground-color .sliders'), foregroundSlidersOpen)
    const backgroundSlidersOpen = await store.get('background.sliders.open')
    showHide(document.querySelector('#background-color .sliders'), backgroundSlidersOpen)

    // init tabs
    const foregroundSlidersTab = await store.get('foreground.sliders.tab')
    const fgTab = document.querySelector(`#foreground-sliders a[data-tab="${foregroundSlidersTab}"]`)
    fgTab.setAttribute('aria-selected', 'true');
    const fgControls = fgTab.getAttribute('aria-controls');
    document.getElementById(fgControls).removeAttribute('hidden');
    const backgroundSlidersTab = await store.get('background.sliders.tab')
    const bgTab = document.querySelector(`#background-sliders a[data-tab="${backgroundSlidersTab}"]`)
    bgTab.setAttribute('aria-selected', 'true');
    const bgControls = bgTab.getAttribute('aria-controls');
    document.getElementById(bgControls).removeAttribute('hidden');

    const mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight)

    initTabs("#foreground-sliders", (el)=>{
        store.set('foreground.sliders.tab', el.getAttribute('data-tab'))
        const mainHeight = document.querySelector('main').clientHeight
        ipcRenderer.send('height-changed', mainHeight)
    })
    initTabs("#background-sliders", (el)=>{
        store.set('background.sliders.tab', el.getAttribute('data-tab'))
        const mainHeight = document.querySelector('main').clientHeight
        ipcRenderer.send('height-changed', mainHeight)
    })

    initEvents()

    // Init shortcuts
    pickerShortcutForeground = await store.get("foreground.picker.shortcut")
    pickerShortcutBackground = await store.get("background.picker.shortcut")
})

ipcRenderer.on('configChanged', (event, key, value) => {
    switch (key) {
        case "foreground.picker.shortcut":
            pickerShortcutForeground = value
            break
        case "background.picker.shortcut":
            pickerShortcutBackground = value
            break
    }
})

ipcRenderer.on('colorChanged', (event, section, color) => {
    applyColor(section, color)
})

ipcRenderer.on('contrastRatioChanged', (event, contrastRatio) => {
    applyContrastRatio(contrastRatio)
})

ipcRenderer.on('colorSchemeChanged',async (event,newScheme)=>{
    setColorScheme(newScheme);
})

ipcRenderer.on('langChanged', (event, i18nNew) => {
    i18n = i18nNew
    translateHTML(i18n)
    //TODO applyContrastRatio()
})

ipcRenderer.on('pickerToggled', (event, section, state) => {
    document.querySelector('#' + section + '-color .picker').setAttribute('aria-pressed', state)
})

ipcRenderer.on('showPicker', (event, section) => {
    const eyeDropper = new EyeDropper();
    eyeDropper.open()
        .then((returned)=>{
            ipcRenderer.send('colorFromPicker', section, returned.sRGBHex)
        })
        .catch((error)=>{
            console.log(error)
            ipcRenderer.send('colorFromPicker', section, null)
        })
})

function initEvents () {
    // Opens color picker on button click
    document.querySelector('#foreground-color .picker').onclick = () => ipcRenderer.send('getColorFromPicker', 'foreground')
    document.querySelector('#background-color .picker').onclick = () => ipcRenderer.send('getColorFromPicker', 'background')
    document.querySelector('#foreground-color .sliders').onclick = function() {showHideSliders('foreground', this)};
    document.querySelector('#background-color .sliders').onclick = function() {showHideSliders('background', this)};
    document.querySelector('#foreground-color input').oninput = function() {validateForegroundText(this.value)};
    document.querySelector('#background-color input').oninput = function() {validateBackgroundText(this.value)};

    document.querySelectorAll('input[type=text], input[type=number]').forEach(function(el) { el.onfocus = function() {this.select()} });
    document.querySelector('#foreground-color input').onblur = function() {leaveText('foreground', this)};
    document.querySelector('#background-color input').onblur = function() {leaveText('background', this)};
    document.querySelector('#foreground-color .help').onclick = function() {showHide(this)};
    document.querySelector('#background-color .help').onclick = function() {showHide(this)};
    document.querySelector('#foreground-color .format-selector').onchange = function() {changeFormat('foreground', this)};
    document.querySelector('#background-color .format-selector').onchange = function() {changeFormat('background', this)};

    // screen reader announcement for screen reader user.
    document.querySelector('#foreground-color .switch').addEventListener("click",function() { 
        ipcRenderer.send('switchColors');
        const message=`${i18n["messages"]["Between the background and foreground colors have swapped."]}
        ${i18n["Foreground colour"]}:${document.querySelector("#foreground-color .free-value").value}
        ${i18n["Background colour"]}:${document.querySelector("#background-color .free-value").value}`;
        announceForAccessibility(message);  
    });


    // Refactoried to minimize line for input event.
    [...document.querySelectorAll(".slider-rgb"),
    ...document.querySelectorAll(".slider-hsl"),
    ...document.querySelectorAll(".slider-hsv")].forEach((sliderWrap)=>{
        const contains = (token)=>sliderWrap.classList.contains(token);
        const [slider,spin] = [sliderWrap.querySelector("input[type=range]"),sliderWrap.querySelector("input[type=number]")];
        const colorType = (sliderWrap.closest(`[id^="foreground"]`) ? true : false) ? "foreground" : "background";
        const formatType = contains("slider-rgb") ? "rgb" : contains("slider-hsl") ? "hsl" : "hsv";
        const onInputFuncs = (()=>{
            switch(formatType){
            case "rgb":
                return [sliderRGBOnInput,numberRGBOnInput];
            case "hsl":
                return [sliderHSLOnInput,numberHSLOnInput];
            case "hsv":
                return [sliderHSVOnInput,numberHSVOnInput];
        }})();
        const [onSliderInput,onNumberInput] = onInputFuncs;
        // You make sure you understand we haven't to change sub class order.
        slider.oninput = ()=>onSliderInput(colorType, sliderWrap.classList[2], slider.value);
        spin.oninput = ()=>onNumberInput(colorType, sliderWrap.classList[2], spin.value);
    });

    // init Details
    document.querySelectorAll('details').forEach(function(details) {
        details.ontoggle = function() {
        var mainHeight = document.querySelector('main').clientHeight
            ipcRenderer.send('height-changed', mainHeight)
        }
    });
}

function sliderRGBOnInput(section, component, value) {
    let sync = document.querySelector('#' + section + '-rgb .sync input[type=checkbox]').checked
    ipcRenderer.send('changeFromRGBComponent', section, component, value, sync)
}

function numberRGBOnInput(section, component, value) {
    ipcRenderer.send('changeFromRGBComponent', section, component, value)
}

function sliderHSLOnInput(section, component, value) {
    ipcRenderer.send('changeFromHSLComponent', section, component, value)
}

function numberHSLOnInput(section, component, value) {
    ipcRenderer.send('changeFromHSLComponent', section, component, value)
}

function sliderHSVOnInput(section, component, value) {
    ipcRenderer.send('changeFromHSVComponent', section, component, value)
}

function numberHSVOnInput(section, component, value) {
    ipcRenderer.send('changeFromHSVComponent', section, component, value)
}

function showHideSliders(section, el) {
    let state = (el.getAttribute('aria-expanded') === 'true')
    store.set(`${section}.sliders.open`, !state)
    showHide(el)
}

function showHide(el, force) {
    let controls = document.querySelector('#' + el.getAttribute('aria-controls'))
    var state = (el.getAttribute('aria-expanded') === 'true')
    if (force != null) {
        state = !force
    }
    if (state) {
        controls.setAttribute('hidden', '')
        el.setAttribute('aria-expanded', false)
    } else {
        controls.removeAttribute('hidden')
        el.setAttribute('aria-expanded', true)
    }
    var mainHeight = document.querySelector('main').clientHeight;
    ipcRenderer.send('height-changed', mainHeight);
}

function applyColor(section, color) {
    applyColorPreview(section, color)
    applyColorTextString(section, color)
    applyColorRGBSliders(section, color)
    applyColorHSLSliders(section, color)
    applyColorHSVSliders(section, color)
    applyColorSample(section, color)
}

async function applyColorTextString(section, color) {
    /* Only change the text input if this isn't the current focused element */
    const textInput = document.querySelector('#' + section + '-color input.free-value')
    if (textInput != document.activeElement) {
        textInput.value = color.string
        const formatSelector =  document.querySelector('#' + section + '-format-selector')
        const freeFormat =  document.querySelector('#' + section + '-free-format')    
        textInput.removeAttribute('aria-invalid')
        freeFormat.removeAttribute('aria-live')
        freeFormat.innerHTML = color.format.toUpperCase() + " format"
        formatSelector.style.display = "block";
    }
}

function applyColorPreview(section, color) {
    document.querySelector('#' + section + '-color').style.background = color.rgb
    if (color.name) {
        document.querySelector('#' + section + '-color .name-value').innerHTML = '&nbsp;(' + color.name + ')'
    } else {
        document.querySelector('#' + section + '-color .name-value').innerHTML = null        
    }

    document.querySelector('#' + section + '-color').classList.toggle('black',!color.isDark)
    document.querySelector('#' + section + '-color').classList.toggle('white',color.isDark)
}

function applyColorRGBSliders(section, color) {
    document.querySelector('#' + section + '-rgb .red input[type=range]').value = color.red
    document.querySelector('#' + section + '-rgb .green input[type=range]').value = color.green
    document.querySelector('#' + section + '-rgb .blue input[type=range]').value = color.blue
    document.querySelector('#' + section + '-rgb .red input[type=number]').value = color.red
    document.querySelector('#' + section + '-rgb .green input[type=number]').value = color.green
    document.querySelector('#' + section + '-rgb .blue input[type=number]').value = color.blue
    if (section === 'foreground') {
        document.querySelector('#' + section + '-rgb .alpha input[type=range]').value = color.alpha
        if (document.activeElement != document.querySelector('#' + section + '-rgb .alpha input[type=number]')) {
            /* only force update of the alpha number input if it's not current;y focused
               as otherwise, when user enters "0.", it's corrected to "0" and prevents correct text entry */
            document.querySelector('#' + section + '-rgb .alpha input[type=number]').value = color.alpha
        }
    }
}

function applyColorHSLSliders(section, color) {
    document.querySelector('#' + section + '-hsl .hue input[type=range]').value = color.hue
    document.querySelector('#' + section + '-hsl .saturationl input[type=range]').value = color.saturationl
    document.querySelector('#' + section + '-hsl .lightness input[type=range]').value = color.lightness
    document.querySelector('#' + section + '-hsl .hue input[type=number]').value = color.hue
    document.querySelector('#' + section + '-hsl .saturationl input[type=number]').value = color.saturationl
    document.querySelector('#' + section + '-hsl .lightness input[type=number]').value = color.lightness
    if (section === 'foreground') {
        document.querySelector('#' + section + '-hsl .alpha input[type=range]').value = color.alpha
        if (document.activeElement != document.querySelector('#' + section + '-hsl .alpha input[type=number]')) {
            /* only force update of the alpha number input if it's not current;y focused
               as otherwise, when user enters "0.", it's corrected to "0" and prevents correct text entry */
            document.querySelector('#' + section + '-hsl .alpha input[type=number]').value = color.alpha
        }
    }
}

function applyColorHSVSliders(section, color) {
    document.querySelector('#' + section + '-hsv .hue input[type=range]').value = color.hue
    document.querySelector('#' + section + '-hsv .saturationv input[type=range]').value = color.saturationv
    document.querySelector('#' + section + '-hsv .value input[type=range]').value = color.value
    document.querySelector('#' + section + '-hsv .hue input[type=number]').value = color.hue
    document.querySelector('#' + section + '-hsv .saturationv input[type=number]').value = color.saturationv
    document.querySelector('#' + section + '-hsv .value input[type=number]').value = color.value
    if (section === 'foreground') {
        document.querySelector('#' + section + '-hsv .alpha input[type=range]').value = color.alpha
        if (document.activeElement != document.querySelector('#' + section + '-hsv .alpha input[type=number]')) {
            /* only force update of the alpha number input if it's not current;y focused
               as otherwise, when user enters "0.", it's corrected to "0" and prevents correct text entry */
            document.querySelector('#' + section + '-hsv .alpha input[type=number]').value = color.alpha
        }
    }
}

function applyColorSample(section, color) {
    if (section === 'foreground') {
        document.querySelector('#sample-preview .text').style.color = color.rgb
        document.querySelector('#sample-preview .icon svg').style.stroke = color.rgb    
    } else {
        document.querySelector('#sample-preview .text').style.background = color.rgb
        document.querySelector('#sample-preview .icon').style.background = color.rgb
    }
}

function applyContrastRatio(contrastRatio) {
    let level_1_4_3, level_1_4_6, level_1_4_11
    if (contrastRatio.levelAA === 'large') {
        level_1_4_3 = `<div><img src="icons/fail.svg" alt="" /> ${i18n['Fail']} (${i18n['regular text']})</div><div><img src="icons/pass.svg" alt="" /> ${i18n['Pass']} (${i18n['large text']})</div>`
        level_1_4_11 = `<div><img src="icons/pass.svg" alt="" /> ${i18n['Pass']} (${i18n['UI components and graphical objects']})</div>`
    } else if (contrastRatio.levelAA === 'regular') {
        level_1_4_3 = `<div><img src="icons/pass.svg" alt="" /> ${i18n['Pass']} (${i18n['regular text']})</div><div><img src="icons/pass.svg" alt="" /> ${i18n['Pass']} (${i18n['large text']})</div>`
        level_1_4_11 = `<div><img src="icons/pass.svg" alt="" /> ${i18n['Pass']} (${i18n['UI components and graphical objects']})</div>`
    } else { // Fail
        level_1_4_3 = `<div><img src="icons/fail.svg" alt="" /> ${i18n['Fail']} (${i18n['regular text']})</div><div><img src="icons/fail.svg" alt="" /> ${i18n['Fail']} (${i18n['large text']})</div>`
        level_1_4_11 = `<div><img src="icons/fail.svg" alt="" /> ${i18n['Fail']} (${i18n['UI components and graphical objects']})</div>`
    }
    if (contrastRatio.levelAAA === 'large') {
        level_1_4_6 = `<div><img src="icons/fail.svg" alt="" /> ${i18n['Fail']} (${i18n['regular text']})</div><div><img src="icons/pass.svg" alt="" /> ${i18n['Pass']} (${i18n['large text']})</div>`
    } else if (contrastRatio.levelAAA === 'regular') {
        level_1_4_6 = `<div><img src="icons/pass.svg" alt="" /> ${i18n['Pass']} (${i18n['regular text']})</div><div><img src="icons/pass.svg" alt="" /> ${i18n['Pass']} (${i18n['large text']})</div>`
    } else { // Fail
        level_1_4_6 = `<div><img src="icons/fail.svg" alt="" /> ${i18n['Fail']} (${i18n['regular text']})</div><div><img src="icons/fail.svg" alt="" /> ${i18n['Fail']} (${i18n['large text']})</div>`
    }

    let cr = contrastRatio.raw
    let crr = contrastRatio.rounded.toLocaleString(i18n.lang)
    let r = contrastRatio.rounding
    // toLocalString removes trailing zero and use the correct decimal separator, based on the app select lang.
    contrastRatioString = `${crr}:1`
    if (((r == 1) && ((cr >= 6.95 && cr < 7) || (cr >= 4.45 && cr < 4.5) || (cr >= 2.95 && cr < 3))) || 
        ((r == 2) && ((cr >= 6.995 && cr < 7) || (cr >= 4.495 && cr < 4.5) || (cr >= 2.995 && cr < 3)))) {
        let crr3 = cr.toLocaleString(i18n.lang)
        contrastRatioString = `<span class="smaller">${i18n["just below"]} </span>${crr}:1<span class="smaller"> (${crr3}:1)</span>`
    }

    document.getElementById('contrast-ratio-value').innerHTML = contrastRatioString
    document.getElementById('contrast-level-1-4-3').innerHTML = level_1_4_3
    document.getElementById('contrast-level-1-4-6').innerHTML = level_1_4_6
    document.getElementById('contrast-level-1-4-11').innerHTML = level_1_4_11
}

function validateForegroundText(value) {
    let formats = ["hex", "hexa", "rgb", "rgba", "hsl", "hsla", "hsv", "hsva", "name"]
    validateText('foreground', value, formats)
}

function validateBackgroundText(value) {
    let formats = ["hex", "rgb", "hsl", "hsv", "name"]
    validateText('background', value, formats)
}

function validateText(section, value, formats) {
    const string = value.toLowerCase().replace(/\s/g, "") // Clean input value
    let format = null
    if (string) {
        for (let i = 0; i < formats.length; ++i) {
            let f = formats[i];
            if (CCAColor.is(f, string)) {
                format = f
                break
            }
        }
    }
    if (format) {
        store.set(`${section}.format`, format)
    }
    displayValidate(section, format, string)
}

function displayValidate(section, format, string) {
    const input = document.querySelector('#' + section + '-color input')
    const formatSelector =  document.querySelector('#' + section + '-format-selector')
    const freeFormat =  document.querySelector('#' + section + '-free-format')
    if (!freeFormat.getAttribute('aria-live')) {
        freeFormat.setAttribute('aria-live', 'polite')
    }
    if (format) {
        ipcRenderer.send('changeFromString', section, string, format)
        input.setAttribute('aria-invalid', false)
        formatSelector.value = format.toLowerCase()
        formatSelector.style.display = "block"
        freeFormat.innerHTML = format + ' format detected'
    } else {
        input.setAttribute('aria-invalid', true)
        formatSelector.style.display = "none"
        freeFormat.innerHTML = null
    }
}

function leaveText(section, el) {
    if (el.getAttribute('aria-invalid') === 'true') {
        const freeFormat =  document.querySelector('#' + section + '-free-format')
        if (freeFormat.getAttribute('aria-live')) {
            freeFormat.innerHTML = 'Error, Incorrect ' + section + ' format'
        }
    } else {
        let color = sharedObject.deficiencies.normal[section + "Color"]
        applyColorTextString(section, color)
    }
}

function changeFormat(section, el) {
    // We send the selected format to the controller for saving and sharedObject update
    store.set(`${section}.format`, el.value)
}

function translateHTML(i18n) {

    // translate html elements.
    document.querySelector('html').lang = i18n['lang']
    document.querySelector('title').textContent = i18n['Title']
    document.querySelector('h1').textContent = i18n['CCA Main windows']

    // Color Controls

    document.querySelector('#foreground-color .switch').setAttribute('aria-label', i18n['Switch Colours']);
    document.querySelector('#foreground-color .switch').setAttribute('title', i18n['Switch Colours']);

    document.querySelector('#foreground-color .sliders').setAttribute('title', i18n['Colour sliders']);
    document.querySelector('#foreground-color .picker').setAttribute('title', i18n['Colour picker']);
    document.querySelector('#foreground-color .help').setAttribute('title', i18n['Help']);
    document.querySelector('#foreground-color .sliders').setAttribute('aria-label', i18n['Foreground colour sliders']);
    document.querySelector('#foreground-color .picker').setAttribute('aria-label', i18n['Foreground colour picker']);
    document.querySelector('#foreground-color .help').setAttribute('aria-label', i18n['Foreground help']);

    document.querySelector('#foreground-color h2').textContent = i18n['Foreground colour']
    document.querySelector('#foreground-format-selector').setAttribute('aria-label', i18n['Select default format for foreground colour']);
    document.querySelector('#foreground-format-selector+input').setAttribute('aria-label', i18n['Foreground colour value']);

    document.querySelector('#foreground-help > .title').textContent = i18n['Supported formats are']
    document.querySelector('#foreground-help > ul > li.names').textContent = i18n['Names']

    document.querySelector('#foreground-rgb h2').textContent = i18n['Foreground RGB input']
    document.querySelector('#foreground-hsl > h2').textContent = i18n['Foreground HSL input']
    document.querySelector('#foreground-hsv > h2').textContent = i18n['Foreground HSV input']

    document.querySelector('#foreground-rgb > div.sync > label > span').textContent = i18n['Synchronize colour values']
    document.querySelector('#foreground-rgb > div.sync > label').setAttribute('aria-label',i18n['Synchronize foreground colour values'])

    document.querySelector('#background-color .sliders').setAttribute('title', i18n['Colour sliders']);
    document.querySelector('#background-color .picker').setAttribute('title', i18n['Colour picker']);
    document.querySelector('#background-color .help').setAttribute('title', i18n['Help']);
    document.querySelector('#background-color .sliders').setAttribute('aria-label', i18n['Background colour sliders']);
    document.querySelector('#background-color .picker').setAttribute('aria-label', i18n['Background colour picker']);
    document.querySelector('#background-color .help').setAttribute('aria-label', i18n['Background help']);

    document.querySelector('#background-color h2').textContent = i18n['Background colour']
    document.querySelector('#background-format-selector').setAttribute('aria-label', i18n['Select default format for background colour'])
    document.querySelector('#background-color > div.container > input').setAttribute('aria-label', i18n['Background colour value'])

    document.querySelector('#background-help > .title').textContent = i18n['Supported formats are']
    document.querySelector('#background-help > ul > li.names').textContent = i18n['Names']

    document.querySelector('#background-rgb > h2').textContent = i18n['Background RGB input']
    document.querySelector('#background-hsl > h2').textContent = i18n['Background HSL input']
    document.querySelector('#background-hsv > h2').textContent = i18n['Background HSV input']

    document.querySelector('#background-rgb > div.sync > label > span').textContent = i18n['Synchronize colour values']
    document.querySelector('#background-rgb > div.sync > label').setAttribute('aria-label',i18n['Synchronize background colour values'])

    /* 
        [ForEach Patterns]
        This allows you to avoid repeating similar codes
        But, sliders must be have the same "aria-label" value with i18n keys
    */
    //  switch color, sliders, picker, help buttons in both color section
    document.querySelectorAll("div.buttons > button").forEach(button=>{
        const label = button.getAttribute('aria-label');
        if(label) button.setAttribute('aria-label',i18n[label]);
    })
    /* translate aria-label for color sliders */
    document.querySelectorAll('section[id$="-sliders"]').forEach(section=>{ // get both slider sections, background and foreground.
        const sliders = section.querySelectorAll('input[type="range"]'); // get sliders.
        sliders.forEach(slider=>{
            const label = slider.getAttribute("aria-label");
            if(label) {
                slider.setAttribute("aria-label",i18n[label]); // recycling written aria-label markup of main.html
            }
        })
    })
    // Visible Slider Labels for Foreground and Background.
    document.querySelectorAll('label.slider-lb').forEach((el)=>{
        const label = el.textContent.trim();
        el.textContent = i18n[label];
    });

    /* [End of ForEach Patterns] */

    document.querySelector('#sample-preview summary h2').textContent = i18n['Sample preview']
    document.querySelector('#sample-preview div.text').textContent = i18n['example text showing contrast']

    document.querySelector('#results header h2').textContent = i18n['WCAG 2.1 results']
    document.querySelector('#contrast-ratio h3').textContent = i18n['Contrast ratio']

    document.querySelector('details#criteria_1-4-3 h3').textContent = i18n['1.4.3 Contrast (Minimum) (AA)']
    document.querySelector('details#criteria_1-4-6 h3').textContent = i18n['1.4.6 Contrast (Enhanced) (AAA)']
    document.querySelector('details#criteria_1-4-11 h3').textContent = i18n['1.4.11 Non-text Contrast (AA)']

    document.querySelectorAll('details[id^=criteria] span.paraphrased').forEach(paraphrased=>{paraphrased.textContent = i18n['Paraphrased']})
    document.querySelector('details span#sc_1_4_3').innerHTML = i18n['sc_1_4_3']
    document.querySelector('details span#sc_1_4_6').innerHTML = i18n['sc_1_4_6']
    document.querySelector('details span#sc_1_4_11').innerHTML = i18n['sc_1_4_11']
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
