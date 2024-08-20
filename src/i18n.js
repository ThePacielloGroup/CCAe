const electron = require('electron')
const fs = require('fs')
const path = require("path")

let loadedLanguage
let languagesJSON
let app = electron.app ? electron.app : electron.remote.app
let localLang

module.exports = i18n

function i18n(lang) {
    localLang = lang
    if (!lang || lang === "auto") {
        localLang = app.getLocale()
    }

    const fileext = '.json'
    const translationsPath = path.join(__dirname,'views','translations')
    const localizedFile = path.join(translationsPath, localLang + fileext)
    const fallBackFile  = path.join(translationsPath, 'en' + fileext)

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

i18n.prototype.asObject = function() {
    return loadedLanguage
}

i18n.prototype.lang = function() {
    return localLang
}