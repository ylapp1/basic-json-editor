/**
 * @file
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

const { dialog } = require("electron").remote;
const fs = require("fs");

/**
 * Provides methods to show a "Open file" dialog to select a single json file and to get the content of the file.
 */
class JsonFileOpener
{
    /**
     * JsonFileOpener constructor.
     */
    constructor()
    {
        this.filePath = null;
    }


    // Public Methods

    /**
     * Shows an "Open file" dialog and saves the file path that the user selected.
     */
    showOpenDialog()
    {
        let filePaths = dialog.showOpenDialog({
            "filters": [
                {name: "json", extensions: ["json"]}
            ],
            "properties": [ "openFile" ]
        });

        /*
         * The dialog allows selecting only one file at a time, therefore only the first array entry is saved.
         * If the user closes the window without selecting a file the filePaths variable will not be set
         */
        if (filePaths) this.filePath = filePaths[0];
        else this.filePath = null;
    }

    /**
     * Returns the content of the last selected json file.
     *
     * @returns {string|null} The content of the last selected json file or null if no file was selected
     */
    getJsonFileContentString()
    {
        if (this.filePath) return String(fs.readFileSync(this.filePath));
        else return null;
    }
}


module.exports = JsonFileOpener;
