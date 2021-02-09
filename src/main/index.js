"use strict";

import { app, BrowserWindow, ipcMain, Tray, nativeTheme, Menu, nativeImage } from "electron";
import path from "path";

let tray;
let window;

app.dock.hide();

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = path.join(__dirname, "/static").replace(/\\/g, "\\\\");
}
const winURL = process.env.NODE_ENV === "development" ? "http://localhost:9080" : `file://${__dirname}/index.html`;

function createWindow() {
  let icon = nativeImage.createFromDataURL(base64Icon);
  tray = new Tray(icon);

  tray.setIgnoreDoubleClickEvents(true);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Home",
      type: "normal",
      click: () => {
        window.webContents.send("goto-home");
      },
    },
    {
      label: "Refresh",
      type: "normal",
      click: () => {
        window.webContents.send("refresh");
      },
    },
    {
      label: "Manage Connections",
      type: "normal",
      click: () => {
        window.webContents.send("goto-connections");
      },
    },
    {
      label: "Full Reset",
      type: "normal",
      click: () => {
        window.webContents.send("reset");
        window.loadURL(winURL);
      },
    },
    {
      label: "Quit",
      type: "normal",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.on("right-click", (event, bounds) => {
    tray.popUpContextMenu(contextMenu);
  });

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on("click", (event) => {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: "detach" });
    }
  });

  nativeTheme.themeSource = "system";

  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 400,
    minWidth: 400,
    height: 600,
    minHeight: 600,
    resizable: true,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
    },
  });

  window.loadURL(winURL);

  ipcMain.on("oauth-start", async (event, clientId) => {
    const oAuthUrl = `https://auth.truelayer.com/?response_type=code&client_id=${clientId}&scope=info%20accounts%20balance%20cards%20offline_access&redirect_uri=http://localhost/oauth&providers=uk-ob-all%20uk-oauth-all%20uk-cs-mock`;

    window.loadURL(oAuthUrl);

    const currentBounds = window.getBounds();
    window.setSize(800, currentBounds.height);

    showWindow(true);
  });

  const {
    session: { webRequest },
  } = window.webContents;

  const filter = {
    urls: ["http://localhost/oauth*"],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    console.log("handle-oauth");

    const currentBounds = window.getBounds();
    window.setSize(400, currentBounds.height, true);
    showWindow();

    await window.loadURL(winURL);
    window.webContents.send("handle-oauth", url);
  });

  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  window.on("close", () => {
    console.log(window);
  });

  window.on("closed", () => {
    window = null;
  });
}

function toggleWindow() {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
}

function showWindow(oAuth = false) {
  const trayPos = tray.getBounds();
  const windowPos = window.getBounds();
  let x = 0;
  let y = 0;
  if (process.platform === "darwin") {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  if (oAuth) {
    x -= 45;
  }

  window.setPosition(x, y + 5, true);

  window.setVisibleOnAllWorkspaces(true);
  window.show();
  window.focus();
}

ipcMain.on("show-window", () => {
  showWindow();
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAGAAAAABAAAAYAAAAAEAAqACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAAHWfLmAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACZmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzI8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CkUuZIEAAAGESURBVDgRjZM9SkNBEMfz8kjMDSyMaIo0QcFC5OkBJIViY+MlgjdJ0HgABTsLFQUhBxA7sQsqguIRFFLo8/fftxNHieDAj/nY2dmv2VIJyfO8LC3BzqAP92AiW7GsyHJzCIbJ6Cp0weQD4yki20Q51bhYsbACcBkzXtEdaEIK5WgrpjGJckORsCOcnqLINdTdNhfwV5xfjzmovGuT1+Qhqu4nz+HfwgvoXmzbKmI7yXRpByDpuJXm8Z/hGPbgHbbduI4j6avAA+iSGi6hjT+CGcXQs7/GG/ifMNSgRM9UcwWm8M/gDU5gKRZKo64Re4Tv93eT0yRJRrBFbAdU+IbcdWLaaWK5QROYdIQN4m1LxB7AofPHR1AjXIH0piWgp0FvfQT72MtwASbanXYy0B389YyLjN2BnnEV7Pw/n1ElGfSNFG4+xluMafUg2JqsZpMUjaQRHLXyuaKImsRaWW2cQBN2wRroFLtiVe0zVQj+9zOFyeSPP1NhFLux7zwkwUT2xO/8BVIyZOBoppyqAAAAAElFTkSuQmCC`;

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
