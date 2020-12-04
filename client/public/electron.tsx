	const electron = require('electron');
	const ipcMain = require('electron').ipcMain;
	const app = electron.app;
	const BrowserWindow = electron.BrowserWindow;

	const path = require('path');
	const isDev = require('electron-is-dev');

	let mainWindow;

	function createWindow() {
		mainWindow = new BrowserWindow({
			minWidth: 1380, 
			minHeight: 900,
			frame: false,
			icon: __dirname + "/logo.png",
			webPreferences: {
				nodeIntegration: true,
			}
		});
		mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
		if (isDev) {
			// Open the DevTools.
			//BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
			mainWindow.webContents.openDevTools();
		}
			mainWindow.on('closed', () => mainWindow = null);
			mainWindow.setMenu(null);
			mainWindow.setResizable(true);
	}


	ipcMain.handle('minimize-event', () => {
    mainWindow.minimize()
})

ipcMain.handle('maximize-event', () => {
    mainWindow.maximize()
})

ipcMain.handle('unmaximize-event', () => {
    mainWindow.unmaximize()
})

ipcMain.handle('close-event', () => {
	app.on('window-all-closed', app.quit());
	app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});
    app.quit();
})


	app.on('ready', createWindow);

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		if (mainWindow === null) {
			createWindow();
		}
	});