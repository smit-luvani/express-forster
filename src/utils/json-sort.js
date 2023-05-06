function isPlainObject(val) { return Object.prototype.toString.call(val) === '[object Object]' }

// Sorting Logic
function sortJSONObject(originalObject) {
    var newObject = {};

    if (Array.isArray(originalObject)) {
        newObject = originalObject;

        originalObject.forEach((value, index) => newObject[index] = sortJSONObject(value));

        newObject = newObject.sort(function (a, b) {
            a = JSON.stringify(a);
            b = JSON.stringify(b);
            return a < b ? -1 : (a > b ? 1 : 0);
        });
    } else if (isPlainObject(originalObject)) {
        Object.keys(originalObject).sort(function (a, b) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        }).forEach(function (key) {
            newObject[key] = sortJSONObject(originalObject[key]);
        });
    } else {
        newObject = originalObject;
    }

    return newObject;
}

/**
 * @author Smit Luvani
 * @description Sort JSON alphabetically (recursive). Just to make it look good and easy to read.
 * - It supports array of JSON objects.
 * - It will not sort values if Array contains numeric values.
 * @param {object} inputObject Array or JSON Object.
 * @returns {object} Sorted Object
 * 
 * @module https://github.com/ShivrajRath/jsonabc
 * @license MIT
 */
function sort(inputObject) {
    try {
        if (typeof inputObject === 'string') {
            inputObject = JSON.parse(inputObject);
        } else {
            inputObject = inputObject;
        }

        return sortJSONObject(inputObject);
    } catch (error) {
        throw error;
    }
};

module.exports = sort;


