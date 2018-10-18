/**
 * @file
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

const $ = require("jquery");

/**
 * Empties a json object recursively.
 */
class ObjectEmptier
{
    /**
     * Empties a json object by setting its keys to the specific "empty" value based on its type.
     * Sub objects will be emptied recursively.
     *
     * @param {object} _object The object
     *
     * @return {object} The emptied object
     */
    getEmptiedObject(_object)
    {
        let objectWithEmptyValues = {};
        for (let propertyIndex in _object)
        {
            if (_object.hasOwnProperty(propertyIndex))
            {
                let propertyValue = _object[propertyIndex];
                objectWithEmptyValues[propertyIndex] = this.getEmptyValue(propertyValue);
            }
        }

        return objectWithEmptyValues;
    }

    /**
     * Returns the specific "empty" value for a value based on its type.
     *
     * @param {*} _value The value
     *
     * @returns {*} The values "empty" value
     */
    getEmptyValue(_value)
    {
        let emptyValue = null;

        if (_value !== null)
        {
            switch (typeof _value)
            {
                case "object":
                    emptyValue = this.getEmptiedObject(_value);
                    break;
                case "string":
                    emptyValue = "";
                    break;
                case "number":
                    emptyValue = NaN;
                    break;
            }

            if ($.isArray(_value)) emptyValue = [];
        }

        return emptyValue;
    }
}


module.exports = ObjectEmptier;
