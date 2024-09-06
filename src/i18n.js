const fs = require('fs')
const path = require("path")

let loadedLanguage
let fallBackLanguage
let languagesJSON

module.exports = i18n

function i18n(lang, localLang) {
    if (!lang || lang === "auto") {
        lang = localLang
    }

    const fileext = '.json'
    const translationsPath = path.join(__dirname,'views','translations')
    const localizedFile = path.join(translationsPath, lang + fileext)
    const fallBackFile  = path.join(translationsPath, 'en' + fileext)

    fallBackLanguage = JSON.parse(fs.readFileSync(fallBackFile), 'utf8')
    if (fs.existsSync(localizedFile)) {
        loadedLanguage = JSON.parse(fs.readFileSync(localizedFile), 'utf8')
    } else {
        loadedLanguage = fallBackLanguage
    }
    languagesJSON = JSON.stringify(loadedLanguage)
}

i18n.prototype.T = function(section, phrase) {
    let translation = loadedLanguage[section][phrase]
    if (translation === undefined) {
        translation = fallBackLanguage[section][phrase]
        if (translation === undefined) {
            translation = phrase
        }
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