/**
 * @file
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

const { dialog } = require("electron").remote;
const fs = require("fs");

/**
 * Provides methods to show a "Select save file" dialog to select a single json output file and to save a string to the selected file.
 */
class JsonFileSaver
{
    /**
     * JsonFileSaver constructor.
     */
    constructor()
    {
        this.filePath = null;
    }

    /**
     * Shows a "Select save file" dialog and saves the file path that the user selected.
     */
    showSaveDialog()
    {
        let filePath = dialog.showSaveDialog({
            filters: [
                {name: "json", extensions: ["json"]}
            ]
        });

        if (filePath) this.filePath = filePath;
        else this.filePath = null;
    }

    /**
     * Saves a json string to the last selected file.
     * Will do nothing if the filePath is not set.
     *
     * @param {string} _jsonString The json string
     */
    saveJsonString(_jsonString)
    {
        if (this.filePath)
        {
            fs.writeFileSync(this.filePath, _jsonString);
        }
    }
}


module.exports = JsonFileSaver;
