const electron = require('electron')
const fs = require('fs')
const path = require("path")

let loadedLanguage
let languagesJSON
let app = electron.app ? electron.app : electron.remote.app

module.exports = i18n

function i18n() {
    const fileext = '.json'
    const translationsPath = path.join(__dirname,'views','translations')
    const localizedFile = path.join(translationsPath, app.getLocale() + fileext)
    const fallBackFile  = path.join(translationsPath, 'fr' + fileext)

    if (fs.existsSync(localizedFile)) {
        loadedLanguage = JSON.parse(fs.readFileSync(localizedFile), 'utf8')
    } else {
        loadedLanguage = JSON.parse(fs.readFileSync(fallBackFile), 'utf8')
    }
    languagesJSON = JSON.stringify(loadedLanguage)
}

i18n.prototype.menuT = function(phrase) {
    let translation = loadedLanguage.Menu[phrase]
    if(translation === undefined) {
         translation = phrase
    }
    return translation
}

i18n.prototype.asJSON = function() {
    return languagesJSON
}