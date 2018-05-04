const Color = require('color')

class CCAController {
    constructor(browsers, sharedObject) {
        this.browsers = browsers
        this.sharedObject = sharedObject
    }

    updateForegroundFromHex(hexColor) {
        this.sharedObject.foregroundColor = Color(hexColor)
        this.updateContrastRatio()
        this.sendEventToAll('foregroundColorChanged')
    }

    updateBackgroundFromHex(hexColor) {
        this.sharedObject.backgroundColor = Color(hexColor)
        this.updateContrastRatio()
        this.sendEventToAll('backgroundColorChanged')
    }

    updateContrastRatio() {
        this.sharedObject.contrastRatio = this.sharedObject.foregroundColor.contrast(this.sharedObject.backgroundColor)
        this.sharedObject.contrastRatioRounded = Number(cr.toFixed(1))
    }

    sendEventToAll(event) {
        const {main} = this.browsers
        main.getWindow().webContents.send(event)
    }
}

module.exports = CCAController