const { ipcRenderer } = require('electron')
// Usage of 'electron-store'
const store = {
  async get(key) {
    const { invoke } = ipcRenderer
    let value = await invoke('store', 'get', key)
    try {
      value = JSON.parse(value)
    } finally {
      return value
    }
  },
  async set(key, value) {
    const { invoke } = ipcRenderer
    let val = value
    try {
      if (value && typeof value === 'object') {
        val = JSON.stringify(value)
      }
    } finally {
      await invoke('store', 'set', key, val)
    }
  },
};

module.exports = store