// Preferences structure
// main : {
//     position : {
//         x,
//         y,
//     },
//     rounding,
//     alwaysOnTop,
//     lang
// },
// foreground : {
//     format,
//     picker : {
//         shortcut
//     },
//     sliders : {
//         open,
//         tab
//     }
// },
// background : {
//     format,
//     picker : {
//         shortcut
//     },
//     sliders : {
//         open,
//         tab
//     }
// }

const defaults = {
    'main.checkForUpdates': false,
    'main.lang': 'auto',
    'main.checkForUpdates': false,
    'main.rounding': 1,
    'main.alwaysOnTop': true,
    'main.lang': 'auto',
    'foreground.format': 'hex',
    'background.format': 'hex',
    'foreground.picker.shortcut': 'F11',
    'background.picker.shortcut': 'F12',
    'main.foreground.sliders.open': false,
    'main.background.sliders.open': false,
    'main.foreground.sliders.tab': 'rgb',
    'main.background.sliders.tab': 'rgb',
}

function GlobalStorage(win) {
    if (win) {
        this.storage = win.localStorage;
    } else {
        const { localStorage } = require('electron-browser-storage');
        this.storage = localStorage
    }
}

GlobalStorage.prototype = {
    get: async function (name) {
        let value = await this.storage.getItem(name)
        if (value === null && name in defaults) {
            value = defaults[name]
        }
        console.log('storage get', name, value)
        return value
    },
    set: function (name, value) {
        this.storage.setItem(name, value)
    }
}

module.exports = GlobalStorage;