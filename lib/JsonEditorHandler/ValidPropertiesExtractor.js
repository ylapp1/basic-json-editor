/**
 * @file
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

/**
 * Extracts the valid properties of a json file compared to a json-editors schema.
 */
class ValidPropertiesExtractor
{
    /**
     * ValidPropertiesExtractor constructor.
     */
    constructor()
    {
        // Stores the discarded properties of the last extractValidProperties call
        this.discardedProperties = {};
    }


    // Public Methods

    /**
     * Extracts the valid properties of an object compared to a json-editors schema.
     * Also saves the discarded properties in the class attribute discardedProperties.
     * Additional properties are considered invalid.
     *
     * @param {JSONEditor} _jsonEditor The json-editor
     * @param {object} _object The object that will be the new value of the json editor
     *
     * @return {object} The valid properties of the object
     */
    extractValidProperties(_jsonEditor, _object)
    {
        let resultObject = {};
        this.discardedProperties = {};

        // Backup the original state of the no additional properties option
        let noAdditionalPropertiesValue = _jsonEditor.options.no_additional_properties;

        // Set the no additional properties option to true so that additional properties are detected as errors
        _jsonEditor.options.no_additional_properties = true;

        for (let propertyIndex in _object)
        {
            if (_object.hasOwnProperty(propertyIndex))
            { // The property is a property of the object and not one of its prototypes properties

                // Create a test object that contains solely the value to check
                let testObject = {};
                testObject[propertyIndex] = _object[propertyIndex];

                // Validate the test object
                let errors = _jsonEditor.validate(testObject);
                if (errors.length === 0)
                {
                    resultObject[propertyIndex] = _object[propertyIndex];
                }
                else
                {
                    this.discardedProperties[propertyIndex] = _object[propertyIndex];
                }
            }
        }

        _jsonEditor.options.no_additional_properties = noAdditionalPropertiesValue;

        return resultObject;
    }
}


module.exports = ValidPropertiesExtractor;
