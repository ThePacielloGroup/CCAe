const { app, globalShortcut, clipboard, BrowserWindow } = require('electron')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    main.init()

    // Register a 'CommandOrControl+Alt+C' shortcut listener.
    globalShortcut.register('CmdOrCtrl+Alt+C', () => {
        copyResults()
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    main.init()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const Color = require('./CCAcolor')

let white = Color.rgb(0, 0, 0)
let black = Color.rgb(255, 255, 255)

global.sharedObject = {
    normal : {
        foregroundColor : white,
        foregroundColorMixed : white, // For alpha transparency mix with background
        backgroundColor : black,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
        advanced : ''
    },
    achromatopsia : {
        foregroundColor : null,
        backgroundColor : null,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
    },
    achromatomaly : {
        foregroundColor : null,
        backgroundColor : null,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
    },
    protanopia : {
        foregroundColor : null,
        backgroundColor : null,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
    },
    deuteranopia : {
        foregroundColor : null,
        backgroundColor : null,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
    },
    tritanopia : {
        foregroundColor : null,
        backgroundColor : null,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
    },
    protanomaly : {
        foregroundColor : null,
        backgroundColor : null,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
    },
    deuteranomaly : {
        foregroundColor : null,
        backgroundColor : null,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
    },
    tritanomaly : {
        foregroundColor : null,
        backgroundColor : null,
        contrastRatioRaw : 0,
        contrastRatioString : "xx:1",
        levelAA : 'regular',
        levelAAA : 'regular',
    }
}

const browsers = require('./browsers')(__dirname)
const {main, picker} = browsers

const CCAController = require('./CCAcontroller')

function copyResults() {
    let normal = global.sharedObject.normal
    let levelAA = ''
    let levelAAA = ''
    if (normal.levelAA === 'large') {
        levelAA = `Regular text failed at Level AA
    Large text passed at Level AA`
    } else if (normal.levelAA === 'regular') {
        levelAA = `Regular text passed at Level AA
    Large text passed at Level AA`
    } else { // Fail
        levelAA = 'Regular and Large text failed at Level AA'
    }
    if (normal.levelAAA === 'large') {
        levelAAA = `Regular text failed at Level AAA
    Large text passed at Level AAA`
    } else if (normal.levelAAA === 'regular') {
        levelAAA = `Regular text passed at Level AAA
    Large text passed at Level AAA`
    } else { // Fail
        levelAAA = 'Regular and Large text failed at Level AAA'
    }

    clipboard.writeText(`Foreground: ${normal.foregroundColorMixed.hex()}
Background: ${normal.backgroundColor.hex()}
The contrast ratio is: ${normal.contrastRatioString}
${levelAA}
${levelAAA}`)
}  
const mainController = new CCAController(browsers, global.sharedObject)

require('./controllers')(browsers, mainController)
