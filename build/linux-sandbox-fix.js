/**
 * electron-builder afterPack hook for Linux.
 *
 * On Linux the packaged chrome-sandbox binary requires SUID root (mode 4755)
 * to work, but AppImage / .deb / .rpm builds cannot set that at build time.
 * Modern distributions (Ubuntu 24.04+) also restrict unprivileged user
 * namespaces via AppArmor, which breaks the fallback path.
 *
 * This hook wraps the main Electron binary in a shell script that adds
 * --no-sandbox when unprivileged user namespaces are not usable, and
 * removes the chrome-sandbox binary that would otherwise trigger the
 * fatal SUID check.
 */

const fs = require('fs')
const path = require('path')

module.exports = async function (context) {
    if (context.electronPlatformName !== 'linux') return

    const appOutDir = context.appOutDir
    const executableName = context.packager.executableName

    const electronBinary = path.join(appOutDir, executableName)
    const renamedBinary = path.join(appOutDir, `${executableName}.bin`)
    const chromeSandbox = path.join(appOutDir, 'chrome-sandbox')

    // Rename the real Electron binary
    fs.renameSync(electronBinary, renamedBinary)

    // Remove chrome-sandbox to prevent the SUID check
    if (fs.existsSync(chromeSandbox)) {
        fs.unlinkSync(chromeSandbox)
    }

    // Create a wrapper script that passes --no-sandbox
    const wrapperScript = `#!/bin/bash
# Wrapper script to handle Linux sandbox compatibility.
# See: https://github.com/electron/electron/issues/17972

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
exec "$SCRIPT_DIR/${executableName}.bin" --no-sandbox "$@"
`

    fs.writeFileSync(electronBinary, wrapperScript, { mode: 0o755 })
}
