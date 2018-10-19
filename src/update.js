/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
const { dialog, Menu } = require('electron')
const { autoUpdater } = require('electron-updater')

let releaseName, releaseNotes
autoUpdater.autoDownload = false

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Auto Update Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', (ev) => {
  autoUpdater.downloadUpdate()
  var menu = Menu.getApplicationMenu();
  menu.getMenuItemById('menuUpdateChecking').visible = false
  menu.getMenuItemById('menuUpdateFound').visible = true
})

autoUpdater.on('update-not-available', (ev) => {
  var menu = Menu.getApplicationMenu();
  menu.getMenuItemById('menuUpdateChecking').visible = false
  menu.getMenuItemById('menuUpdateNotFound').visible = true
})

autoUpdater.on('update-downloaded', (ev) => {
  releaseName = ev.releaseName
  releaseNotes = ev.releaseNotes
  var menu = Menu.getApplicationMenu();
  menu.getMenuItemById('menuUpdateFound').visible = false
  menu.getMenuItemById('menuUpdateInstall').visible = true

})

function checkForUpdates() {
  autoUpdater.checkForUpdates()
}

function installUpdate() {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: `${releaseName} has been downloaded. The application will be closed to install the update.`
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
}

module.exports.checkForUpdates = checkForUpdates
module.exports.installUpdate = installUpdate