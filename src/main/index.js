'use strict'

import { app, BrowserWindow, ipcMain, Tray, nativeImage, nativeTheme, Menu } from 'electron'

let tray
let window

app.dock.hide()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  // Setup the menubar with an icon
  let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Refresh',
      type: 'normal',
      click: () => {
        window.webContents.send('refresh')
      }
    },
    {
      label: 'Reset',
      type: 'normal',
      click: () => {
        window.webContents.send('reset')
      }
    },
    {
      label: 'Load Examples',
      type: 'normal',
      click: () => {
        window.webContents.send('load-examples')
      }
    },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.on('right-click', (event, bounds) => {
    tray.popUpContextMenu(contextMenu)
  })

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', (event) => {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: 'detach' })
    }
  })

  // Make the popup window for the menubar
  window = new BrowserWindow({
    // width: 2000,
    maxWidth: 400,
    resizable: true,
    minHeight: 400,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true

    }
  })

  window.loadURL(winURL)

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

  ipcMain.on('oauth-start', (event, url) => {
    console.log(`Opening oAuth: ${url}`)
  })

  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })

  window.on('closed', () => {
    window = null
  })
}

function toggleWindow () {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

function showWindow () {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x = 0
  let y = 0
  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }

  window.setPosition(x, y + 20, false)
  window.setVisibleOnAllWorkspaces(true)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Tray icon as Base64
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAA
                  C1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6A
                  AAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADd
                  cAAA3XAUIom3gAAAAHdElNRQfhBx8MNR1ju65VAAABP0lEQVQoz3WRvyvEcR
                  zGX5+vH4fp5OpbV6TbbFZJUlKyGQ10jPcHiAzfyT8gxcKZDEp2ZVUGblOSuA
                  HfOsXgKPEycH4kz/Qs757neb/gU4567I0LLnjjsaP8lEMumzpowXPPLTho6r
                  xZgAgcZ5cuqjxwyw473HJPlQInjn3cb7tk8M5LcyYm5rz0zuCS2xABPdSJkb
                  5QAwg1+pCYOj0QWSJig5R8eAKg3xli8qRs0mIJ9x0GcMoAJlYse+YKgMPuN3
                  PAoiO0Mccuz8BeSMxw5SPPDHAQfW19xS8faPr+QSNixTPLVkzAyKlGBJY8st
                  Ngq73OuGcCYKvBrIeWorDKC0VirknDFhUA27kmZpa3sBoBVTpICZyaAzDHKY
                  GUDqrQDGyyTjcXFKmTAepMUGaNSaYbRbPO/4G17NBvov/gfgf8+8SPMRMrfA
                  AAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQxMjo1MzoyOSswMjowML
                  Lr6YgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMTI6NTM6MjkrMD
                  I6MDDDtlE0AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48Gg
                  AAAABJRU5ErkJggg==`

// app.on('activate', () => {
//   if (window === null) {
//     createWindow()
//   }
// })

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
