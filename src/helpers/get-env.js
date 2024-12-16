const getLoggerInstance = require("../utils/find-parent-logger")

/**
 * @author Smit Luvani
 * @description It will return the value of the environment variable based on environment variable name
 */
module.exports = function (variable) {
    const logger = getLoggerInstance(...arguments);

    if (process.env[variable]) {
        logger.silly(`Helper [ENV][FOUND]: ${variable}`)
        return process.env[variable]
    }

    // Find All parent function name 
    const stackArray = new Error().stack.split('\n').map((item) => { return item.trim() }).slice(1)

    logger.silly(`Helper [ENV][STACK]: ${variable} not found.`, stackArray)

    return null;
}