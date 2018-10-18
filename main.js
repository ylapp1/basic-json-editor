/**
 * @file
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

const { app, BrowserWindow } = require("electron");

// The main browser window
let mainBrowserWindow = null;


/**
 * Initializes the main browser window.
 */
function initialize()
{
    mainBrowserWindow = new BrowserWindow();

    // Hide the menu bar
    mainBrowserWindow.setMenu(null);

    mainBrowserWindow.loadFile("pages/index.html");
}


app.on("ready", initialize);
