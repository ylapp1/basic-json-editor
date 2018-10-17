/**
 * @file
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

const $ = require("jquery");
const JSONEditor = require("@json-editor/json-editor");
const JsonFileOpener = require(__dirname + "/../lib/JsonFileOpener");
const JsonFileSaver = require(__dirname + "/../lib/JsonFileSaver");
const { dialog } = require("electron").remote;

let jsonEditor = null;
let jsonFileOpener = new JsonFileOpener();
let jsonFileSaver = new JsonFileSaver();

$(document).ready(function(){

    // Click handlers
    $("button#selectFileButton").on("click", openJsonFile);
    $("button#saveEditedJsonButton").on("click", saveJsonFile);

});


/**
 * Loads a json string into the json editor.
 *
 * @param {string} _jsonString The json string
 */
function setJsonEditorJsonString(_jsonString)
{
    let jsonEditorElement = $("div#json-editor").get(0);

    if (! jsonEditor) jsonEditor = new JSONEditor(jsonEditorElement, { schema: {} });
    jsonEditor.setValue(JSON.parse(_jsonString));
}

/**
 * Returns the json string that the json editor currently stores.
 *
 * @return {string|null} The json string or null if the json editor doesn't exist
 *
 * @throws Exception if there are errors while validating the json string
 */
function getJsonEditorJsonString()
{
    if (jsonEditor)
    {
        let errors = jsonEditor.validate();
        if(errors.length > 0)
        {
            throw errors.map(_error => _error.message).join("\n");
        }
        else
        {
            return JSON.stringify(jsonEditor.getValue());
        }
    }
    else return null;
}

/**
 * Reads the json file path from the user and loads the content of the selected file into the json editor.
 */
function openJsonFile()
{
    jsonFileOpener.showOpenDialog();

    let fileContentString = jsonFileOpener.getJsonFileContentString();
    if (fileContentString) setJsonEditorJsonString(fileContentString);
}

/**
 * Saves the edited json object from the json editor to a file.
 */
function saveJsonFile()
{
    let errorBoxTitle = "Fehler beim Speichern der Datei";

    let jsonString = "";
    try
    {
        jsonString = getJsonEditorJsonString();
    }
    catch (_errorMessage)
    {
        dialog.showErrorBox(errorBoxTitle, _errorMessage);
    }

    if (jsonString)
    {
        jsonFileSaver.showSaveDialog();

        try
        {
            jsonFileSaver.saveJsonString(jsonString);
        }
        catch (_error)
        {
            dialog.showErrorBox(errorBoxTitle, _error.message);
        }
    }
    else dialog.showErrorBox(errorBoxTitle, "Kein JSON String im Editor geladen");
}
