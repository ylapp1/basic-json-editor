/**
 * @file
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

/*
 * jQuery is saved as "jQuery" so that bootstrap can detect and use it.
 * It is also saved as "$" so that it can be used in this javascript file as usual.
 */
const $ = jQuery = require("jquery");

const { dialog } = require("electron").remote;
const JsonEditorHandler = require(__dirname + "/../lib/JsonEditorHandler/JsonEditorHandler");
const JsonFileOpener = require(__dirname + "/../lib/FileHandler/JsonFileOpener");
const JsonFileSaver = require(__dirname + "/../lib/FileHandler/JsonFileSaver");

let jsonEditorHandler = null;
let jsonFileOpener = new JsonFileOpener();
let jsonFileSaver = new JsonFileSaver();

$(document).ready(function(){

    // Initialize the json editor handler
    let jsonEditorElement = $("div#json-editor").get(0);
    jsonEditorHandler = new JsonEditorHandler(jsonEditorElement);
    jsonEditorHandler.init().then(function(){

        // Initialize click listeners
        $("button#selectFileButton").on("click", openJsonFile);
        $("button#selectSchemaFileButton").on("click", openSchemaFile);
        $("button#saveEditedJsonButton").on("click", saveJsonFile);
        $("button#resetEditorFields").on("click", resetJsonEditorFields);
        $("button#clearEditorButton").on("click", clearEditor);

    });

});


/**
 * Reads the json file path from the user and loads the content of the selected file into the json editor.
 */
function openJsonFile()
{
    jsonFileOpener.showOpenDialog();

    let fileContentString = jsonFileOpener.getJsonFileContentString();
    if (fileContentString) jsonEditorHandler.setJsonEditorJsonString(fileContentString);
}

/**
 * Reads the schema json file path from the user and loads the content of the selected file into the json editor.
 */
function openSchemaFile()
{
    jsonFileOpener.showOpenDialog();

    let fileContentString = jsonFileOpener.getJsonFileContentString();
    if (fileContentString) jsonEditorHandler.setJsonEditorSchemaString(fileContentString);
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
        jsonString = jsonEditorHandler.getJsonEditorJsonString();
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
    else dialog.showErrorBox(errorBoxTitle, "Keine Datei im Editor geladen");
}

/**
 * Resets the json editor fields.
 */
function resetJsonEditorFields()
{
    jsonEditorHandler.resetJsonEditorFields();
}

/**
 * Clears the json editor.
 */
function clearEditor()
{
    jsonEditorHandler.clearJsonEditor();
}
