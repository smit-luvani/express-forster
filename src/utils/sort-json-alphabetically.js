/**
 * @description Sort JSON alphabetically (recursive). Just to make it look good and easy to read.
 * @copyright https://github.com/ShivrajRath/jsonabc
 */

function isArray(val) { return Object.prototype.toString.call(val) === '[object Array]' }
function isPlainObject(val) { return Object.prototype.toString.call(val) === '[object Object]' }

// Sorting Logic
function sortJSONObject(originalObject) {
    var newObject = {};

    if (isArray(originalObject)) {
        newObject = originalObject;
        newObject.forEach(function (v, i) {
            newObject[i] = sortJSONObject(v);
        });
    } else if (isPlainObject(originalObject)) {
        newObject = {};
        Object.keys(originalObject)
            .sort(function (a, b) {
                return a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0;
            })
            .forEach(function (key) {
                newObject[key] = sortJSONObject(originalObject[key]);
            });
    } else {
        newObject = originalObject;
    }

    return newObject;
}

function sort(inputObject) {
    try {
        if (typeof inputObject === 'string') {
            var obj = JSON.parse(inputObject);
        } else {
            var obj = JSON.parse(JSON.stringify(inputObject)); // clone
        }

        return sortJSONObject(obj);
    } catch (error) {
        throw error;
    }
};

module.exports = sort;