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
    'main.rounding': 1,
    'main.alwaysOnTop': true,
    'main.lang': 'auto',
    'main.picker': (process.platform === 'win32' || process.platform === 'win64' || /^(msys|cygwin)$/.test(process.env.OSTYPE))?2:1, // Disable for Windows until https://github.com/electron/electron/issues/27980
    'foreground.format': 'hex',
    'background.format': 'hex',
    'foreground.picker.shortcut': 'F11',
    'background.picker.shortcut': 'F12',
    'foreground.sliders.open': false,
    'background.sliders.open': false,
    'foreground.sliders.tab': 'rgb',
    'background.sliders.tab': 'rgb',
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
        return value
    },
    set: function (name, value) {
        this.storage.setItem(name, value)
    }
}

module.exports = GlobalStorage;