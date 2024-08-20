const { version } = require('../package.json')
const semver = require('semver')

const apiUrl = 'https://api.github.com/repos/ThePacielloGroup/CCAe/releases?per_page=1'
const downloadUrl = "https://github.com/ThePacielloGroup/CCAe/releases/download"
function checkForUpdates() {
    console.log("Checking updates")
    return fetch(apiUrl)
        .then((response) => response.json())
        .then((json) => {
            const tagName = semver.clean(json[0].tag_name)
            if (semver.valid(tagName) && semver.gt(tagName, version)) {
                console.log("Update found", tagName)
                return {
                    version: tagName,
                    info: json[0].html_url,
                    download: getPackage(tagName, json[0].tag_name)
                }
            } else {
                console.log("No update found")
                return false
            }
        })
        .catch((error) => {
            console.error('error while checking for updates', error)
            return false
        })
}

function getPackage(version, tagName) {
    let package
    if (process.platform === "win32") {
        package = `CCA-Setup-${version}.msi`
    } else if (process.platform === "darwin") {
        package = `CCA-${version}.dmg`
    } else {
        package = `Colour-Contrast-Analyser-Setup-${version}.AppImage`
        try {
            const identity = path.join(process.resourcesPath, "package-type")
            if (!existsSync(identity)) {
                return package
            }
            console.info("Checking for beta autoupdate feature for deb/rpm distributions")
            const fileType = readFileSync(identity).toString().trim()
            console.info("Found package-type:", fileType)
            switch (fileType) {
            case "deb":
                package `Colour-Contrast-Analyser-Setup-${version}.deb`
                break
            case "rpm":
                package `Colour-Contrast-Analyser-Setup-${version}.rpm`
                break
            default:
                break
            }
        } catch (error) {
            console.warn(
            "Unable to detect 'package-type' for autoUpdater (beta rpm/deb support)",
            error.message)
        }
    }
    if (package) {
        return `${downloadUrl}/${tagName}/${package}`
    } else {
        return null
    }
}

module.exports.checkForUpdates = checkForUpdates