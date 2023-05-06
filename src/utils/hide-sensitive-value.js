const sensitiveKey = require('../config/default').sensitiveKey

/**
 * @author Smit Luvani
 * @description Sanitize Key-Values before logging
 * - Keywords to manage sensitive keys are defined in ./src/config as 'sensitiveKey'
 * @param {object} object 
 * @param {boolean} [removeSensitiveKey=false] Remove sensitive key-value from object
 * @param {{
 * replaceWith: string, 
 * mutation: boolean,
 * }} options
 * @callback cb Callback function
 * @returns {object} Sanitized Object
 */
function hideSensitiveValue(object, removeSensitiveKey = false, options, cb) {
    if (!options) options = { replaceWith: '***', mutation: false }

    if (cb && typeof cb !== 'function') throw new Error('[hideSensitiveValue]: Callback function is not a function')

    try {
        if (typeof object === 'object') {

            if (options.mutation == false) object = JSON.parse(JSON.stringify(object)) // Clone Object

            for (let key in object) {
                if (typeof object[key] === 'object') {
                    object[key] = hideSensitiveValue(object[key], removeSensitiveKey, options)
                } else if (sensitiveKey.includes(key)) {
                    if (removeSensitiveKey) {
                        delete object[key]
                    } else {
                        object[key] = options?.replaceWith || '***'
                    }
                }
            }
        }

        return cb ? cb(object) : object;

    } catch (error) {
        throw cb ? cb(null, error) : error
    }
}

module.exports = hideSensitiveValue;