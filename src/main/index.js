'use strict'

import { app, BrowserWindow, ipcMain, Tray, nativeTheme, Menu } from 'electron'
import path from 'path'

let tray
let window

app.dock.hide()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  const logoUrl = path.join(__dirname, 'icon.png')
  console.log('Logo', logoUrl)
  // Setup the menubar with an icon
  // let icon = nativeImage.createFrom(base64Icon)
  tray = new Tray(logoUrl)
  tray.setIgnoreDoubleClickEvents(true)

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
        window.loadURL(winURL)
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

  nativeTheme.themeSource = 'system'

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

  ipcMain.on('oauth-start', (event, clientId) => {
    const oAuthUrl = `https://auth.truelayer.com/?response_type=code&client_id=${clientId}&scope=info%20accounts%20balance%20cards%20offline_access&redirect_uri=http://localhost/oauth&providers=uk-ob-all%20uk-oauth-all%20uk-cs-mock`

    console.log(`loading oauth: ${oAuthUrl}`)
    window.loadURL(oAuthUrl)
  })

  const {session: {webRequest}} = window.webContents

  const filter = {
    urls: [
      'http://localhost/oauth*'
    ]
  }

  webRequest.onBeforeRequest(filter, async ({url}) => {
    console.log('handle-oauth')
    await window.loadURL(winURL)
    window.webContents.send('handle-oauth', url)
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

  window.setPosition(x, y + 5, false)
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
