const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

const url = require('url');
const path = require('path');
const isDev = require('electron-is-dev');
const { webContents } = require('electron');


let mainWindow;
let deepLinkUrl;
let onlineStatus;

const protocol = electron.protocol;
const PROTOCOL_PREFIX = 'nutri';

const locked = app.requestSingleInstanceLock();
if (!locked) {
    app.quit()
} else {
    app.on('second-instance', ((event, argv, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.

        // Protocol handler for win32
        // argv: An array of the second instance’s (command line / deep linked) arguments
        if (process.platform == 'win32') {
            // Keep only command line / deep linked arguments
            deepLinkUrl = argv.slice(2).toString().replace('nutri:/', "");
        }

        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
        mainWindow.webContents.send('protocol-route', `${deepLinkUrl}`)
    }))
}

// if (shouldQuit) {
// 	app.quit()
// 	return;
// }

app.whenReady().then(() => {
    onlineStatus = new BrowserWindow({ width: 0, height: 0, show: false })
    onlineStatus.loadURL(`file://${__dirname}/index.html`)
})

ipcMain.on('online-status-changed', (event, status) => {
    console.log(status)
})


function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 1600,
        minHeight: 900,
        frame: false,
        icon: __dirname + "/nutriLogo.png",
        webPreferences: {
            nodeIntegration: true,
        }
    });
    protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {
        const fullUrl = formFull(req.url)
        devToolsLog("full url to open" + fullUrl)
        mainWindow.loadURL(fullUrl)
    })
    mainWindow.loadURL(isDev
        ? 'http://localhost:3000'
        : url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: 'file:',
            slashes: true
        }))

    if (isDev) {
        //Open Dev Tools
        //mainWindow.webContents.openDevTools();
        //console.log(webContents.getAllWebContents());
    }
    //console.log(win.webContents.getURL())
    //mainWindow.webContents.openDevTools();
    //console.log(webContents.getURL())

    //console.log(webContents.getAllWebContents());
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.setMenu(null);
    mainWindow.setResizable(true);
}

//console.log(win.webContents.getURL())
// window.loadURL(url.format({
// 	pathname: path.join(__dirname, "index.html"),
// 	protocol: 'file:',
// 	slashes: true
// }))




app.on('closed', function () {
    mainWindow = null;
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.setAsDefaultProtocolClient("nutri");


ipcMain.handle('minimize-event', () => {
    mainWindow.minimize()
})

ipcMain.handle('maximize-event', () => {
    mainWindow.maximize()
})

ipcMain.handle('unmaximize-event', () => {
    mainWindow.unmaximize()
})

ipcMain.handle('close-event', (evnt, arg) => {
    console.log("close triggered");
    app.on('window-all-closed', () => {
        app.quit();
    });
    console.log("app should quit")
    app.quit();
})



app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
        const content = mainWindow.webContents;
        console.log(content)
    }
    const content = mainWindow.webContents;
    console.log(content)
});

app.on('open-url', function (event, url) {
    event.preventDefault()
    deepLinkUrl = url;
    console.log(deepLinkUrl)
    console.log("open-url# " + deepLinkUrl)
    logEverywhere("open-url# " + deepLinkUrl)
})

function logEverywhere(s) {
    console.log(s)
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
    }
}