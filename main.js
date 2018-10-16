const { app, BrowserWindow } = require("electron");

app.on("ready", function(){
    new BrowserWindow();
});
