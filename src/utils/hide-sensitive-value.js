let sensitiveKey = require('../config/default').sensitiveKey

/**
 * @author Smit Luvani
 * @description Sanitize Key-Values before logging
 * - Keywords to manage sensitive keys are defined in ./src/config as 'sensitiveKey'
 * - It doesn't support multi-level/nested object and array
 * @param {object} object 
 * @param {boolean} [removeSensitiveKey=false] Remove sensitive key-value from object
 * @param {{
 * replaceWith: string, 
 * mutation: boolean,
 * }} options
 * @callback cb Callback function
 * @returns {object} Sanitized Object
 */
module.exports = (object, removeSensitiveKey = false, options, cb) => {
    !options ? options = {
        replaceWith: '***',
        mutation: false
    } : null;

    if (typeof object === 'object') {

        if (options.mutation == false) object = { ...object } // Clone object to avoid mutation

        for (let key in object) {
            if (sensitiveKey.includes(key)) {
                if (removeSensitiveKey) {
                    delete object[key]
                } else {
                    object[key] = options?.replaceWith || '***'
                }
            }
        }
    }
    if (cb) {
        cb(object)
    }
    return object
}