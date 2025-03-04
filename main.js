const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let mainWindow;

app.whenReady().then(() => {
    // Start Express server in the background
    exec("node server/server.js", (error, stdout, stderr) => {
        if (error) console.error(`Error starting server: ${error.message}`);
        if (stderr) console.error(`Server stderr: ${stderr}`);
        console.log(`Server stdout: ${stdout}`);
    });

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile("public/index.html");
});