const sensitiveKeys = ["password", "token", "authorization", "auth", "access_token", "user-agent"]

/**
 * @author Smit Luvani
 * @description Sanitize Key-Values before logging
 * - Keywords to manage sensitive keys are defined in ./src/config as 'sensitiveKey'
 * @param {object} object 
 * @param {boolean} [removeSensitiveKey=false] Remove sensitive key-value from object
 * @param {{
 * replaceWith: string, 
 * mutation: boolean,
 * keys: string[]
 * }} options
 * @callback cb Callback function
 * @returns {object} Sanitized Object
 */
function hideSensitiveValue(object, removeSensitiveKey = false, options, cb) {
    if (!options) options = { replaceWith: '***', mutation: false, keys: sensitiveKeys };

    if (cb && typeof cb !== 'function') {
        throw new Error('[hideSensitiveValue]: Callback function is not a function');
    }

    if (!options.keys) options.keys = sensitiveKeys;
    if (!Array.isArray(options.keys)) throw new Error('[hideSensitiveValue]: sensitiveKeys must be an array');
    if (options.keys.length === 0) throw new Error('[hideSensitiveValue]: sensitiveKeys must have at least one key');

    try {
        const stack = [{ obj: object, parent: null, key: null }];
        const result = options.mutation === false ? JSON.parse(JSON.stringify(object)) : object;

        while (stack.length > 0) {
            const { obj, } = stack.pop();

            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (typeof obj[prop] === 'object' && !options.keys.includes(prop)) {
                        stack.push({ obj: obj[prop] });
                        obj[prop] = hideSensitiveValue(obj[prop], removeSensitiveKey, options);
                    } else if (options.keys.includes(prop)) {
                        if (removeSensitiveKey) {
                            delete result[prop];
                        } else {
                            result[prop] = options.replaceWith || '***';
                        }
                    }
                }
            }
        }

        return cb ? cb(result) : result;

    } catch (error) {
        throw cb ? cb(null, error) : error;
    }
}

module.exports = hideSensitiveValue;