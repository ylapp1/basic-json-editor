/**
 * @file
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

const $ = require("jquery");
const { dialog } = require("electron").remote;
const JSONEditor = require("@json-editor/json-editor");
const ObjectEmptier = require(__dirname + "/ObjectEmptier");
const ValidPropertiesExtractor = require(__dirname + "/ValidPropertiesExtractor");

/**
 * Handles creating and manipulating the json editor.
 */
class JsonEditorHandler
{
    /**
     * JsonEditorHandler constructor.
     *
     * @param {Element} _jsonEditorElement The json editor element
     */
    constructor(_jsonEditorElement)
    {
        this.jsonEditorElement = _jsonEditorElement;
        this.schema = {};
        this.isInitialized = false;
        this.objectEmptier = new ObjectEmptier();
        this.validPropertiesExtractor = new ValidPropertiesExtractor();
    }


    // Public Methods

    /**
     * Initializes the json editor.
     *
     * @return {Promise} The initialization promise
     */
    init()
    {
        let self = this;

        return new Promise(function(_resolve, _reject){

            if (! self.isInitialized)
            {
                self.jsonEditor = new JSONEditor(self.jsonEditorElement, {
                    schema: self.schema,
                    show_errors: "always",
                    theme: "bootstrap3",
                    iconlib: "bootstrap3"
                });

                self.jsonEditor.on("ready", function(){
                    self.isInitialized = true;
                    _resolve("JSONEditor initialization finished");
                })
            }
            else _resolve("JSONEditor already initialized");

        });
    }

    /**
     * Loads a json string into the json editor.
     *
     * @param {string} _jsonString The json string
     */
    setJsonEditorJsonString(_jsonString)
    {
        if (this.isInitialized)
        {
            this.showJsonEditor();
            this.resetJsonEditorFields();
            this.setJsonEditorValue(JSON.parse(_jsonString));
        }
    }

    /**
     * Returns the json string that the json editor currently stores.
     *
     * @return {string|null} The json string or null if the json editor doesn't exist
     *
     * @throws Exception if there are errors while validating the json string
     */
    getJsonEditorJsonString()
    {
        if (this.isInitialized && $(this.jsonEditorElement).css("visibility") === "visible")
        {
            let errors = this.jsonEditor.validate();
            if(errors.length > 0)
            {
                throw errors.map(_error => _error.message).join("\n");
            }
            else
            {
                return JSON.stringify(this.jsonEditor.getValue());
            }
        }
        else return null;
    }

    /**
     * Sets the json editor schema to a specified json string.
     *
     * @param {string} _jsonString The schema json string
     */
    setJsonEditorSchemaString(_jsonString)
    {
        this.showJsonEditor();
        this.setJsonEditorSchema(JSON.parse(_jsonString));
    }

    /**
     * Resets the fields of the json editor to empty fields.
     */
    resetJsonEditorFields()
    {
        if (this.isInitialized && $(this.jsonEditorElement).css("visibility") === "visible")
        {
            let objectWithEmptyValues = this.objectEmptier.getEmptiedObject(this.jsonEditor.getValue());
            this.jsonEditor.setValue(objectWithEmptyValues);
        }
    }

    /**
     * Clears the json editor by rebuilding it and initializing it with an empty object.
     */
    clearJsonEditor()
    {
        if (this.isInitialized && $(this.jsonEditorElement).css("visibility") === "visible")
        {
            this.resetJsonEditorFields();
            this.setJsonEditorValue({});
            this.setJsonEditorSchema({});
        }
    }


    // Private Methods

    /**
     * Changes the visibility of the json editor to "visible" if it is "hidden".
     * The json editor is "hidden" by default and will be shown only when the "load file" or "load schema" buttons are used.
     */
    showJsonEditor()
    {
        if ($(this.jsonEditorElement).css("visibility") === "hidden")
        {
            $(this.jsonEditorElement).css("visibility", "visible");
        }
    }

    /**
     * Sets the value of the json editor to a specific object.
     *
     * @param {object} _value The new value of the json editor
     */
    setJsonEditorValue(_value)
    {
        let value = _value;

        if (! $.isEmptyObject(this.schema))
        {
            value = this.validPropertiesExtractor.extractValidProperties(this.jsonEditor, _value);

            if (! $.isEmptyObject(this.validPropertiesExtractor.discardedProperties))
            { // Print info message that some attributes were discarded

                let dialogJsonString = JSON.stringify(this.validPropertiesExtractor.discardedProperties, null, "  ");

                dialog.showMessageBox({
                    type: "info",
                    title: "Notwendige json Anpassungen",
                    message: "Die folgenden Attribute waren nicht mit dem Schema kompatibel und wurden verworfen:\n" + dialogJsonString
                });
            }
        }

        this.jsonEditor.setValue(value);
    }

    /**
     * Sets the json editor schema to a specified object.
     *
     * @param {object} _schema The new schema
     */
    setJsonEditorSchema(_schema)
    {
        // Fetch the current value of the json editor
        let jsonEditorValue = this.jsonEditor.getValue();
        if (! jsonEditorValue) jsonEditorValue = {};

        // Save the schema which will be used in the init() method
        this.schema = _schema;

        // Rebuild the json editor
        this.rebuildJsonEditorWithValue(jsonEditorValue);
    }

    /**
     * Rebuilds the json editor with a specific value.
     *
     * @param {object} _value The json editor value
     */
    rebuildJsonEditorWithValue(_value)
    {
        // Destroy the current json editor
        this.isInitialized = false;
        this.jsonEditor.destroy();

        // Rebuild the json editor
        let self = this;
        this.init().then(function(){
            self.setJsonEditorValue(_value);
        });
    }
}


module.exports = JsonEditorHandler;
